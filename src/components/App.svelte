<script>
    import { Alert } from 'flowbite-svelte';
    import { APP_STATUS, appStatus } from '../store';
    import StepUpload from './StepUpload.svelte';
    import StepChat from './StepChat.svelte';
  import StepLoading from './StepLoading.svelte';


  </script>
  
  {#if $appStatus === APP_STATUS.INIT}
    <StepUpload />
  {:else if $appStatus === APP_STATUS.LOADING}
    <StepLoading />
  {:else if $appStatus === APP_STATUS.CHAT_MODE}
    <StepChat />
  {:else if $appStatus === APP_STATUS.ERROR}
  <Alert>
    <span class="font-medium">Error!</span>
    <p>Something went wrong. Please try again later.</p>
  </Alert>
    
  {/if}

  