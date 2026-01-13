# Complete Setup Guide

This guide will help you set up the entire Code Analyzer AI Demo application from scratch.

## Prerequisites Checklist

- [ ] Java 17 or higher (`java -version`)
- [ ] Maven 3.6+ (`mvn -version`)
- [ ] Docker and Docker Compose (`docker --version`)
- [ ] Node.js 18+ and npm (`node -version`, `npm -version`)
- [ ] At least 8GB RAM available for Docker
- [ ] Internet connection for initial setup

## Step-by-Step Setup

### Step 1: Clone/Download the Project

```bash
cd /path/to/your/projects
# If using git:
# git clone <repository-url> ai-demo
cd ai-demo
```

### Step 2: Start Ollama (Local LLM)

```bash
# Option A: Use the automated script
./setup.sh

# Option B: Manual setup
docker-compose up -d
docker exec -it local-ollama ollama pull codellama
```

**Wait for the model to download** (this may take several minutes depending on your internet speed).

Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

You should see your downloaded model listed.

### Step 3: Configure Backend

Edit `src/main/resources/application.yml` if needed:

```yaml
ollama:
  base-url: http://localhost:11434
  model: codellama  # Change if you pulled a different model
  timeout: 300000
```

### Step 4: Build and Run Backend

```bash
# Build the project
mvn clean install

# Run the backend
mvn spring-boot:run
```

Wait for the message: `Started CodeAnalyzerApplication`

The backend is now running on `http://localhost:8080`

### Step 5: Setup Frontend

Open a **new terminal window** and:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Wait for the message: `Local: http://localhost:3000`

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the Code Analyzer AI interface!

## Testing the Application

### Test 1: Health Check

```bash
curl http://localhost:8080/api/v1/analyze/health
```

Should return: `Service is running`

### Test 2: Analyze a GitHub Repository

1. In the web interface, click the "GitHub Repository" tab
2. Enter: `https://github.com/octocat/Hello-World.git`
3. Click "Analyze Repository"
4. Wait for analysis to complete (may take 2-5 minutes)

### Test 3: Analyze a ZIP File

1. Create a ZIP file of some code
2. In the web interface, click "Upload ZIP"
3. Select your ZIP file
4. Click "Analyze Code"
5. Wait for results

## Troubleshooting

### Ollama Issues

**Problem**: Ollama container won't start
```bash
# Check Docker is running
docker ps

# Check logs
docker logs local-ollama

# Restart
docker-compose restart
```

**Problem**: Model not found
```bash
# List available models
docker exec -it local-ollama ollama list

# Pull model again
docker exec -it local-ollama ollama pull codellama
```

### Backend Issues

**Problem**: Port 8080 already in use
```bash
# Find what's using the port
lsof -i :8080

# Kill the process or change port in application.yml
```

**Problem**: Build fails
```bash
# Clean and rebuild
mvn clean
mvn install
```

**Problem**: Out of memory
- Increase Docker memory limit (Settings → Resources → Memory)
- Use a smaller model: `docker exec -it local-ollama ollama pull llama2:7b`

### Frontend Issues

**Problem**: npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Can't connect to backend
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Verify API URL in `.env` file (if using custom URL)

**Problem**: Port 3000 already in use
- Vite will automatically try the next available port
- Or change port in `vite.config.js`

## Development Workflow

### Making Backend Changes

1. Edit Java files in `src/main/java/`
2. Spring Boot will auto-reload (if dev tools are enabled)
3. Or restart: `mvn spring-boot:run`

### Making Frontend Changes

1. Edit files in `frontend/src/`
2. Vite will hot-reload automatically
3. Changes appear instantly in browser

### Viewing Logs

**Backend logs**: In the terminal running `mvn spring-boot:run`

**Frontend logs**: In the terminal running `npm run dev` and browser console (F12)

**Ollama logs**: `docker logs local-ollama`

## Production Deployment

### Backend

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/code-analyzer-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build

# Deploy dist/ directory to your web server
```

See `FRONTEND_SETUP.md` for deployment options.

## Next Steps

- Read `README.md` for detailed feature documentation
- Read `DOCKER_SETUP.md` for advanced Docker configuration
- Read `FRONTEND_SETUP.md` for frontend-specific details
- Customize `application.yml` for your needs
- Install mermaid-cli for better diagram conversion

## Getting Help

1. Check the troubleshooting section above
2. Review logs for error messages
3. Verify all prerequisites are installed
4. Ensure all services are running
5. Check network connectivity

## Architecture Overview

```
┌─────────────┐
│   Browser   │ (http://localhost:3000)
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │ (http://localhost:8080)
│ Spring Boot │
└──────┬──────┘
       │ LangChain4J
       │
┌──────▼──────┐
│   Ollama    │ (http://localhost:11434)
│  (Docker)   │
└─────────────┘
```

## Performance Tips

1. **Use faster models** for development (mistral)
2. **Use better models** for production (deepseek-coder)
3. **Increase Docker memory** for large models
4. **Process smaller codebases** first to test
5. **Increase timeout** in `application.yml` for large repos

## Security Notes

- Ollama is exposed on `0.0.0.0:11434` (accessible from host)
- Backend CORS is set to `*` (allows all origins)
- For production, restrict these settings
- Consider adding authentication

## License

MIT

