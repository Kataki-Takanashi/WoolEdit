# WoolEdit

WoolEdit is an AI-powered document editor that provides real-time grammar and spelling corrections using Ollama's language models.

## Features

- Real-time text analysis and corrections
- Support for multiple Ollama models
- Rich text editing capabilities
- Word count tracking
- Keyboard shortcuts for common operations
- Docker support for easy deployment

## Quick Start with Docker

### Prerequisites
- Docker installed on your system
- Ollama running locally on port 11434 or with [Ollama-Bridge](https://github.com/Kataki-Takanashi/ollama-bridge)

### Run with one command:
```bash
docker run -p 5173:5173 sheys2003/wool-edit:latest
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


## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Ollama running locally or with [Ollama-Bridge](https://github.com/Kataki-Takanashi/ollama-bridge)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Kataki-Takanashi/WoolEdit.git
cd WoolEdit
```

2. Install dependencies
```bash
npm install
 ```

3. Start the development server
```bash
npm run dev
 ```

The application will be available at http://localhost:5173

## Environment Variables
- VITE_OLLAMA_URL : URL for the Ollama API (default: http://localhost:11434 )

## Tech Stack
- React
- Vite
- TailwindCSS
- TipTap Editor
- Docker

## License
[MIT License](LICENSE) - feel free to use this project for personal or commercial purposes.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.