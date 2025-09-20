import React, { useEffect, useState } from "react";
import { Assignment } from "../types";
import { fetchJSON } from "../utils/api";

type AssignmentsResponse = { success: boolean; data: Assignment[] };

const AssignmentsSection: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        // Try to infer the current student's identifier from localStorage
        const possibleKeys = [
          'userEmail', 'email', 'username',
          'auth_user_email', 'auth_username',
        ];
        let student: string | null = null;
        for (const k of possibleKeys) {
          const v = localStorage.getItem(k);
          if (v && v.includes('@')) { student = v; break; }
          if (!student && v) { student = v; }
        }
        // Some apps store a JSON object like { email, username }
        if (!student) {
          const blob = localStorage.getItem('auth_user') || localStorage.getItem('user');
          if (blob) {
            try {
              const obj = JSON.parse(blob);
              student = obj?.email || obj?.username || null;
            } catch {}
          }
        }
        if (alive) setStudentId(student);

        const path = student ? `/public/assignments?student=${encodeURIComponent(student)}` : `/public/assignments`;
        const res = await fetchJSON<AssignmentsResponse>(path);
        if (!alive) return;
        setAssignments(res.data || []);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load assignments");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <section className="assignments-section">
      <div className="card">
        <div className="card__header">
          <h3>Assignments {studentId ? <span className="text-xs text-gray-500">(for {studentId})</span> : null}</h3>
        </div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="scroll-area">
            {!loading && !error && assignments.length === 0 && (
              <div className="text-sm text-gray-500">No assignments.</div>
            )}
            {assignments.map((a) => (
              <div key={a.id} className="assignment-item">
                <h4>{a.title}</h4>
                <p>{a.subject}</p>
                <span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssignmentsSection;
