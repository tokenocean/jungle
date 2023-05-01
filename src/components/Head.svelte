<script>
  import { page } from "$app/stores";

  const dev = import.meta.env.DEV;
  const host = import.meta.env.VITE_HOST;
  export let metadata;
</script>

<svelte:head>
  <title>{metadata.title}</title>
  <meta property="og:title" content={metadata.title} />
  <meta name="twitter:title" content={metadata.title} />

  <meta property="og:type" content="website" />
  <meta property="og:description" content={metadata.description} />
  <meta name="description" content={metadata.description} />

  <meta name="keywords" content={metadata.keywords} />

  {#if metadata.video}
    <meta property="og:video" content={metadata.video} />
    <meta name="twitter:video" content={metadata.video} />
    <meta property="og:video:height" content="640" />
    <meta property="og:video:width" content="385" />
    <meta name="twitter:card" content="player" />
    <meta name="twitter:player" content={host + $page.url.pathname} />
  {:else if metadata.image}
    <meta property="og:image" content={metadata.image} />
    <meta name="twitter:image" content={metadata.image} />
    <meta name="twitter:card" content="summary_large_image" />
  {/if}

  <meta property="og:url" content={host + $page.url.pathname} />
  <meta name="twitter:site" content={metadata.twitter.site} />
  <meta name="twitter:creator" content={metadata.twitter.creator} />
  <link rel="apple-touch-icon" sizes="180x180" href="/resources/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/resources/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/resources/favicons/favicon-16x16.png">
  <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
  <meta name="apple-mobile-web-app-capable" content="yes"></meta>
  <meta name="apple-mobile-web-app-status-bar-style" content="default"></meta>

  {#if !dev}
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-H25E4PKPEC"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-H25E4PKPEC");
    </script>
  {/if}
</svelte:head>
