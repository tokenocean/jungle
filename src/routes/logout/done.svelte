<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import { user, password } from "$lib/store";
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";

  onMount(() => {
    if (browser) {
      $user = undefined;
      $password = undefined;
      $session.user = undefined;
      goto("/login");
    }
  });
</script>
