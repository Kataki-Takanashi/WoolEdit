FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV HOST=0.0.0.0
ENV PORT=5173
ENV VITE_OLLAMA_URL=http://localhost:11434

CMD ["npm", "start", "--", "--host", "0.0.0.0"]