<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";

  onMount(() => {
    if (browser) {
      window.location.reload();
      window.location.href = "/login";
    }
  });
</script>
