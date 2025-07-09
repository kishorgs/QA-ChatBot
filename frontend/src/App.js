import React, { useRef, useState } from "react";
import axios from "axios";

function App() {
  const fileInputRef = useRef(null);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:8000/upload", formData);
    setPdfUploaded(true);
    alert("✅ PDF uploaded and indexed!");
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const formData = new FormData();
    formData.append("question", question);

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    const res = await axios.post("http://localhost:8000/ask", formData);
    const botMessage = { role: "bot", text: res.data.answer };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📘 PDF Q&A Chat Assistant</h1>

      <div style={styles.card}>
        {!pdfUploaded ? (
          <div onClick={() => fileInputRef.current.click()} style={styles.uploadBox}>
            <div style={styles.icon}>⬆️</div>
            <p style={styles.uploadText}>Drag and Drop files to upload</p>
            <p style={styles.orText}>or</p>
            <button style={styles.browseBtn}>📁 Browse</button>
            <p style={styles.supported}>Supported files: .PDF</p>
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
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? "#dbeafe" : "#f1f5f9",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={styles.inputArea}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                style={styles.input}
              />
              <button onClick={handleAsk} style={styles.askBtn}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔧 Styling
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f2fe, #f0fdf4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 900,
    minHeight: 500,
    padding: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBox: {
    width: "100%",
    height: "80%",
    border: "2px dashed #94a3b8",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "border 0.3s",
    padding: 20,
    textAlign: "center",
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 500,
    color: "#475569",
  },
  orText: {
    color: "#94a3b8",
    margin: "10px 0",
  },
  browseBtn: {
    padding: "8px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  },
  supported: {
    fontSize: 12,
    marginTop: 8,
    color: "#64748b",
  },
  chatContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  chatBox: {
    flex: 1,
    maxHeight: "340px",
    overflowY: "auto",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    marginBottom: 12,
  },
  message: {
    maxWidth: "70%",
    marginBottom: 10,
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 15,
    color: "#111827",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
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
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  },
};

export default App;
