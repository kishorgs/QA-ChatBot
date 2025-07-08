import fitz
from langchain.docstore.document import Document

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def chunk_text_to_documents(text):
    chunks = text.split("\n\n")
    return [Document(page_content=chunk.strip()) for chunk in chunks if chunk.strip()]
