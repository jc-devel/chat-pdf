<script>
    import { Label, Input, Helper } from 'flowbite-svelte';
    import { appStatusInfo } from '../store';
    import { Spinner } from 'flowbite-svelte';

    const { url, pages, id } = $appStatusInfo;

    let loading = false;
    let answer = '';
    const numOfPages = Math.min(pages, 4);
    const images = Array.from({ length: numOfPages }, (_, i) => {
      // La idea es retornar imagenes del pdf subido
      const page = i + 1;
      return `${url}?page=${page}&id=${id}`;
    });

    const handleSubmit = async (event) => {
      event.preventDefault();

      loading = true;

      const question = event.target.question.value;
      const searchParams = new URLSearchParams();
      searchParams.append('question', question);
      searchParams.append('id', "Sistemas_de_comunicaci_n___Lab_2.txt");


      // const eventSource = new EventSource(`api/chat?${searchParams.toString()}`);

      // eventSource.onmessage = (event) => {
      //   // console.log(event);
      //   loading = false;

      //   const incomingMessage = JSON.parse(event.data);
      //   // console.log(incomingMessage);

      //   if (incomingMessage === '___FIN___') {
      //     eventSource.close();
      //     return;
      //   }

      //   const json = JSON.parse(incomingMessage);
      //   answer += json.data;
      // };

      const respuesta = await fetch(`api/chat?${searchParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      

      const json = await respuesta.text();
      

      answer = json;



      loading = false;

    };
  </script>
  
<div class="grid grid-cols-4 gap-4">
  {#each images as image}
    <img src={image} alt="Imagen del PDF" class="rounded w-full h-auto aspect-[400/540]" />
  {/each}
</div>



<form class="mt-8" on:submit={handleSubmit}>
  <Label class="block mb-2">Preguntale al chat</Label>
  <Input label="Input" id="question" name="email" required placeholder="¿De que trata el documento?" />
  <Helper class="text-sm mt-2">
    We’ll never share your details. Read our <a href="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500"> Privacy Policy </a>
    .
  </Helper>
</form>
  

{#if loading}
  <div class="mt-10 flex flex-col items-center justify-center gap-y-2">
    <Spinner />
    <p class="opacity-70">Esperando respuesta...</p>
  </div>
{/if}

{#if answer}
  <div class="mt-10 flex flex-col items-center justify-center gap-y-2">
    <p class="opacity-70">Respuesta:</p>
    <p class="text-gray-600">{answer}</p>

  </div>
{/if}