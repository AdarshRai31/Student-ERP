import React from 'react';
import './EmergencyContact.css';

interface EmergencyContactData {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  priority: number;
}

interface EmergencyContactProps {
  contacts: EmergencyContactData[];
}

export const EmergencyContact: React.FC<EmergencyContactProps> = ({ contacts }) => {
  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);

  return (
    <div className="emergency-contact">
      <h3>Emergency Contacts</h3>
      
      <div className="contacts-list">
        {sortedContacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <div className="contact-header">
              <h4>{contact.name}</h4>
              <span className="relationship">{contact.relationship}</span>
            </div>
            
            <div className="contact-details">
              <div className="contact-item">
                <span className="icon">📞</span>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
              
              <div className="contact-item">
                <span className="icon">✉️</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </div>
            
            <div className="contact-actions">
              <button className="call-btn">Call Now</button>
              <button className="message-btn">Send Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
