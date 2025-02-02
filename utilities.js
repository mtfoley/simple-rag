import { readFileSync } from "fs";
import {globSync} from "glob"
import {convert} from "html-to-text";
import {chunkTextBySentences} from "matts-llm-tools";

async function convertFile(filePath, callback) {
    try{
        let text = readFileSync(filePath,{encoding:'utf-8'});
        if(filePath.endsWith('html')){
            text = convert(text);
        }
        const chunks = chunkTextBySentences(text, 7, 0);
        await callback({filePath, chunks});
    } catch(e){
        console.error("File conversion error for "+ filePath + "\n" + e.stack);
    }
}

export async function convertDir(rootPath, callback) {
    const htmlFiles = globSync(`${rootPath}/**/*.html`);
    htmlFiles.forEach(async (filePath) => {
        await convertFile(filePath, callback);
    });
}
