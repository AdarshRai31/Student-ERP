import React, { useEffect, useState } from "react";
import { fetchJSON } from "../utils/api";

type LibraryIssue = {
  issueId: string;
  student: string;
  book: string;
  issueDate: string;
  dueDate: string;
  returnDate: string;
  status: string;
};

type LibraryIssuesResponse = { success: boolean; data: LibraryIssue[] };

const LibrarySection: React.FC = () => {
  const [issues, setIssues] = useState<LibraryIssue[]>([]);
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

        const path = student ? `/public/library-issues?student=${encodeURIComponent(student)}` : `/public/library-issues`;
        const res = await fetchJSON<LibraryIssuesResponse>(path);
        if (!alive) return;
        setIssues(res.data || []);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load library issues');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <section className="library-section">
      <div className="card">
        <div className="card__header"><h3>Library Issues {studentId ? <span className="text-xs text-gray-500">(for {studentId})</span> : null}</h3></div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading library issues...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && issues.length === 0 && (
            <div className="text-sm text-gray-500">No library records.</div>
          )}

          {!loading && !error && issues.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Issue ID</th>
                    <th className="py-2 pr-4">Book</th>
                    <th className="py-2 pr-4">Issued</th>
                    <th className="py-2 pr-4">Due</th>
                    <th className="py-2 pr-4">Returned</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.slice(0, 25).map((r, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2 pr-4">{r.issueId}</td>
                      <td className="py-2 pr-4">{r.book}</td>
                      <td className="py-2 pr-4">{r.issueDate}</td>
                      <td className="py-2 pr-4">{r.dueDate}</td>
                      <td className="py-2 pr-4">{r.returnDate}</td>
                      <td className="py-2 pr-4">
                        <span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarySection;
