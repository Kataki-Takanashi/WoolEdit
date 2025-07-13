# WoolEdit

WoolEdit is an AI-powered document editor that provides real-time grammar and spelling corrections using Ollama's language models.

🌐 **Try it out: [wooledit.abdurraheem.com](https://wooledit.abdurraheem.com)**

![wool-edit-demo-no-static_background](https://github.com/user-attachments/assets/f67465f3-e3e0-4261-872a-3ae219e12eda)


## Table of Contents
- [Features](#features)
- [Live Demo](#live-demo)
- [Quick Start with Docker](#quick-start-with-docker)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Contributing](#contributing)

## Features

- Real-time text analysis and corrections
- Support for multiple Ollama models
- Rich text editing capabilities
- Word count tracking
- Keyboard shortcuts for common operations
- Docker support for easy deployment

## Live Demo

Visit [wooledit.abdurraheem.com](https://wooledit.abdurraheem.com) to try WoolEdit online.

**Note:** The online demo requires you to have Ollama running locally and use [Ollama-Bridge](https://github.com/Kataki-Takanashi/ollama-bridge) to connect your local ollama to the website.

## Quick Start with Docker

### Prerequisites
- Docker installed on your system
- Ollama running locally on port 11434 or with [Ollama-Bridge](https://github.com/Kataki-Takanashi/ollama-bridge)

### Run with Docker

```bash
docker run -p 5173:5173 sheys2003/wool-edit:latest
```

Or using docker-compose:

```bash
docker-compose up frontend
 ```

The UI will be available at: http://localhost:5173

### Troubleshooting
- Make sure Ollama is running locally before starting the Docker container
- If you can't connect to Ollama, verify it's running on port 11434
- If using Linux, replace host.docker.internal with 172.17.0.1 in docker-compose.yml

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Ollama running locally or with Ollama-Bridge

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

## Support
If you encounter any issues or have questions, please open an issue on GitHub.
