from fastapi import FastAPI, UploadFile, File, Form
import numpy as np
import cv2
from mtcnn import MTCNN
from keras_facenet import FaceNet
from sklearn.metrics.pairwise import cosine_similarity
import base64

app = FastAPI()

# Load MTCNN detector
detector = MTCNN()

# Embedder
embedder = FaceNet()

def extract_embedding(face):
    return embedder.embeddings([face])[0]

def extract_face_from_bytes(image_bytes):
    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = detector.detect_faces(img_rgb)
    if faces:
        x, y, w, h = faces[0]['box']
        face = img_rgb[y:y+h, x:x+w]
        face = cv2.resize(face, (160, 160))
        return face
    else:
        return None

@app.post("/compareBase64")
async def compare_faces_base64(
    initial_photo: UploadFile = File(...),
    periodic_photo: str = Form(...)
):
    try:
        initial_bytes = await initial_photo.read()
        periodic_bytes = base64.b64decode(periodic_photo.split(',')[1]) if ',' in periodic_photo else base64.b64decode(periodic_photo)

        face1 = extract_face_from_bytes(initial_bytes)
        face2 = extract_face_from_bytes(periodic_bytes)

        if face1 is None or face2 is None:
            return {"error": "Face not detected in one or both images."}

        emb1 = extract_embedding(face1)
        emb2 = extract_embedding(face2)

        score = cosine_similarity([emb1], [emb2])[0][0]

        return {
    "similarity": float(score),
    "verified": bool(score > 0.5)  # Explicit conversion to Python bool
    }


    except Exception as e:
        return {"error": f"Failed to compare faces: {str(e)}"}

