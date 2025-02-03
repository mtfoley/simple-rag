# Simple RAG

## Tools:
- [Docker](https://docker.com/)
- [NodeJS](https://nodejs.org/)
- [Ollama](https://ollama.com/)
- [ChromaDB](https://docs.trychroma.com)

## References: 
- https://www.youtube.com/watch?v=8rz9axIzIy4
- https://docs.trychroma.com/cli/install-and-run

## What does this do?
This implements simple RAG with Ollama and ChromaDB.

## How do I use it?
1) Copy HTML/Markdown/Text files into the ./docs directory.
2) Run `npm install`
3) Start up the applications. Run `docker compose up -d`. 
4) Watch for status of `init` container with `docker compose logs --follow init`.
5) Once service "init" has exited, run `npm run init`.
6) Once this is finished, run `npm run search "{your question}"`, as many times as you want.
