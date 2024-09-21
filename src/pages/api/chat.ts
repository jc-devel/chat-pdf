import type { APIRoute } from "astro";
import { readFile } from 'fs/promises';
import OpenAi from 'openai';
import { responseSSE } from '../../utils/sse';
import { send } from "process";

const openai = new OpenAi({
    apiKey: import.meta.env.OPENAI_API_KEY,
});

export const GET: APIRoute = async ({ request }) => {
    // console.log(request);

    const url = new URL(request.url);
    const question = url.searchParams.get('question');
    const id = url.searchParams.get('id');

    if (!question) {
        return new Response('No question provided', { status: 400 });
    }

    if (!id) {
        return new Response('No id provided', { status: 400 });
    }

    const txt = await readFile(`./uploads/text/${id}`, 'utf-8' );  

    // doc: https://github.com/ollama/ollama/blob/main/docs/api.md
    const respuesta = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "llama3.1",
            // prompt: "Por que el cielo es azul?",
            // prompt: question,
            stream: false,
            messages: [
                {
                    role: 'system',
                    content: `Eres un profesional de todas las disciplinas, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar solo la información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No inventes una respuesta, cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario. 
                    `
                },
                {
                    role: 'user',
                    content: `<context>${txt}</context><question>${question}</question>`
                }
            ]
        }),
    });

    const response = await respuesta.json();

    console.log("response:");
    console.log(response.message.content);
    
    return new Response(response.message.content);


    // return responseSSE({ request }, async (sendEvent) => {
    //     // const response = await openaiStream(question, txt);
    //     const res = await fetch('http://localhost:11434/api/generate', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             model: "llama3.1",
    //             prompt: "Por que el cielo es azul?",
    //             // stream: true,
    //             // messages: [
    //             //     {
    //             //         role: 'system',
    //             //         content: `Eres un profesional de todas las disciplinas, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar solo la información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No inventes una respuesta, cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario. 
    //             //         `
    //             //     },
    //             //     {
    //             //         role: 'user',
    //             //         content: `<context>${txt}</context><question>${question}</question>`
    //             //     }
    //             // ]
    //           }),
    //     });

    //     if (!res.ok) {
    //         throw new Error(`Error en la respuesta: ${res.statusText}`);
    //     }
    
    //     console.log("res:");
    //     console.log(res);
        
        
    //     const respuesta = await res.text();
    //     console.log("respuesta:");
    //     console.log(respuesta);

    //     //     // Maneja los datos de la respuesta
    //     //     if (response.response) {
    //     //     sendEvent(response.response); // Envía la respuesta al cliente
    //     // }
    //     // const json = JSON.parse(respuesta);
    //     // sendEvent(json.response);

    //     for await (const part of respuesta) {
    //         // const json = JSON.parse(part);
    //         // console.log("json:");
    //         // console.log(json.response);
    //         // if (part) {
    //         sendEvent(part);
    //         // }
    //     }

    //     sendEvent('___FIN___');
    // });

};

async function openaiStream(question: string, txt: string) {
    const response = await openai.chat.completions.create({
        model: 'whisper-1',
        stream: true,
        messages: [
            {
                role: 'system',
                content: `Eres un profesional de todas las disciplinas, experto en interpretar y responder preguntas basadas en las fuentes proporcionadas. Utilizando el contexto proporcionado entre las etiquetas <context></context>, genera una respuesta concisa para una pregunta rodeada con las etiquetas <question></question>. Debes usar solo la información del contexto. Usa un tono imparcial y periodístico. No repitas texto. Si no hay nada en el contexto relevante para la pregunta en cuestión, simplemente di "No lo sé". No inventes una respuesta, cualquier cosa entre los siguientes bloques html context se recupera de un banco de conocimientos, no es parte de la conversación con el usuario. 
                `
            },
            {
                role: 'user',
                content: `<context>${txt}</context><question>${question}</question>`
            }
        ]
    });
    return response;
    
}