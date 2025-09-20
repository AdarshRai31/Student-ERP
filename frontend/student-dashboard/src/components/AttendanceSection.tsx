import React, { useEffect, useMemo, useState } from "react";
import { fetchJSON } from "../utils/api";

type AttendanceRow = { student: string; courseId: string; date: string; status: string };
type AttendanceResponse = { success: boolean; data: AttendanceRow[] };

type Props = { limit?: number };

const AttendanceSection: React.FC<Props> = ({ limit = 50 }) => {
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
        // Do not force a fallback student; if none is found, fetch all records so data still shows
        if (alive) setStudentId(student);

        const qs = new URLSearchParams();
        if (student) qs.set('student', student);
        if (courseFilter) qs.set('courseId', courseFilter);
        if (startDate) qs.set('startDate', startDate);
        if (endDate) qs.set('endDate', endDate);
        const path = `/public/attendance${qs.toString() ? `?${qs.toString()}` : ''}`;
        const res = await fetchJSON<AttendanceResponse>(path);
        if (!alive) return;
        setRecords(res.data || []);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load attendance');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [courseFilter, startDate, endDate]);

  const summary = useMemo(() => {
    const s = { total: records.length, present: 0, absent: 0, late: 0 };
    for (const r of records) {
      const st = (r.status || '').toLowerCase();
      if (st === 'present') s.present++; else if (st === 'absent') s.absent++; else if (st === 'late') s.late++;
    }
    return s;
  }, [records]);

  const attendancePct = useMemo(() => {
    const denom = Math.max(1, summary.total);
    const presentish = summary.present + summary.late; // count late as presentish
    return Math.round((presentish / denom) * 100);
  }, [summary]);

  // Sort by date (desc) and cap rows for display
  const visibleRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return sorted.slice(0, limit);
  }, [records, limit]);

  return (
    <section className="attendance-section">
      <div className="card">
        <div className="card__header">
          <h3>Attendance Tracker {studentId ? <span className="text-xs text-gray-500">(for {studentId})</span> : null}</h3>
        </div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading attendance...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}

          {!loading && !error && (
            <>
              <div className="attendance-filters">
                <div className="form-group">
                  <label className="form-label" htmlFor="attendance-course-filter">Course</label>
                  <select
                    id="attendance-course-filter"
                    aria-label="Course filter"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="form-control form-control--sm"
                  >
                    <option value="">All</option>
                    {Array.from(new Set(records.map(r => r.courseId).filter(Boolean))).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="attendance-start-date">Start date</label>
                  <input
                    id="attendance-start-date"
                    aria-label="Start date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control form-control--sm"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="attendance-end-date">End date</label>
                  <input
                    id="attendance-end-date"
                    aria-label="End date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control form-control--sm"
                  />
                </div>
                <button
                  className="btn btn--secondary btn--sm attendance-filters__clear"
                  onClick={() => { setCourseFilter(''); setStartDate(''); setEndDate(''); }}
                  aria-label="Clear filters"
                >
                  Clear
                </button>
              </div>
              <div className="mb-3 text-sm">
                <span className="mr-4">Total: <strong>{summary.total}</strong></span>
                <span className="mr-4 text-green-600">Present: <strong>{summary.present}</strong></span>
                <span className="mr-4 text-red-600">Absent: <strong>{summary.absent}</strong></span>
                <span className="text-yellow-600">Late: <strong>{summary.late}</strong></span>
              </div>

              <div className="attendance-progress">
                <div className="attendance-progress__header">
                  <div style={{ fontWeight: 600 }}>Attendance (filtered)</div>
                  <div className="attendance-progress__pct">{attendancePct}%</div>
                </div>
                <div className="attendance-progress__bar">
                  <div className="attendance-progress__fill" style={{ ['--progress' as any]: `${attendancePct}%` }} />
                </div>
              </div>

              <div className="table-wrap">
                <table className="table table--compact">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRecords.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.date}</td>
                        <td>{r.courseId}</td>
                        <td>
                          <span className={`status-badge ${(r.status || '').toLowerCase()}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                    {visibleRecords.length === 0 && (
                      <tr>
                        <td colSpan={3} className="table-empty">No attendance records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AttendanceSection;
