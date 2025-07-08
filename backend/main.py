from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from rag_engine import get_qa_chain
from utils import extract_text_from_pdf, chunk_text_to_documents
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os, shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    temp_path = f"temp/{file.filename}"
    os.makedirs("temp", exist_ok=True)
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    text = extract_text_from_pdf(temp_path)
    docs = chunk_text_to_documents(text)
    vectorstore = FAISS.from_documents(docs, embedding_model)
    vectorstore.save_local("faiss_index")
    os.remove(temp_path)
    return {"message": "PDF uploaded and indexed successfully."}

@app.post("/ask/")
async def ask_question(question: str = Form(...)):
    chain = get_qa_chain()
    result = chain({"question": question})
    return {"answer": result["answer"]}


@app.get("/")
async def root():
    return {"message": "FastAPI server is running"}