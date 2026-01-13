# Code Analyzer AI Demo

An AI-powered code analysis application that provides comprehensive code review, documentation generation, and diagram creation using local LLM (Ollama) and LangChain4J.

## Features

1. **Code Source Input**
   - Upload source code as ZIP file
   - Clone and analyze GitHub repositories

2. **AI-Powered Analysis**
   - Generate flowcharts, sequence diagrams, and architecture diagrams
   - Generate detailed technical documentation
   - Perform code review with improvement suggestions

3. **Modern Web Interface**
   - React.js frontend with TailwindCSS
   - Intuitive, responsive design
   - Real-time analysis results
   - Interactive diagram viewer
   - Markdown documentation renderer

4. **Local LLM Setup**
   - Uses Ollama for local, offline LLM processing
   - No remote API calls required
   - Docker containerization for easy setup

## Prerequisites

### Backend
- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- Ollama (via Docker)

### Frontend
- Node.js 18+ and npm/yarn

## Setup Instructions

### Quick Start (Automated)

```bash
# 1. Start Ollama and pull model
./setup.sh

# 2. Build and run backend
mvn clean install
mvn spring-boot:run

# 3. In a new terminal, setup and run frontend
cd frontend
npm install
npm run dev
```

### Manual Setup

#### 1. Start Ollama Docker Container

```bash
docker-compose up -d
```

This will start Ollama on port 11434.

#### 2. Pull and Setup LLM Model

```bash
# Pull a model (e.g., llama2, mistral, codellama)
docker exec -it local-ollama ollama pull codellama
```

Update `src/main/resources/application.yml` to use your preferred model:
```yaml
ollama:
  model: codellama  # or llama2, mistral, etc.
```

#### 3. Build and Run Backend

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### 4. Setup and Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage

### Web Interface (Recommended)

1. Open `http://localhost:3000` in your browser
2. Choose to upload a ZIP file or enter a GitHub URL
3. Wait for analysis to complete
4. View results in the interactive interface:
   - **Overview**: Quick summary and statistics
   - **Diagrams**: Flowcharts, sequence, and architecture diagrams
   - **Documentation**: Full technical documentation
   - **Code Review**: Issues, suggestions, and strengths

### API Endpoints

#### 1. Analyze ZIP Upload

```bash
curl -X POST http://localhost:8080/api/v1/analyze/upload \
  -F "file=@your-code.zip"
```

#### 2. Analyze GitHub Repository

```bash
curl -X POST "http://localhost:8080/api/v1/analyze/github?url=https://github.com/username/repo.git"
```

#### 3. Health Check

```bash
curl http://localhost:8080/api/v1/analyze/health
```

## Response Format

The API returns a JSON response with:

```json
{
  "analysisId": "uuid",
  "status": "SUCCESS",
  "message": "Analysis completed successfully",
  "generatedImages": [
    "path/to/flowchart.mmd",
    "path/to/sequence.mmd",
    "path/to/architecture.mmd"
  ],
  "documentation": "# Technical Documentation\n\n...",
  "codeReview": {
    "overallScore": "8/10",
    "summary": "...",
    "issues": [...],
    "suggestions": [...],
    "strengths": [...]
  }
}
```

## Configuration

Edit `src/main/resources/application.yml` to customize:

- Ollama connection settings
- File upload limits
- Directory paths
- Model selection

## Converting Mermaid Diagrams to Images

The application generates Mermaid diagram files (`.mmd`). To convert them to images:

### Option 1: Using Mermaid CLI

```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i generated-images/flowchart_xxx.mmd -o generated-images/flowchart_xxx.png
```

### Option 2: Using Online Service

Use [mermaid.ink](https://mermaid.ink/) API:
```
https://mermaid.ink/img/<base64-encoded-mermaid-code>
```

### Option 3: Integrate in Application

Add a service to convert Mermaid to images using:
- Puppeteer/Playwright
- Mermaid CLI via ProcessBuilder
- Third-party API

## Project Structure

```
ai-demo/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API integration
│   │   └── App.jsx         # Main app
│   ├── package.json
│   └── vite.config.js
├── src/                      # Spring Boot backend
│   ├── main/
│   │   ├── java/com/aidemo/
│   │   │   ├── config/      # Configuration
│   │   │   ├── controller/  # REST controllers
│   │   │   ├── dto/         # Data transfer objects
│   │   │   └── service/     # Business logic
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
├── docker-compose.yml        # Docker setup for Ollama
├── setup.sh                  # Automated setup script
└── README.md
```

## Technologies Used

### Backend
- **Spring Boot 3.2.0**: Application framework
- **LangChain4J 0.29.1**: LLM integration
- **Ollama**: Local LLM server
- **Eclipse JGit**: GitHub repository cloning
- **JavaParser**: Code parsing and analysis
- **Mermaid**: Diagram generation

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Markdown**: Markdown rendering
- **React Syntax Highlighter**: Code syntax highlighting
- **Axios**: HTTP client

## Notes

- The application processes code files in multiple languages (Java, JavaScript, Python, Go, etc.)
- All processing is done locally - no data is sent to external services
- Temporary files are automatically cleaned up after analysis
- Large repositories may take time to process

## Troubleshooting

1. **Ollama connection error**: Ensure Docker container is running and model is pulled
2. **Out of memory**: Increase Docker memory allocation or use a smaller model
3. **Timeout errors**: Increase timeout values in `application.yml`
4. **File upload errors**: Check file size limits in `application.yml`

## License

MIT License

