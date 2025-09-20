import React, { useEffect, useState } from "react";
import { Notice } from "../types";
import { fetchJSON } from "../utils/api";

type NoticesResponse = { success: boolean; data: Array<{ title: string; detail?: string; date?: string }> };

const NoticesSection: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([] as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetchJSON<NoticesResponse>('/public/notices');
        if (!alive) return;
        const mapped: Notice[] = (res.data || []).map((n, idx) => ({
          id: idx + 1,
          title: n.title,
          content: n.detail || '',
          date: n.date || '',
          priority: 'Medium',
          type: 'General'
        }));
        setNotices(mapped);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load notices');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <section className="notices-section">
      <div className="card">
        <div className="card__header"><h3>Notices</h3></div>
        <div className="card__body">
          {loading && <div className="text-sm text-gray-500">Loading notices...</div>}
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="scroll-area">
            {!loading && !error && notices.length === 0 && (
              <div className="text-sm text-gray-500">No notices available.</div>
            )}
            {notices.map((n) => (
              <div key={n.id} className="notice-item">
                <h4>{n.title}</h4>
                <p>{(n as any).content || ''}</p>
                <small>{n.date}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticesSection;
