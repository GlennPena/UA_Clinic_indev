from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("FERNET_KEY")

fernet = Fernet(KEY)

def encrypt(text):
    return fernet.encrypt(text.encode()).decode()

def decrypt(token):
    return fernet.decrypt(token.encode()).decode()