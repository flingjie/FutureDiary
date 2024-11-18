from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, HttpUrl
from typing import Optional, Union
import uvicorn
from agents.story import generate_story, generate_story_image
from ipfs import PinataIPFSUploader
import os
from dotenv import load_dotenv
import aiohttp
import time
from collections import defaultdict
import threading
import hmac
import hashlib


app = FastAPI(
    title="Generation API",
    description="API for generating text and images"
)

# 添加 CORS 中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源，生产环境建议设置具体的源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法，包括 OPTIONS
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Load environment variables and initialize IPFS uploader
ipfs_uploader = PinataIPFSUploader(
    api_key=os.getenv('PINATA_API_KEY'),
    api_secret=os.getenv('PINATA_API_SECRET')
)

# 添加速率限制器类
class RateLimiter:
    def __init__(self, requests_per_second: int = 1):
        self.requests_per_second = requests_per_second
        self.last_request_time = defaultdict(float)
        self.lock = threading.Lock()

    async def check_rate_limit(self, client_ip: str):
        with self.lock:
            current_time = time.time()
            time_passed = current_time - self.last_request_time[client_ip]
            
            if time_passed < 1/self.requests_per_second:
                raise HTTPException(
                    status_code=429,
                    detail="Too many requests. Please wait before trying again."
                )
            
            self.last_request_time[client_ip] = current_time

rate_limiter = RateLimiter()

# 添加依赖项函数
async def rate_limit(request: Request):
    client_ip = request.client.host
    await rate_limiter.check_rate_limit(client_ip)

# 添加时间戳认证类
class TimestampAuth:
    def __init__(self, max_timestamp_diff: int = 300):  # 5分钟的时间差
        self.secret_key = os.getenv('API_SECRET_KEY')
        if not self.secret_key:
            raise RuntimeError("API_SECRET_KEY not configured")
        self.max_timestamp_diff = max_timestamp_diff

    def create_signature(self, timestamp: str) -> str:
        message = timestamp.encode('utf-8')
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            message,
            hashlib.sha256
        ).hexdigest()
        return signature

    def verify_timestamp(self, timestamp: str):
        try:
            timestamp_int = int(timestamp)
            current_time = int(time.time())
            time_diff = abs(current_time - timestamp_int)
            
            if time_diff > self.max_timestamp_diff:
                raise HTTPException(
                    status_code=401,
                    detail="Timestamp expired"
                )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid timestamp format"
            )

    def verify_signature(self, timestamp: str, signature: str):
        expected_signature = self.create_signature(timestamp)
        if not hmac.compare_digest(signature, expected_signature):
            raise HTTPException(
                status_code=401,
                detail="Invalid signature"
            )

auth = TimestampAuth()

# 添加认证依赖项
async def verify_auth(
    x_timestamp: str = Header(..., alias="X-Timestamp"),
    x_signature: str = Header(..., alias="X-Signature")
):
    auth.verify_timestamp(x_timestamp)
    auth.verify_signature(x_timestamp, x_signature)
    return True

class TextRequest(BaseModel):
    future_date: str
    title: str

class ImageRequest(BaseModel):
    content: str

class TextResponse(BaseModel):
    content: str

class ImageResponse(BaseModel):
    image_url: str

class IPFSResponse(BaseModel):
    ipfs_hash: str
    ipfs_url: str

@app.post("/api/generate-text", response_model=TextResponse, 
          dependencies=[Depends(rate_limit), Depends(verify_auth)])
async def generate_text(request: TextRequest):
    try:
        generated_text = generate_story(request.future_date, request.title)
        return TextResponse(content=generated_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-image", response_model=ImageResponse, 
          dependencies=[Depends(rate_limit), Depends(verify_auth)])
async def generate_image(request: ImageRequest):
    try:
        image_url = generate_story_image(request.content)
        
        return ImageResponse(image_url=image_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-to-ipfs", response_model=IPFSResponse, 
          dependencies=[Depends(rate_limit), Depends(verify_auth)])
async def upload_to_ipfs_endpoint(
    file: Optional[UploadFile] = File(None),
    file_url: Optional[str] = Form(None)
):
    try:
        # Handle file upload
        if file:
            content = await file.read()
            ipfs_hash = ipfs_uploader.upload_file(content, file.filename)
            
        # Handle URL upload
        elif file_url:
            async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(verify_ssl=False)) as session:
                async with session.get(str(file_url)) as response:
                    if response.status != 200:
                        raise HTTPException(status_code=400, detail="Failed to download file from URL")
                    
                    content = await response.read()
                    filename = file_url.split('/')[-1] or 'downloaded_file'
                    ipfs_hash = ipfs_uploader.upload_file(content, filename)
        else:
            raise HTTPException(status_code=400, detail="Either file or file_url must be provided")

        ipfs_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
        return IPFSResponse(ipfs_hash=ipfs_hash, ipfs_url=ipfs_url)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
