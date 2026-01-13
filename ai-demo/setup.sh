#!/bin/bash

echo "========================================="
echo "Code Analyzer AI Demo - Setup Script"
echo "========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Start Ollama container
echo "🚀 Starting Ollama container..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start Ollama container"
    exit 1
fi

echo "✅ Ollama container started"
echo ""

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
sleep 5

# Check if Ollama is responding
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is ready"
else
    echo "⚠️  Ollama might not be ready yet. Please wait a few more seconds."
fi

echo ""
echo "📦 Pulling recommended model (codellama)..."
echo "   This may take several minutes depending on your internet connection."
docker exec -it local-ollama ollama pull codellama

if [ $? -eq 0 ]; then
    echo "✅ Model downloaded successfully"
else
    echo "⚠️  Model download failed. You can try manually:"
    echo "   docker exec -it local-ollama ollama pull codellama"
fi

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Build the application: mvn clean install"
echo "2. Run the application: mvn spring-boot:run"
echo "3. Test the API: curl http://localhost:8080/api/v1/analyze/health"
echo ""
echo "For more information, see README.md and DOCKER_SETUP.md"

