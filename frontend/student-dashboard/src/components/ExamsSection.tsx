import React, { useEffect, useState } from "react";
import { fetchJSON } from "../utils/api";

type ExamRow = { id: string; student?: string; name: string; date: string; type: string; status: string };
type ExamsResponse = { success: boolean; data: ExamRow[] };

const ExamsSection: React.FC = () => {
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        // Infer student identifier from localStorage
        const possibleKeys = ['userEmail','email','username','auth_user_email','auth_username'];
        let student: string | null = null;
        for (const k of possibleKeys) {
          const v = localStorage.getItem(k);
          if (v && v.includes('@')) { student = v; break; }
          if (!student && v) { student = v; }
        }
        if (!student) {
          const blob = localStorage.getItem('auth_user') || localStorage.getItem('user');
          if (blob) {
            try { const obj = JSON.parse(blob); student = obj?.email || obj?.username || null; } catch {}
          }
        }
        if (alive) setStudentId(student);

        const path = student ? `/public/exams?student=${encodeURIComponent(student)}` : `/public/exams`;
        const res = await fetchJSON<ExamsResponse>(path);
        if (!alive) return;
        setExams(res.data || []);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load exams');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <section className="exams-section">
      <div className="card">
        <div className="card__header">
          <h3>Exams & Results {studentId ? <span className="text-xs text-gray-500">(for {studentId})</span> : null}</h3>
        </div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading exams...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && exams.length === 0 && (
            <div className="text-sm text-gray-500">No exams scheduled.</div>
          )}

          {!loading && !error && exams.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exam</th><th>Date</th><th>Type</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.slice(0, 25).map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.name}</td>
                    <td>{exam.date}</td>
                    <td>{exam.type}</td>
                    <td>{exam.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExamsSection;
