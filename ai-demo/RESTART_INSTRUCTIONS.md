# IMPORTANT: Restart Required After Configuration Changes

## The Issue

The error shows that the application is still trying to use `llama2` even though the configuration has been updated to use `codellama`. This happens because **Spring Boot loads configuration at startup** and keeps it in memory.

## Solution: Restart the Application

You **MUST restart** your Spring Boot application for configuration changes to take effect.

### Steps to Restart:

1. **Stop the current application:**
   - Find the terminal where `mvn spring-boot:run` is running
   - Press `Ctrl+C` to stop it

2. **Rebuild (optional but recommended):**
   ```bash
   mvn clean compile
   ```

3. **Restart the application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Verify the configuration is loaded:**
   - Look for log messages like:
     ```
     Initializing OllamaChatModel with baseUrl: http://localhost:11434, model: codellama, timeout: 300000ms
     ```

## Current Configuration

The application is now configured to use:
- **Model**: `codellama` (matches your downloaded model)
- **Base URL**: `http://localhost:11434`
- **Timeout**: 300000ms (5 minutes)

## Verify Your Model

Check what models are available in Ollama:
```bash
curl http://localhost:11434/api/tags
```

The model name in `application.yml` must **exactly match** one of the model names returned by Ollama.

## After Restart

Once you restart, the application should:
1. Load the new configuration
2. Connect to `codellama` model
3. Work correctly with your uploaded code

## Troubleshooting

If you still see errors after restarting:

1. **Check the logs** for the initialization message showing which model is being used
2. **Verify Ollama is running**: `docker ps | grep ollama`
3. **Verify the model exists**: `curl http://localhost:11434/api/tags`
4. **Check the configuration file**: `cat src/main/resources/application.yml | grep -A2 ollama:`

