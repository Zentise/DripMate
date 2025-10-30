from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import shutil
import os

from ..services.vision_service import analyze_image


router = APIRouter()


ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


@router.post("/vision/analyze")
async def analyze_vision(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    suffix = ALLOWED_TYPES[file.content_type]
    tmpdir = tempfile.mkdtemp(prefix="dripmate_vision_")
    try:
        tmp_path = os.path.join(tmpdir, f"upload{suffix}")
        with open(tmp_path, "wb") as out:
            shutil.copyfileobj(file.file, out)

        attrs = analyze_image(tmp_path)
        return JSONResponse(content=attrs)
    finally:
        try:
            shutil.rmtree(tmpdir)
        except Exception:
            pass
