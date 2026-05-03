import os
import argparse
from google import genai
from dotenv import load_dotenv

# Load environment variables from the root .env file
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(env_path)

api_key = os.environ.get('GEMINI_KEY')

if not api_key:
    raise ValueError("GEMINI_KEY not found in environment variables. Please check your .env file.")

client = genai.Client(api_key=api_key)

def ingest_file(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
        
    print(f"Uploading '{file_path}' to Google Gemini File API...")
    uploaded_file = client.files.upload(
        file=file_path
    )
    print("File uploaded successfully!")
    print(f"File Name (ID): {uploaded_file.name}")
    print("\nIMPORTANT: Please add this file name to your .env file:")
    print(f"GEMINI_FILE_NAME=\"{uploaded_file.name}\"")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload a document to Google Gemini.")
    parser.add_argument("file_path", help="Path to the document to upload (e.g., your_document.pdf)")
    
    args = parser.parse_args()
    ingest_file(args.file_path)