<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";

  onMount(() => {
    if (browser) {
      window.sessionStorage.removeItem("password");
      window.sessionStorage.removeItem("username");
    }
  });
</script>
