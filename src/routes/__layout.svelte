<script context="module">
  import { prerendering } from "$app/env";
  import { get } from "$lib/api";
  import "../main.css";

  export async function load({ fetch, url, session }) {
    if (prerendering)
      return {
        props: {
          popup: null,
        },
      };

    const props = await get(`/announcements.json`, fetch);
    props.jwt = session.jwt;

    let authRequired = [/a\/create/, /edit/, /wallet/];
    if (!session?.user && authRequired.find((p) => url.pathname.match(p))) {
      return {
        status: 302,
        redirect: "/login",
      };
    }

    let adminRequired = [/admin/];
    if (
      !session?.user?.is_admin &&
      adminRequired.find((p) => url.pathname.match(p))
    ) {
      return {
        status: 302,
        redirect: "/login",
      };
    }

    if (
      session?.user &&
      !(
        session.user.wallet_initialized ||
        ["/wallet", "/logout"].find((p) => url.pathname.includes(p))
      )
    )
      return {
        status: 302,
        redirect: "/wallet/setup",
      };

    return {
      props,
    };
  }
</script>

<script>
  import { browser } from "$app/env";
  import { page, session } from "$app/stores";
  import decode from "jwt-decode";
  import { Sidebar, Navbar, Dialog, Footer, Snack, Head } from "$comp";
  import {
    meta,
    popup as p,
    password,
    prompt,
    poll,
    user,
    token,
    bitcoinUnitLocal,
  } from "$lib/store";
  import { onDestroy, onMount } from "svelte";
  import branding from "$lib/branding";
  import { checkAuthFromLocalStorage } from "$lib/auth";

  export let popup;
  export let jwt;

  function initializeBTCUnits() {
    if ($session.user) {
      $bitcoinUnitLocal = $session.user.bitcoin_unit;
    } else if (browser && window.localStorage.getItem("unit")) {
      $bitcoinUnitLocal = browser && window.localStorage.getItem("unit");
    } else {
      browser && window.localStorage.setItem("unit", "btc");
      $bitcoinUnitLocal = "btc";
    }
  }

  initializeBTCUnits();

  let unsubscribeFromSession;
  let refreshInterval;
  let authCheckInterval;

  let refresh = async () => {
    try {
      let { jwt_token } = await get("/auth/refresh.json", fetch);
      $token = jwt_token;
    } catch (e) {
      console.log(e);
    }
  };

  let authCheck = async () => {
    try {
      if ($session.user) {
        checkAuthFromLocalStorage($session.user);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (browser) {
    history.pushState = new Proxy(history.pushState, {
      apply(target, thisArg, argumentsList) {
        Reflect.apply(target, thisArg, argumentsList);
        scrollTo(0, 0);
      },
    });

    $p = popup;
    $user = $session.user;
    $token = jwt;

    refreshInterval = setInterval(refresh, 720000);
    authCheckInterval = setInterval(authCheck, 5000);

    unsubscribeFromSession = session.subscribe((value) => {
      value && value.user && checkAuthFromLocalStorage(value.user);
    });
  }

  let open = false;
  let y;

  let stopPolling = () => {
    $poll.map(clearInterval);
    $prompt = false;
  };
  $: stopPolling($page);

  onDestroy(() => {
    clearInterval(refreshInterval);
    clearInterval(authCheckInterval);
    unsubscribeFromSession && unsubscribeFromSession();
  });
  onMount(() => {
    if (browser && !$password)
      $password = window.sessionStorage.getItem("password");
  });
</script>

<svelte:window bind:scrollY={y} />

{#if !($page.url.pathname.includes("/a/") && $page.url.pathname.split("/").length === 3)}
  <Head metadata={branding.meta} />
{/if}

<Snack />

<Sidebar bind:open />
<div class={y > 50 ? "sticky" : ""}>
  <Navbar bind:sidebar={open} />
</div>
<Dialog />

<main>
  <div class="mx-auto min-h-screen">
    <slot />
  </div>
</main>

<Footer />

<style global>
  input,
  textarea,
  select {
    @apply border bg-white focus:outline-none;
    overflow-y: auto;
    padding: 0;
    padding: 10px;
  }

  .title {
    @apply font-bold pb-14 text-4xl text-left;
    color: #133e7c;
  }
</style>
