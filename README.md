# Simple RAG

## Tools:
ChromaDB
Docker

## References: 
https://www.youtube.com/watch?v=8rz9axIzIy4
https://docs.trychroma.com/cli/install-and-run

## What does this do?
This implements simple RAG with Ollama and ChromaDB.

## How do I use it?
1) Copy HTML/Markdown/Text files into the ./docs directory.
2) Start up the applications. Run `docker compose up -d`
3) Once service "init" has exited, run `node client.js init`
4) Once this is finished, run `node client.js search "{your question}", as many times as you want.
