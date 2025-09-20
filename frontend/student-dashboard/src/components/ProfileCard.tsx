import React from "react";
import { Student } from "../types";

interface Props {
  student: Student;
}

const ProfileCard: React.FC<Props> = ({ student }) => {
  return (
    <section className="profile-section">
      <div className="card profile-card">
        <div className="profile-info">
          <img src={student.avatar} alt="Student" className="student-photo" />
          <div className="student-details">
            <h2>{student.name}</h2>
            <p className="roll-number">{student.rollNumber}</p>
            <p className="course">{student.course}</p>
            <p className="year">{student.year}</p>
            <button className="btn btn--outline">
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
