import time
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

KIE_API_KEY = os.getenv("KIE_API_KEY")
TASK_ID = os.getenv("TASK_ID")

if not KIE_API_KEY:
    raise ValueError("KIE_API_KEY nu este setat în fișierul .env")

CREATE_TASK_URL = "https://api.kie.ai/api/v1/jobs/createTask"
QUERY_TASK_URL = "https://api.kie.ai/api/v1/jobs/recordInfo"
OUTPUT_FILE = "output.png"

headers = {
    "Authorization": f"Bearer {KIE_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

payload = {
    "model": "z-image",
    "callBackUrl": "https://n8n.aidaai.uk/webhook/3a06f7b0-6fbe-4f3e-af2d-935cad5c486c",
    "input": {
        "prompt": "A photorealistic cafe in Paris, morning light, candid iPhone style",
        "aspect_ratio": "1:1",
        "nsfw_checker": True,
    },
}

print("Creare task kie.ai...")
create_response = requests.post(CREATE_TASK_URL, headers=headers, json=payload)
create_response.raise_for_status()
create_data = create_response.json()

if not isinstance(create_data, dict) or "data" not in create_data or not isinstance(create_data["data"], dict) or "taskId" not in create_data["data"]:
    raise ValueError(f"Nu s-a găsit taskId în răspunsul API: {create_data}")

task_id = create_data["data"]["taskId"]
print(f"Task creat: {task_id}")

max_attempts = 10
attempt = 0
query_data = None

while attempt < max_attempts:
    attempt += 1
    print(f"Verificare stare task (încercarea {attempt}/{max_attempts})...")
    query_response = requests.get(f"{QUERY_TASK_URL}?taskId={task_id}", headers=headers)
    query_response.raise_for_status()
    query_data = query_response.json()

    data = query_data.get("data")
    if not isinstance(data, dict):
        raise ValueError(f"Răspuns invalid în câmpul data: {query_data}")

    state = data.get("state")
    if state == "success":
        print("Task finalizat cu succes.")
        break

    print(f"Task în stare '{state}'. Aștept 10 secunde...")
    if attempt == max_attempts:
        raise RuntimeError(f"Task nu a fost finalizat după {max_attempts} încercări.")
    time.sleep(10)

result_json_raw = data.get("resultJson")
if result_json_raw is None or result_json_raw == "":
    raise RuntimeError("Imaginea nu e gata încă: resultJson este gol sau null.")

if not isinstance(result_json_raw, str):
    raise ValueError(f"resultJson nu este un string: {query_data}")

try:
    result_json = json.loads(result_json_raw)
except json.JSONDecodeError as exc:
    raise ValueError(f"resultJson nu poate fi decodat ca JSON: {exc}") from exc

if not isinstance(result_json, dict):
    raise ValueError(f"resultJson decodat nu este un obiect JSON: {result_json}")

result_urls = result_json.get("resultUrls")
if not isinstance(result_urls, list) or not result_urls:
    raise ValueError(f"Nu s-a găsit resultUrls în răspunsul JSON sau lista este goală: {query_data}")

image_url = result_urls[0]
print(f"Descărcare imagine de la: {image_url}")
image_response = requests.get(image_url)
image_response.raise_for_status()

with open(OUTPUT_FILE, "wb") as f:
    f.write(image_response.content)

print(f"Imagine salvată ca {OUTPUT_FILE}")
