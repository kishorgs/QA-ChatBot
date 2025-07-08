import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAI
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
llm = GoogleGenerativeAI(model="models/gemini-1.5-flash")

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

def load_vectorstore():
    return FAISS.load_local("faiss_index", embedding_model, allow_dangerous_deserialization=True)

def get_qa_chain():
    retriever = load_vectorstore().as_retriever()
    return ConversationalRetrievalChain.from_llm(llm=llm, retriever=retriever, memory=memory)
