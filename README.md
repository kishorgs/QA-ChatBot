# 🤖 PDF QnA ChatBot using LangChain + FAISS + HuggingFace + Google PaLM API

This project is a **PDF Question Answering Chatbot** that intelligently answers questions from any uploaded PDF using the following technologies:

- 🧠 **LangChain** – for orchestrating LLM chains
- 🤗 **HuggingFace Embeddings** – for creating document vectors
- 🗃️ **FAISS** – for storing and retrieving vectorized chunks
- 🔮 **Google Generative AI (PaLM/Gemini)** – for answering based on context

---

## 🖼️ How It Works

1. Load a PDF file
2. Split PDF text into chunks
3. Generate vector embeddings from chunks
4. Store in FAISS vectorstore
5. Ask a question → match best chunks → generate an answer using PaLM API

---

## 📦 Tech Stack

| Tool               | Purpose                            |
|--------------------|-------------------------------------|
| LangChain          | Conversational retrieval chain     |
| FAISS              | Vector database                    |
| HuggingFace        | Sentence Embeddings                |
| Google Generative AI | Answer generation (PaLM/Gemini)   |
| PyMuPDF            | PDF parsing                        |
| Python             | Backend logic                      |

---

## ✅ Setup Instructions

### 1. 📁 Clone the Repo

```bash
git clone https://github.com/your-username/pdf-qna-chatbot.git
cd pdf-qna-chatbot
