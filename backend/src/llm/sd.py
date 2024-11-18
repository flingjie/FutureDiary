import requests
import json
from PIL import Image
import base64
import io
import hashlib

def generate_image(prompt):
    url = 'http://127.0.0.1:7860/sdapi/v1/txt2img'

    payload = {
        "prompt": prompt,
        "steps": 5
    }

    response = requests.post(url, json=payload)
    r = response.json()
    
    image = Image.open(io.BytesIO(base64.b64decode(r['images'][0])))
    
    save_path = f"static/generated/{hashlib.sha256(prompt.encode()).hexdigest()}.png"
    image.save(save_path)
    
    return f"http://localhost:8000/static/generated/{save_path.split('/')[-1]}"