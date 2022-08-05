<script context="module">
  export async function load({ params }) {
let { asset } = params;
    return {
      status: 302,
      redirect: `/wallet/${asset}/1`,
    };
  }
</script>
