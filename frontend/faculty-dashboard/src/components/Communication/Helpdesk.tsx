// src/components/Communication/Helpdesk.tsx
import React, { useState } from "react";
import { Mail, Clock, CheckCircle, Search } from "lucide-react";
import "./Helpdesk.css";

type QueryStatus = "pending" | "resolved";

type Response = {
  id: string;
  message: string;
  date: string;
  sender: "faculty" | "student";
};

type Query = {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  message: string;
  date: string;
  status: QueryStatus;
  responses: Response[];
};

const Helpdesk: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | QueryStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [queries, setQueries] = useState<Query[]>([
    {
      id: "1",
      studentId: "S001",
      studentName: "John Doe",
      subject: "Assignment Deadline Extension",
      message:
        "I was unable to submit the assignment on time due to illness. Can I get an extension?",
      date: "2023-10-15",
      status: "pending",
      responses: [],
    },
    {
      id: "2",
      studentId: "S002",
      studentName: "Jane Smith",
      subject: "Lecture Notes",
      message:
        "Could you please share the lecture notes from last class? I missed the lecture.",
      date: "2023-10-14",
      status: "resolved",
      responses: [
        {
          id: "1",
          message: "Sure, I've uploaded the notes to the portal.",
          date: "2023-10-14",
          sender: "faculty",
        },
      ],
    },
    {
      id: "3",
      studentId: "S003",
      studentName: "Robert Johnson",
      subject: "Exam Schedule Conflict",
      message: "I have two exams scheduled at the same time. What should I do?",
      date: "2023-10-13",
      status: "pending",
      responses: [],
    },
  ]);

  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const filteredQueries = queries.filter((query) => {
    const matchesStatus = activeTab === "all" || query.status === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      query.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedQueryData = selectedQuery
    ? queries.find((q) => q.id === selectedQuery)
    : null;

  const handleResponseSubmit = () => {
    if (!selectedQuery || !responseText.trim()) return;

    const updatedQueries: Query[] = queries.map((query) => {
      if (query.id === selectedQuery) {
        return {
          ...query,
          responses: [
            ...query.responses,
            {
              id: Date.now().toString(),
              message: responseText,
              date: new Date().toISOString().split("T")[0],
              sender: "faculty", // ✅ correctly typed
            },
          ],
        };
      }
      return query;
    });

    setQueries(updatedQueries);
    setResponseText("");
  };

  const handleStatusChange = (id: string, status: QueryStatus) => {
    setQueries(
      queries.map((query) => (query.id === id ? { ...query, status } : query))
    );
  };

  return (
    <div className="helpdesk">
      <div className="page-header">
        <h2>Student Helpdesk</h2>
      </div>

      <div className="helpdesk-container">
        {/* Sidebar list */}
        <div className="queries-list">
          <div className="list-header">
            <div className="tabs">
              <button
                className={activeTab === "all" ? "active" : ""}
                onClick={() => setActiveTab("all")}
              >
                All Queries
              </button>
              <button
                className={activeTab === "pending" ? "active" : ""}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                className={activeTab === "resolved" ? "active" : ""}
                onClick={() => setActiveTab("resolved")}
              >
                Resolved
              </button>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="queries">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className={`query-item ${
                  selectedQuery === query.id ? "selected" : ""
                }`}
                onClick={() => setSelectedQuery(query.id)}
              >
                <div className="query-header">
                  <h4>{query.subject}</h4>
                  <span className={`status ${query.status}`}>
                    {query.status === "resolved" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {query.status}
                  </span>
                </div>
                <div className="query-info">
                  <p className="student">
                    {query.studentName} ({query.studentId})
                  </p>
                  <p className="date">{query.date}</p>
                </div>
                <p className="preview">{query.message.substring(0, 60)}...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Query detail panel */}
        <div className="query-detail">
          {selectedQueryData ? (
            <>
              <div className="detail-header">
                <div>
                  <h3>{selectedQueryData.subject}</h3>
                  <p className="student-info">
                    {selectedQueryData.studentName} ({selectedQueryData.studentId}) •{" "}
                    {selectedQueryData.date}
                  </p>
                </div>
                <div className="status-controls">
                  <button
                    className={`status-btn ${
                      selectedQueryData.status === "pending" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleStatusChange(selectedQueryData.id, "pending")
                    }
                  >
                    <Clock size={16} />
                    <span>Pending</span>
                  </button>
                  <button
                    className={`status-btn ${
                      selectedQueryData.status === "resolved" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleStatusChange(selectedQueryData.id, "resolved")
                    }
                  >
                    <CheckCircle size={16} />
                    <span>Resolved</span>
                  </button>
                </div>
              </div>

              <div className="original-message">
                <h4>Original Query</h4>
                <p>{selectedQueryData.message}</p>
              </div>

              <div className="responses">
                <h4>Responses</h4>
                {selectedQueryData.responses.length === 0 ? (
                  <p className="no-responses">No responses yet.</p>
                ) : (
                  <div className="responses-list">
                    {selectedQueryData.responses.map((response) => (
                      <div key={response.id} className="response">
                        <div className="response-header">
                          <span className="sender">
                            {response.sender === "faculty"
                              ? "You"
                              : selectedQueryData.studentName}
                          </span>
                          <span className="date">{response.date}</span>
                        </div>
                        <p>{response.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="response-input">
                <h4>Add Response</h4>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                />
                <button
                  className="btn-primary"
                  onClick={handleResponseSubmit}
                  disabled={!responseText.trim()}
                >
                  <Mail size={16} />
                  <span>Send Response</span>
                </button>
              </div>
            </>
          ) : (
            <div className="no-query-selected">
              <h3>Select a query to view details</h3>
              <p>Choose a student query from the list to view and respond to it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Helpdesk;
