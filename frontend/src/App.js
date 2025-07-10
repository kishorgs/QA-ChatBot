// Full enhanced version of your PDF Q&A chatbot

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaRocket, FaCloudUploadAlt, FaUser, FaRobot } from "react-icons/fa";

function App() {
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    await axios.post("http://localhost:8000/upload", formData);
    setPdfUploaded(true);
    setLoading(false);
    alert("✅ PDF uploaded and indexed!");
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const formData = new FormData();
    formData.append("question", question);

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    const res = await axios.post("http://localhost:8000/ask", formData);
    const botMessage = { role: "bot", text: res.data.answer };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 ThinkPDF</h1>

      <div style={styles.card}>
        {!pdfUploaded ? (
          <div
            style={styles.uploadBox}
            onClick={() => fileInputRef.current.click()}
          >
            <FaCloudUploadAlt size={80} color="#3b82f6" style={{ marginBottom: 10 }} />
            <p style={styles.uploadTitle}>Upload and Ask</p>
            <p style={styles.uploadSubText}>Drag & drop your PDF or click here</p>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div style={styles.chatContainer}>
            <div style={styles.chatBox}>
              {messages.length === 0 ? (
                <div style={styles.emptyState}>
                  <FaRobot size={60} color="#9333ea" style={{ marginBottom: 10 }} />
                  <p style={styles.emptyTitle}>Ask something from AI</p>
                  <ul style={styles.sampleQuestions}>
                    <li style={styles.sampleItem}>🎓 In which college Kishor studied?</li>
                    <li style={styles.sampleItem}>💼 What is the profession of Kishor?</li>
                    <li style={styles.sampleItem}>🛠️ What are the technical skills of Kishor?</li>
                  </ul>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      background: msg.role === "user"
                        ? "linear-gradient(to right, #38bdf8, #60a5fa)"
                        : "linear-gradient(to right, #c084fc, #a78bfa)",
                      borderBottomRightRadius: msg.role === "user" ? 0 : styles.message.borderRadius,
                      borderBottomLeftRadius: msg.role === "bot" ? 0 : styles.message.borderRadius,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {msg.role === "user" ? <FaUser /> : <FaRobot />} <span>{msg.text}</span>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div style={{ ...styles.message, backgroundColor: "#d1d7e0", color: "#1e293b" }}>
                  <em>Bot is thinking...</em>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={styles.inputArea}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something from the PDF..."
                style={styles.input}
              />
              <button onClick={handleAsk} style={styles.askBtn}>
                Send <FaRocket style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    background: "linear-gradient(135deg, #1e3a8a, #64748b, #38bdf8)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(12px)",
    borderRadius: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "90%",
    maxWidth: 720,
    height: 520,
    padding: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBox: {
    width: "80%",
    height: "80%",
    border: "3px dashed #94a3b8",
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#1e3a8a",
    marginBottom: 5,
  },
  uploadSubText: {
    fontSize: 14,
    color: "#475569",
  },
  chatContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  message: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 18,
    fontSize: 15,
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  inputArea: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: 16,
  },
  askBtn: {
    padding: "12px 20px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flex: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 10,
  },
  sampleQuestions: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sampleItem: {
    fontSize: 14,
    backgroundColor: "#e0e7ff",
    padding: "8px 14px",
    borderRadius: 12,
    color: "#1e293b",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
};

export default App;