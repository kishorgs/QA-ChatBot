from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain.docstore.document import Document
from langchain.memory import ConversationBufferMemory
import fitz  
import os
import shutil
import uuid

app = FastAPI()

# Enable CORS for frontend React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
INDEX_DIR = "faiss_index"
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
llm = Ollama(model="gemma3")
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
retriever = None
qa_chain = None

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file_id + ".pdf")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract and chunk PDF text
    with fitz.open(file_path) as pdf:
        text = "".join(page.get_text() for page in pdf)
    chunks = [Document(page_content=chunk.strip()) for chunk in text.split("\n\n") if chunk.strip()]

    # Build and save FAISS index
    vectorstore = FAISS.from_documents(chunks, embedding_model)
    vectorstore.save_local(INDEX_DIR)

    global retriever, qa_chain
    retriever = vectorstore.as_retriever()
    qa_chain = ConversationalRetrievalChain.from_llm(llm=llm, retriever=retriever, memory=memory)

    return {"message": "PDF uploaded and indexed successfully"}

@app.post("/ask")
async def ask_question(question: str = Form(...)):
    global qa_chain
    if not qa_chain:
        return {"error": "No document uploaded yet."}

    result = qa_chain({"question": question})
    return {"answer": result["answer"]}
