<script>
  export let amount;
  export let style;
  import { updateFiat } from "$lib/utils";
</script>

<button type="button" class={style} on:click={updateFiat}>{amount}</button>
