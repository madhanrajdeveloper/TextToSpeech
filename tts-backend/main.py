from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import edge_tts
import uuid
import os

app = FastAPI()

# Remove the trailing slash from the origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tts-webapplication.netlify.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def remove_file(path: str):
    if os.path.exists(path):
        os.remove(path)

@app.post("/synthesize")
async def synthesize(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    text = data.get("text", "")
    
    if len(text) > 10000:
        return {"error": "Text too long"}

    file_id = str(uuid.uuid4())
    output_file = f"temp_{file_id}.mp3"

    communicate = edge_tts.Communicate(text, "en-US-WilliamNeural")
    await communicate.save(output_file)

    background_tasks.add_task(remove_file, output_file)
    
    return FileResponse(output_file, media_type="audio/mpeg", filename="voiceover.mp3")