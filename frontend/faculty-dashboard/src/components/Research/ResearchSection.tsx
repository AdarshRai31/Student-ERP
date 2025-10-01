// src/components/Research/ResearchSection.tsx
import React, { useState } from 'react';
import { Plus, FileText, ExternalLink, Edit, Trash2 } from 'lucide-react';
import './ResearchSection.css';

const ResearchSection: React.FC = () => {
  const [publications, setPublications] = useState([
    {
      id: '1',
      title: 'Advanced Data Structures for Machine Learning',
      authors: ['Jane Smith', 'John Doe'],
      journal: 'Journal of Computer Science',
      year: 2023,
      link: 'https://example.com/publication1',
      abstract: 'This paper explores novel data structures that optimize machine learning algorithms for large-scale datasets.',
    },
    {
      id: '2',
      title: 'Efficient Algorithms for Graph Processing',
      authors: ['Jane Smith', 'Robert Johnson'],
      journal: 'ACM Transactions on Algorithms',
      year: 2022,
      link: 'https://example.com/publication2',
      abstract: 'We present new algorithms for processing large graphs with improved time and space complexity.',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newPublication, setNewPublication] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    link: '',
    abstract: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPublication.title && newPublication.authors && newPublication.journal) {
      const newItem = {
        ...newPublication,
        id: Date.now().toString(),
        authors: newPublication.authors.split(',').map(author => author.trim()),
      };
      setPublications([newItem, ...publications]);
      setNewPublication({
        title: '',
        authors: '',
        journal: '',
        year: new Date().getFullYear(),
        link: '',
        abstract: '',
      });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setPublications(publications.filter(p => p.id !== id));
  };

  return (
    <div className="research-section">
      <div className="page-header">
        <h2>Research Publications</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          <span>Add Publication</span>
        </button>
      </div>

      {showForm && (
        <div className="publication-form-container">
          <h3>Add New Publication</h3>
          <form onSubmit={handleSubmit} className="publication-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newPublication.title}
                onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                placeholder="Enter publication title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="authors">Authors (comma-separated)</label>
                <input
                  type="text"
                  id="authors"
                  value={newPublication.authors}
                  onChange={(e) => setNewPublication({ ...newPublication, authors: e.target.value })}
                  placeholder="e.g., Jane Smith, John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="journal">Journal/Conference</label>
                <input
                  type="text"
                  id="journal"
                  value={newPublication.journal}
                  onChange={(e) => setNewPublication({ ...newPublication, journal: e.target.value })}
                  placeholder="Enter journal or conference name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  value={newPublication.year}
                  onChange={(e) => setNewPublication({ ...newPublication, year: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="link">Publication Link</label>
                <input
                  type="url"
                  id="link"
                  value={newPublication.link}
                  onChange={(e) => setNewPublication({ ...newPublication, link: e.target.value })}
                  placeholder="https://example.com/publication"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="abstract">Abstract</label>
              <textarea
                id="abstract"
                value={newPublication.abstract}
                onChange={(e) => setNewPublication({ ...newPublication, abstract: e.target.value })}
                placeholder="Enter publication abstract"
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Add Publication</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="publications-list">
        <h3>My Publications</h3>
        {publications.length === 0 ? (
          <p className="no-data">No publications added yet.</p>
        ) : (
          <div className="publications-grid">
            {publications.map((publication) => (
              <div key={publication.id} className="publication-card">
                <div className="publication-header">
                  <h4>{publication.title}</h4>
                  <div className="publication-meta">
                    <span className="journal">{publication.journal}</span>
                    <span className="year">{publication.year}</span>
                  </div>
                </div>
                
                <div className="authors">
                  {publication.authors.join(', ')}
                </div>
                
                <div className="abstract">
                  <p>{publication.abstract}</p>
                </div>
                
                <div className="publication-actions">
                  {publication.link && (
                    <a
                      href={publication.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <ExternalLink size={16} />
                      <span>View Publication</span>
                    </a>
                  )}
                  <button className="icon-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="icon-btn delete" 
                    title="Delete"
                    onClick={() => handleDelete(publication.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="research-stats">
        <h3>Research Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <FileText size={24} />
            <span className="value">{publications.length}</span>
            <span className="label">Total Publications</span>
          </div>
          <div className="stat-card">
            <span className="value">{new Date().getFullYear()}</span>
            <span className="label">Current Year</span>
          </div>
          <div className="stat-card">
            <span className="value">
              {publications.filter(p => p.year === new Date().getFullYear()).length}
            </span>
            <span className="label">Publications This Year</span>
          </div>
          <div className="stat-card">
            <span className="value">
              {new Set(publications.flatMap(p => p.authors)).size}
            </span>
            <span className="label">Collaborators</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSection;
