# Docker Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- At least 8GB of RAM available for Docker
- Internet connection for initial model download

## Quick Start

### 1. Start Ollama Container

```bash
docker-compose up -d
```

This will start the Ollama service on port 11434.

### 2. Verify Ollama is Running

```bash
docker ps
```

You should see a container named `local-ollama` running.

### 3. Pull a Language Model

You need to pull at least one model. Recommended models for code analysis:

#### Option A: Llama 2 (General Purpose)
```bash
docker exec -it local-ollama ollama pull llama2
```

#### Option B: CodeLlama (Code-Specific, Recommended)
```bash
docker exec -it local-ollama ollama pull codellama
```

#### Option C: Mistral (Fast and Efficient)
```bash
docker exec -it local-ollama ollama pull mistral
```

#### Option D: DeepSeek Coder (Best for Code)
```bash
docker exec -it local-ollama ollama pull deepseek-coder
```

### 4. Verify Model is Available

```bash
docker exec -it local-ollama ollama list
```

### 5. Update Application Configuration

Edit `src/main/resources/application.yml` and set the model name:

```yaml
ollama:
  base-url: http://localhost:11434
  model: codellama  # Change to your preferred model
  timeout: 300000
```

### 6. Test Ollama Connection

```bash
curl http://localhost:11434/api/tags
```

You should see a list of available models.

## Model Recommendations

| Model | Size | Best For | Speed |
|-------|------|----------|-------|
| llama2 | 3.8GB | General purpose | Medium |
| codellama | 3.8GB | Code analysis | Medium |
| mistral | 4.1GB | Fast responses | Fast |
| deepseek-coder | 6.7GB | Best code quality | Slow |

For development and testing, start with `codellama` or `mistral`.
For production code analysis, use `deepseek-coder` for best results.

## Troubleshooting

### Container Won't Start

1. Check Docker is running:
   ```bash
   docker info
   ```

2. Check port 11434 is available:
   ```bash
   lsof -i :11434
   ```

3. Check Docker logs:
   ```bash
   docker logs local-ollama
   ```

### Out of Memory Errors

1. Increase Docker memory limit:
   - Docker Desktop: Settings → Resources → Memory
   - Minimum: 8GB recommended
   - For larger models: 16GB+

2. Use a smaller model:
   ```bash
   docker exec -it local-ollama ollama pull llama2:7b
   ```

### Model Download Fails

1. Check internet connection
2. Try pulling again:
   ```bash
   docker exec -it local-ollama ollama pull codellama
   ```
3. Check available disk space:
   ```bash
   df -h
   ```

### Slow Response Times

1. Use a faster model (mistral)
2. Increase timeout in `application.yml`
3. Check system resources:
   ```bash
   docker stats local-ollama
   ```

## Stopping the Service

```bash
docker-compose down
```

To remove all data (including downloaded models):

```bash
docker-compose down -v
```

## Advanced Configuration

### Custom Model Configuration

You can modify the model parameters by editing the Ollama configuration or using environment variables in `docker-compose.yml`:

```yaml
services:
  ollama:
    environment:
      - OLLAMA_NUM_PARALLEL=4
      - OLLAMA_MAX_LOADED_MODELS=2
```

### Persistent Storage

Models are stored in a Docker volume `ollama-data`. To backup:

```bash
docker run --rm -v ollama-data:/data -v $(pwd):/backup alpine tar czf /backup/ollama-backup.tar.gz /data
```

To restore:

```bash
docker run --rm -v ollama-data:/data -v $(pwd):/backup alpine tar xzf /backup/ollama-backup.tar.gz -C /data
```

## Security Notes

- Ollama is exposed on `0.0.0.0:11434` by default
- For production, consider:
  - Using a reverse proxy
  - Restricting network access
  - Using authentication (if supported by your Ollama version)

