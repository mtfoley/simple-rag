import { ChromaClient } from "chromadb";
import ollama from "ollama";
import { convertDir } from "./utilities.js";

// Directory to read docs from.
const docsDir = "./docs";

// See docker-compose "init" service for which model files these names map to.
const embedModel = "embed";
const mainModel = "expert";

function getClient() {
    return new ChromaClient({ path: "http://localhost:8000" })
}
async function configureCollection(client, name, description) {
    const metadata = description ? {description} : {};
    try {
        await client.deleteCollection({name});
    } catch (e){
        
    }
    return await client.getOrCreateCollection({name, metadata});   
}
async function getChunkEmbedding(chunk){
    console.log(`Getting embedding for chunk of length ${chunk.length}`);
    return (await ollama.embeddings({model: embedModel, prompt: chunk})).embedding;
}

async function addDoc(collection, filePath, i, chunk){
    const embed = await getChunkEmbedding(chunk);
    await collection.add({ids: [`${filePath}:${i}`], embeddings:[embed], metadatas:[{source:filePath}], documents:[chunk]});
}

function generateCallback(collection){
    return async ({filePath, chunks}) => {
        console.log(`Adding records for ${chunks.length} chunks for ${filePath}`);
        const promises = [];

        for(let i=0,l=chunks.length;i<l;i++){
            promises.push(addDoc(collection, filePath, i, chunks[i]));
        }
        Promise.allSettled(promises).then(() => {
            console.log(`Finished adding records for ${filePath}`);
        })
    }
}
async function bootstrap() {
    const client = getClient();
    const coll = await configureCollection(client, "docs", "collection for docs");
    
    const fileCallback = generateCallback(coll);
    await convertDir(docsDir, fileCallback);
    return coll;
}

async function search(collection, query){
    const queryEmbed = (await ollama.embeddings({model: embedModel, prompt: query})).embedding;
    const relevantDocs = await collection.query({queryEmbeddings: [queryEmbed], nResults: 2});
    if(relevantDocs.documents && relevantDocs.documents.length === 1){
        const ragQuery = `${query} - Answer that question using the following text as a resource, without downloading any new documents: ${relevantDocs.documents[0].join("\n")}`.substring(0, 2048);
        const {response} = await ollama.generate({model: mainModel, prompt: ragQuery, stream: false });
        console.log(response);
    }
}

const [command] = process.argv.slice(2);

if(command == "init"){
    bootstrap();
} else if(command == "search"){
    const query = process.argv.slice(3).join(" ");
    const collection = await getClient().getCollection({name: "docs"});
    search(collection, query);
}
