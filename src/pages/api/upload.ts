import type { APIRoute } from "astro";
import fs from 'fs/promises';
import path from 'path';
import {pdfToText} from 'pdf-ts';


export const POST: APIRoute = async ({ request }) => {
    console.log(request);
    const formData = await request.formData();
    const file = formData.get('files') as File;

    console.log(formData);

    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }
    console.log(file);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(arrayBuffer);

    // Definir el nombre y la ruta del archivo a guardar
    const fileName = file.name || 'uploaded.pdf';
    const savePath = path.join(process.cwd(), 'uploads', fileName);

    // Crear la carpeta 'uploads' si no existe
    await fs.mkdir(path.dirname(savePath), { recursive: true });

    // Guardar el archivo en el sistema de archivos
    await fs.writeFile(savePath, buffer);
    
    console.log(savePath);

    const pdf = await fs.readFile(savePath);
    const text = await pdfToText(pdf);
    console.log(text);

    const txtName = fileName.replace('.pdf', '.txt') || 'uploaded.txt';
    const txtSavePath = path.join(process.cwd(), 'uploads/text', txtName);
    console.log(txtSavePath);

    // Crear la carpeta 'uploads/text' si no existe
    await fs.mkdir(path.dirname(txtSavePath), { recursive: true });

    await fs.writeFile(txtSavePath, text);


    return new Response(
      JSON.stringify({ message: 'Archivo cargado', filePath: savePath }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

};
