<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { user } from "$lib/store";
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";

  onMount(() => {
    if (browser) {
      $user = undefined;
      window.sessionStorage.removeItem("password");
      window.sessionStorage.removeItem("username");
      $session.user = undefined;
    }

    goto("/login");
  });
</script>
