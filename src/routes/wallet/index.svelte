<script context="module">
  import { btc } from "$lib/utils";

  export async function load() {
    return {
      status: 302,
      redirect: `/wallet/${btc}`,
    };
  }
</script>
