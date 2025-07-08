import React, { useState } from 'react';
import axios from 'axios';

const ChatWindow = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post("http://localhost:8000/upload/", formData);
    alert("PDF Uploaded!");
  };

  const handleAsk = async () => {
    const formData = new FormData();
    formData.append("question", question);
    const res = await axios.post("http://localhost:8000/ask/", formData);
    setAnswer(res.data.answer);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">PDF Q&A Chatbot</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">Upload</button>
      <div className="mt-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question"
          className="border px-2 py-1 w-full"
        />
        <button onClick={handleAsk} className="mt-2 px-3 py-1 bg-green-600 text-white rounded">Ask</button>
      </div>
      {answer && (
        <div className="mt-4 p-3 bg-gray-100 rounded shadow">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
