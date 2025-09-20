import React, { useEffect, useState } from "react";
import { fetchJSON } from "../utils/api";

type FinanceSummary = { total: number; paid: number; pending: number; currency?: string };
type FinanceResponse = { success: boolean; data: FinanceSummary };

const formatAmount = (n: number, currency = "₹") => {
  try { return `${currency}${n.toLocaleString()}`; } catch { return `${currency}${n}`; }
};

const FeesSection: React.FC = () => {
  const [summary, setSummary] = useState<FinanceSummary>({ total: 0, paid: 0, pending: 0, currency: "₹" });
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

        const path = student ? `/public/finance-summary?student=${encodeURIComponent(student)}` : `/public/finance-summary`;
        const res = await fetchJSON<FinanceResponse>(path);
        if (!alive) return;
        setSummary(res.data || { total: 0, paid: 0, pending: 0, currency: '₹' });
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load finance summary');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <section className="fees-section">
      <div className="card">
        <div className="card__header"><h3>Fee Management {studentId ? <span className="text-xs text-gray-500">(for {studentId})</span> : null}</h3></div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading fee summary...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="fee-summary">
              <div className="fee-item"><span>Total Fees</span><span>{formatAmount(summary.total, summary.currency)}</span></div>
              <div className="fee-item"><span>Paid</span><span className="paid">{formatAmount(summary.paid, summary.currency)}</span></div>
              <div className="fee-item"><span>Pending</span><span className="pending">{formatAmount(summary.pending, summary.currency)}</span></div>
              <div className="fee-actions">
                <button className="btn btn--primary"><i className="fas fa-credit-card"></i> Pay Now</button>
                <button className="btn btn--outline"><i className="fas fa-download"></i> Download Receipt</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeesSection;
