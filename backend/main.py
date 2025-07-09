import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain_community.llms import Ollama
from langchain.docstore.document import Document
from langchain.memory import ConversationBufferMemory

# Load .env
load_dotenv()

# --------- STEP 1: Extract text from PDF ----------
def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

pdf_path = "data/Kishor_G.pdf"
pdf_text = extract_text_from_pdf(pdf_path)

# --------- STEP 2: Split into Documents ----------
chunks = pdf_text.split("\n\n")
docs = [Document(page_content=chunk.strip()) for chunk in chunks if chunk.strip()]

# --------- STEP 3: Embeddings & Vectorstore ----------
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

if not os.path.exists("faiss_index"):
    vectorstore = FAISS.from_documents(docs, embedding_model)
    vectorstore.save_local("faiss_index")
else:
    vectorstore = FAISS.load_local("faiss_index", embedding_model, allow_dangerous_deserialization=True)

# --------- STEP 4: LLM using Ollama ----------
llm = Ollama(model="gemma3")
 # You can use mistral or other models pulled via Ollama

# --------- STEP 5: Memory and QA Chain ----------
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    memory=memory
)

# --------- STEP 6: Ask Question ----------
query = "Compare the technologies used in the Real-Time Video Summarizer and Accident Detection projects."
response = qa_chain({"question": query})

print("Response:", response["answer"])
