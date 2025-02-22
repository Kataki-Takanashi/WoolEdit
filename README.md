## Quick Start with Docker

### Prerequisites
- Docker installed on your system
- Ollama running locally on port 11434

### Run with one command:
```bash
docker run -p 3000:3000 aliabdurraheem/wool-edit:latest
```

Or using docker-compose:

```bash
docker-compose up frontend
```

The UI will be available at: http://localhost:3000

### Troubleshooting
- Make sure Ollama is running locally before starting the Docker container
- If you can't connect to Ollama, verify it's running on port 11434
- If using Linux, replace host.docker.internal with 172.17.0.1 in docker-compose.yml