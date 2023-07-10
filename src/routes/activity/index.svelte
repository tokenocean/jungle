<script context="module">
  export async function load({ fetch }) {
    try {
      const response = await fetch(`/activity.json`);

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      const props = await response.json();

      return {
        props,
      };
    } catch (error) {
      console.error(error);
      // Handle the error gracefully, e.g., show an error message or fallback content.
      return {
        props: {
          error: error.message,
        },
      };
    }
  }
</script>

<script>
  import { Activity } from "$comp";
  export let transactions;

</script>

<div class="container mx-auto my-10 md:my-20">
  <h2>Activity</h2>
  {#if transactions}
    <div class="flex flex-wrap justify-between mt-10 lg:mt-20">
      <div class="w-full lg:max-w-lg mx-auto">
        {#each transactions as transaction}
          <Activity {transaction} showImage={true} />
        {/each}
      </div>
    </div>
  {:else}
    <p>No transactions available.</p>
  {/if}
</div>
