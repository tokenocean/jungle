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

    const rates = await fetch("/rates", {
      headers: { "content-type": "application/json" },
    }).then((r) => r.json());

    const props = await fetch("/announcements", {
      headers: { "content-type": "application/json" },
    }).then((r) => r.json());

    props.rates = rates;

    let authRequired = [/^\/a\/create/, /^\/a\/edit/, /^\/wallet/, /^\/settings/, /^\/sign/];
    if (!session?.user && authRequired.find((p) => url.pathname.match(p))) {
      return {
        status: 302,
        redirect: `/login?redirect=${url.pathname}`,
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
  import { getMessages } from "$queries/messages";
  import {
    meta,
    popup as p,
    password,
    prompt,
    poll,
    user,
    token,
    bitcoinUnitLocal,
    storeMessages,
    unreadMessages,
    username,
    fiatRates,
  } from "$lib/store";
  import { onDestroy, onMount } from "svelte";
  import branding from "$lib/branding";
  import { checkAuthFromLocalStorage, requirePassword } from "$lib/auth";
  import { query } from "$lib/api";
  import { err, decrypt, goto } from "$lib/utils";
  import { keypair, network } from "$lib/wallet";

  export let popup, rates;

  $fiatRates = rates;

  function initializeBTCUnits() {
    if ($user) {
      $bitcoinUnitLocal = $user.bitcoin_unit;
    } else if (window.localStorage.getItem("unit")) {
      $bitcoinUnitLocal = window.localStorage.getItem("unit");
    } else {
      window.localStorage.setItem("unit", "btc");
      $bitcoinUnitLocal = "btc";
    }
  }

  let refreshTimeouts = [];
  let refreshInterval = 60000;
  let authTimer,
    authInterval = 5000;
  let messagesTimer,
    messagesInterval = 5000;

  let refresh = async () => {
    if ($user) {
      try {
        let { currentuser, jwt_token } = await get("/auth/refresh");
        $token = jwt_token;
        $user = currentuser;
      } catch (e) {
        console.log("problem refreshing token", e);
        goto("/logout");
      }
    }

    refreshTimeouts.map((t) => clearTimeout(t));
    refreshTimeouts.push(setTimeout(refresh, refreshInterval));
  };

  let authCheck = async () => {
    try {
      if ($user?.username) {
        checkAuthFromLocalStorage($user);
      }
    } catch (e) {
      console.log(e);
    }

    authTimer = setTimeout(authCheck, authInterval);
  };

  let messages = [];

  let fetchMessages = async () => {
    if ($user) {
      try {
        ({ messages } = await query(getMessages));
        let newMessages = messages.filter(
          (m) => !$storeMessages.find((o) => m.id === o.id)
        );

        if (newMessages.length) {
          $storeMessages = [...$storeMessages, ...newMessages];
        }

        $unreadMessages = messages.filter(
          (message) => message.to === $user.id && message.viewed === false
        );
      } catch (e) {
        err(e);
      }
    }

    messagesTimer = setTimeout(fetchMessages, messagesInterval);
  };

  $: updateUser($session);
  let updateUser = (s) => ($user = s.user);

  if (browser) {
    $user = $session.user && { ...$session.user };
    $token = $session.jwt;

    history.pushState = new Proxy(history.pushState, {
      apply(target, thisArg, argumentsList) {
        Reflect.apply(target, thisArg, argumentsList);
        scrollTo(0, 0);
      },
    });

    $p = popup;
  }

  let open = false;
  let y;

  let stopPolling = () => {
    $poll.map(clearInterval);
    $prompt = false;
  };
  $: stopPolling($page);

  onDestroy(() => {
    refreshTimeouts.map((t) => clearTimeout(t));
    clearTimeout(authTimer);
    clearTimeout(messagesTimer);
  });

  onMount(() => {
    if (browser) {
      refresh();
      fetchMessages();
      authCheck();
      initializeBTCUnits();
      if (!$password) $password = window.sessionStorage.getItem("password");
    }
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
