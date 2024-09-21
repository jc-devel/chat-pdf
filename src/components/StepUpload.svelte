<script>
    import { appStatus, setAppStatusLoading, setAppStatusChatMode, setAppStatusError } from '../store';
    import Dropzone from "svelte-file-dropzone";
  
    let files = {
      accepted: [],
      rejected: []
    };
  
    async function handleFilesSelect(e) {
        setAppStatusLoading();
      const { acceptedFiles, fileRejections } = e.detail;

      console.log(acceptedFiles);

      files.accepted = [...files.accepted, ...acceptedFiles];
      files.rejected = [...files.rejected, ...fileRejections];

      if (files.accepted.length > 0) {
        const formData = new FormData();
        formData.append('files', acceptedFiles[0]);

        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        console.log(res);

        if (!res.ok) {
          console.error('Error al subir el archivo');
          setAppStatusError();
          return;
        }
        
        const result = await res.json();
        console.log(result);
        setAppStatusChatMode(result);
        
      }
    }
  </script>

  {#if files.accepted.length === 0}

  <Dropzone 
  accept="application/pdf"
  multiple={false}
  on:drop={handleFilesSelect} 

  >
    Arrastra tus archivos aquí
    </Dropzone>

  {/if}
  

  <ol>
    {#each files.accepted as item}
      <li>{item.name}</li>
    {/each}
  </ol>