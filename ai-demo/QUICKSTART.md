# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17 or higher (`java -version`)
- ✅ Maven 3.6+ (`mvn -version`)
- ✅ Docker and Docker Compose (`docker --version`)

## Step-by-Step Setup

### 1. Start Local LLM (Ollama)

```bash
# Option A: Use the setup script
./setup.sh

# Option B: Manual setup
docker-compose up -d
docker exec -it local-ollama ollama pull codellama
```

### 2. Verify Ollama is Running

```bash
curl http://localhost:11434/api/tags
```

You should see your downloaded models listed.

### 3. Build the Application

```bash
mvn clean install
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 5. Test the API

```bash
# Health check
curl http://localhost:8080/api/v1/analyze/health

# Analyze a GitHub repository
curl -X POST "http://localhost:8080/api/v1/analyze/github?url=https://github.com/spring-projects/spring-boot.git"

# Analyze a ZIP file
curl -X POST http://localhost:8080/api/v1/analyze/upload -F "file=@your-code.zip"
```

## Example: Analyzing a Sample Repository

```bash
# Analyze a public GitHub repository
curl -X POST "http://localhost:8080/api/v1/analyze/github?url=https://github.com/octocat/Hello-World.git" \
  -H "Content-Type: application/json" \
  | jq '.'
```

## Response Structure

The API returns a comprehensive analysis:

```json
{
  "analysisId": "uuid",
  "status": "SUCCESS",
  "message": "Analysis completed successfully",
  "generatedImages": [
    "./generated-images/flowchart_xxx.png",
    "./generated-images/sequence_xxx.png",
    "./generated-images/architecture_xxx.png"
  ],
  "documentation": "# Technical Documentation\n\n...",
  "codeReview": {
    "overallScore": "8/10",
    "summary": "Comprehensive code review summary...",
    "issues": [
      {
        "severity": "HIGH",
        "category": "SECURITY",
        "filePath": "src/main/java/Example.java",
        "lineNumber": 42,
        "description": "Potential SQL injection vulnerability",
        "recommendation": "Use prepared statements"
      }
    ],
    "suggestions": [
      {
        "area": "CODE_QUALITY",
        "description": "Consider extracting magic numbers",
        "suggestedChange": "Define constants for repeated values",
        "impact": "Improved maintainability"
      }
    ],
    "strengths": [
      "Well-structured code",
      "Good error handling",
      "Comprehensive tests"
    ]
  }
}
```

## Troubleshooting

### Ollama Connection Issues

```bash
# Check if Ollama is running
docker ps | grep ollama

# Check Ollama logs
docker logs local-ollama

# Restart Ollama
docker-compose restart
```

### Model Not Found

```bash
# List available models
docker exec -it local-ollama ollama list

# Pull a model
docker exec -it local-ollama ollama pull codellama
```

### Application Won't Start

1. Check Java version: `java -version` (should be 17+)
2. Check Maven: `mvn -version`
3. Check port 8080 is available: `lsof -i :8080`
4. Check application logs for errors

### Slow Processing

- Use a faster model (mistral instead of codellama)
- Increase Docker memory allocation
- Process smaller codebases first
- Increase timeout in `application.yml`

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Read [DOCKER_SETUP.md](DOCKER_SETUP.md) for advanced Docker configuration
- Customize `application.yml` for your needs
- Integrate Mermaid CLI for better image generation

## Converting Mermaid Diagrams to Images

The application generates Mermaid diagram files. To convert them to PNG:

```bash
# Install Mermaid CLI
npm install -g @mermaid-js/mermaid-cli

# Convert a diagram
mmdc -i generated-images/flowchart_xxx.mmd -o generated-images/flowchart_xxx.png
```

Or use the online service: https://mermaid.ink/

