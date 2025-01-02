import os
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
)

embedding = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
chat = ChatGoogleGenerativeAI(model="gemini-pro")