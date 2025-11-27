# Document Converter Application

A full-stack application for converting PDF files to Microsoft Word (.docx) format with preserved formatting and layouts. The application supports two conversion modes: uploading local PDF files and converting from web locations (URLs).

## Features

1. **Upload Mode**: Upload a local PDF file and convert it to Word format
2. **Web Location Mode**: Enter a URL to convert a PDF document or webpage to Word format
3. **Format Preservation**: Maintains document formatting and layouts during conversion
4. **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS

## Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI**: Modern, fast web framework for building APIs
- **pdf2docx**: Library for converting PDF to DOCX with formatting preservation
- **WeasyPrint**: For converting web pages to PDF
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls

## Project Structure

```
document-converter-app/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── uploads/            # Temporary PDF storage (auto-created)
│   └── outputs/            # Converted DOCX files (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadMode.jsx
│   │   │   └── WebLocationMode.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher and npm
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python main.py
```

The backend API will be running at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Usage

1. **Upload Mode**:
   - Click on "Upload PDF" mode
   - Click the upload area or drag and drop a PDF file
   - Click "Convert to Word" button
   - The converted file will automatically download

2. **Web Location Mode**:
   - Click on "Convert from Web Location" mode
   - Enter a URL (either a direct PDF link or a webpage)
   - Click "Convert to Word" button
   - The converted file will automatically download

## API Endpoints

### POST `/api/convert/upload`
Converts an uploaded PDF file to DOCX format.

**Request**: Multipart form data with `file` field containing PDF file
**Response**: DOCX file download

### POST `/api/convert/web`
Converts a PDF from URL or webpage to DOCX format.

**Request Body**:
```json
{
  "url": "https://example.com/document.pdf"
}
```
**Response**: DOCX file download

## Notes

- The application automatically cleans up temporary files after conversion
- Large PDF files may take longer to convert
- **Formatting Preservation**: The application uses **PyMuPDF (pymupdf)** for advanced PDF to Word conversion, which preserves:
  - **Font styles**: Bold, italic, underline
  - **Font sizes**: Original font sizes are maintained
  - **Font families**: Font names are preserved
  - **Text colors**: RGB colors are maintained
  - **Text alignment**: Left, center, and right alignment
  - **Tables**: Tables are extracted and preserved with formatting
  - **Paragraph spacing**: Proper spacing between paragraphs
  - **Layout**: Page breaks and document structure
- **Web page conversion**: Uses `pdfplumber` + `python-docx` for PDF to Word conversion, which preserves text and tables well
- **WeasyPrint (Optional)**: For advanced web page to PDF conversion, WeasyPrint can be enabled by installing system dependencies:
  - **macOS**: `brew install pango gdk-pixbuf libffi`
  - **Linux**: `sudo apt-get install python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0`
  - **Windows**: Install GTK+ runtime libraries
- If WeasyPrint is not available, web page conversion will use a simpler HTML-to-text method
- For best results, use PDF files with standard formatting. Complex layouts with images may have limited preservation

## Troubleshooting

1. **Backend won't start**: 
   - Ensure Python 3.8+ is installed and all dependencies are installed
   - If you see WeasyPrint warnings, they can be ignored - the app will use fallback methods
2. **Frontend won't start**: Ensure Node.js 16+ is installed and run `npm install`
3. **CORS errors**: Make sure backend is running on port 8000 and frontend on port 3000
4. **Conversion fails**: 
   - Check that the PDF file is not corrupted and is a valid PDF format
   - For web URLs, ensure the URL is accessible and points to a PDF file for best results
5. **WeasyPrint errors**: These are non-critical. The app will work without WeasyPrint, but web page conversion will be simpler. To enable full WeasyPrint support, install system dependencies (see Notes section)

## License

This project is open source and available for use.

