<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { user } from "$lib/store";
  import { goto } from "$app/navigation";

  onMount(() => {
    if (browser) {
      $user = undefined;
      window.sessionStorage.removeItem("password");
      window.sessionStorage.removeItem("username");
    }

    goto('/login');
  });
</script>
