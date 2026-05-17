import os
from dotenv import load_dotenv
import requests

load_dotenv()

KIE_API_KEY = os.getenv("KIE_API_KEY")
TASK_ID = os.getenv("TASK_ID")

if not KIE_API_KEY:
    raise ValueError("KIE_API_KEY nu este setat în fișierul .env")
if not TASK_ID:
    raise ValueError("TASK_ID nu este setat în fișierul .env")

API_URL = f"https://api.kie.ai/api/v1/jobs/recordInfo?taskId={TASK_ID}"
OUTPUT_FILE = "output.png"

headers = {
    "Authorization": f"Bearer {KIE_API_KEY}",
    "Accept": "application/json",
}

response = requests.get(API_URL, headers=headers)
response.raise_for_status()

json_data = response.json()
image_url = json_data.get("data")
if not image_url:
    raise ValueError("Nu s-a găsit URL-ul imaginii în răspunsul JSON")

image_response = requests.get(image_url)
image_response.raise_for_status()

with open(OUTPUT_FILE, "wb") as f:
    f.write(image_response.content)

print(f"Imagine salvată ca {OUTPUT_FILE}")
