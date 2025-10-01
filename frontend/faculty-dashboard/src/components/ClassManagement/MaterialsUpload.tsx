// src/components/ClassManagement/MaterialsUpload.tsx
import React, { useState } from 'react';
import { Upload, Download, Trash2, FileText, Presentation, File, Plus } from 'lucide-react';
import './MaterialsUpload.css';

interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  section: string;
  type: 'notes' | 'ppt' | 'assignment' | 'other';
  uploadDate: string;
  file: string;
}

const MaterialsUpload: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([
    { 
      id: '1', 
      title: 'Data Structures Lecture 1', 
      subject: 'Data Structures', 
      section: 'CS-A', 
      type: 'notes', 
      uploadDate: '2023-10-15',
      file: 'lecture1.pdf'
    },
    { 
      id: '2', 
      title: 'Algorithms PPT', 
      subject: 'Algorithms', 
      section: 'CS-B', 
      type: 'ppt', 
      uploadDate: '2023-10-10',
      file: 'algorithms.pptx'
    },
  ]);

  const [newMaterial, setNewMaterial] = useState<Omit<StudyMaterial, 'id' | 'uploadDate'>>({
    title: '',
    subject: '',
    section: '',
    type: 'notes',
    file: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof typeof newMaterial, value: string) => {
    setNewMaterial({ ...newMaterial, [field]: value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setNewMaterial({ ...newMaterial, file: file.name });
    }
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...newMaterial,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setMaterials([...materials, newItem as StudyMaterial]);
    setNewMaterial({
      title: '',
      subject: '',
      section: '',
      type: 'notes',
      file: ''
    });
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'notes': return <FileText size={20} />;
      case 'ppt': return <Presentation size={20} />;
      case 'assignment': return <FileText size={20} />;
      default: return <File size={20} />;
    }
  };

  return (
    <div className="materials-upload">
      <div className="page-header">
        <h2>Study Materials Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          <span>Add Material</span>
        </button>
      </div>

      {showForm && (
        <div className="material-form">
          <h3>Add New Study Material</h3>
          <form onSubmit={handleAddMaterial}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newMaterial.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={newMaterial.type}
                  onChange={(e) => handleInputChange('type', e.target.value as any)}
                  required
                >
                  <option value="notes">Lecture Notes</option>
                  <option value="ppt">Presentation</option>
                  <option value="assignment">Assignment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={newMaterial.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Database Systems">Database Systems</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  value={newMaterial.section}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="CS-A">CS-A</option>
                  <option value="CS-B">CS-B</option>
                  <option value="CS-C">CS-C</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="file">Material File</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.pptx,.txt"
                  required
                />
                <label htmlFor="file" className="file-label">
                  <Upload size={16} />
                  {selectedFile ? selectedFile.name : 'Choose file'}
                </label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">Upload Material</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="materials-content">
        <div className="materials-list">
          <h3>Uploaded Materials</h3>
          {materials.length === 0 ? (
            <p className="no-data">No materials uploaded yet.</p>
          ) : (
            <div className="materials-grid">
              {materials.map((material) => (
                <div key={material.id} className="material-card">
                  <div className="material-icon">
                    {getIconForType(material.type)}
                  </div>
                  <div className="material-info">
                    <h4>{material.title}</h4>
                    <p className="material-meta">
                      <span className="subject">{material.subject}</span> • 
                      <span className="section">{material.section}</span> • 
                      <span className="type">{material.type}</span>
                    </p>
                    <p className="upload-date">Uploaded: {material.uploadDate}</p>
                  </div>
                  <div className="material-actions">
                    <button className="icon-btn" title="Download">
                      <Download size={16} />
                    </button>
                    <button 
                      className="icon-btn delete" 
                      title="Delete"
                      onClick={() => handleDelete(material.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsUpload;
