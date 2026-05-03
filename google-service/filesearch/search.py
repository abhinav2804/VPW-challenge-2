import os
import argparse
from google import genai
from dotenv import load_dotenv

# Load environment variables from the root .env file
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(env_path)

api_key = os.environ.get('GEMINI_KEY')
target_file_name = os.environ.get('GEMINI_FILE_NAME')

if not api_key:
    raise ValueError("GEMINI_KEY not found in environment variables. Please check your .env file.")

client = genai.Client(api_key=api_key)

def search_file(query, file_name, model="gemini-2.5-flash"):
    if not file_name:
        raise ValueError("File name is required. Set GEMINI_FILE_NAME in .env or pass it via --file.")
        
    print(f"Retrieving file '{file_name}' from Gemini...")
    try:
        file_ref = client.files.get(name=file_name)
    except Exception as e:
        raise ValueError(f"Could not retrieve file '{file_name}'. Did you ingest it? Error: {e}")

    print(f"Querying with model '{model}'...")
    print(f"Query: {query}\n")
    
    response = client.models.generate_content(
        model=model,
        contents=[file_ref, query]
    )
    
    print("--- Response ---")
    print(response.text)
    print("----------------")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Query a file uploaded to Google Gemini.")
    parser.add_argument("query", nargs="?", default="What does the document say about project deadlines?", help="The query/question to ask")
    parser.add_argument("--file", default=target_file_name, help="Name (ID) of the file to search")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Model to use (default: gemini-2.5-flash)")
    
    args = parser.parse_args()
    search_file(args.query, args.file, args.model)