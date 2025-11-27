from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import requests
import uuid
from pdf2docx import Converter

# Try to import WeasyPrint, but make it optional
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError) as e:
    WEASYPRINT_AVAILABLE = False
    print(f"WeasyPrint not available: {e}")
    print("Web page to PDF conversion will use a simpler method.")

app = FastAPI(title="Document Converter API")

# CORS middleware to allow React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads and outputs directories if they don't exist
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


class WebLocationRequest(BaseModel):
    url: str


def convert_pdf_to_docx(pdf_path: str, docx_path: str) -> bool:
    """Convert PDF to DOCX while preserving formatting using pdf2docx."""
    try:
        # Use pdf2docx for better formatting preservation
        # pdf2docx handles fonts, alignments, spacing, tables, and images automatically
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        return True
        
    except Exception as e:
        print(f"Error converting PDF to DOCX with pdf2docx: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def download_pdf_from_url(url: str, output_path: str) -> bool:
    """Download PDF from URL."""
    try:
        response = requests.get(url, timeout=30, stream=True)
        response.raise_for_status()
        
        # Check if content is PDF
        content_type = response.headers.get('content-type', '').lower()
        if 'pdf' in content_type or url.lower().endswith('.pdf'):
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
        return False
    except Exception as e:
        print(f"Error downloading PDF from URL: {str(e)}")
        return False


def convert_webpage_to_pdf(url: str, pdf_path: str) -> bool:
    """Convert webpage to PDF using WeasyPrint or fallback method."""
    try:
        response = requests.get(url, timeout=30, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response.raise_for_status()
        
        if WEASYPRINT_AVAILABLE:
            # Use WeasyPrint if available
            HTML(string=response.text, base_url=url).write_pdf(pdf_path)
            return True
        else:
            # Fallback: Convert webpage content directly to DOCX
            # This is a simpler approach that doesn't require PDF intermediate
            return False  # Will be handled differently in the calling function
    except Exception as e:
        print(f"Error converting webpage to PDF: {str(e)}")
        return False


def convert_webpage_to_docx(url: str, docx_path: str) -> bool:
    """Convert webpage directly to DOCX (fallback when WeasyPrint unavailable)."""
    try:
        # For webpage conversion, we need to convert to PDF first, then to DOCX
        # This requires WeasyPrint or similar tool
        # If WeasyPrint is not available, return False
        return False
    except Exception as e:
        print(f"Error converting webpage to DOCX: {str(e)}")
        return False


@app.get("/")
def read_root():
    return {"message": "Document Converter API is running"}


@app.post("/api/convert/upload")
async def convert_uploaded_file(file: UploadFile = File(...)):
    """Convert uploaded PDF file to DOCX."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Generate unique filenames
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    docx_path = os.path.join(OUTPUT_DIR, f"{file_id}.docx")
    
    try:
        # Save uploaded file
        with open(pdf_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Convert PDF to DOCX
        if not convert_pdf_to_docx(pdf_path, docx_path):
            raise HTTPException(status_code=500, detail="Failed to convert PDF to DOCX")
        
        # Clean up PDF file
        os.remove(pdf_path)
        
        # Return DOCX file
        return FileResponse(
            docx_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{file.filename.rsplit('.', 1)[0]}.docx"
        )
    except HTTPException:
        raise
    except Exception as e:
        # Clean up on error
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        if os.path.exists(docx_path):
            os.remove(docx_path)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.post("/api/convert/web")
async def convert_from_web_location(request: WebLocationRequest):
    """Convert PDF from URL or webpage to DOCX."""
    url = request.url.strip()
    
    if not url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    # Generate unique filenames
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    docx_path = os.path.join(OUTPUT_DIR, f"{file_id}.docx")
    
    try:
        # Try to download as PDF first
        is_pdf = download_pdf_from_url(url, pdf_path)
        
        if is_pdf:
            # Convert PDF to DOCX
            if not convert_pdf_to_docx(pdf_path, docx_path):
                raise HTTPException(status_code=500, detail="Failed to convert PDF to DOCX")
            # Clean up PDF file
            os.remove(pdf_path)
        else:
            # Try to convert webpage to PDF first (if WeasyPrint available)
            if WEASYPRINT_AVAILABLE and convert_webpage_to_pdf(url, pdf_path):
                # Convert PDF to DOCX
                if not convert_pdf_to_docx(pdf_path, docx_path):
                    raise HTTPException(status_code=500, detail="Failed to convert PDF to DOCX")
                # Clean up PDF file
                os.remove(pdf_path)
            else:
                # Fallback: Convert webpage directly to DOCX
                if not convert_webpage_to_docx(url, docx_path):
                    raise HTTPException(status_code=500, detail="Failed to convert webpage. Please ensure the URL points to a PDF file or install WeasyPrint system dependencies.")
        
        # Generate filename from URL
        filename = url.split('/')[-1].split('?')[0]
        if not filename or '.' not in filename:
            filename = "converted_document"
        if not filename.endswith('.docx'):
            filename = filename.rsplit('.', 1)[0] + '.docx' if '.' in filename else filename + '.docx'
        
        # Return DOCX file
        return FileResponse(
            docx_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=filename
        )
    except HTTPException:
        raise
    except Exception as e:
        # Clean up on error
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        if os.path.exists(docx_path):
            os.remove(docx_path)
        raise HTTPException(status_code=500, detail=f"Error processing URL: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

