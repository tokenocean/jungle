<script>
  import * as nobleSecp256k1 from "@noble/secp256k1";
  import { fromBase58 } from "bip32";
  import { keypair, network } from "$lib/wallet";
  import { user, unreadMessages, storeMessages } from "$lib/store";
  import { encrypt, decrypt } from "$lib/utils";
  import Fa from "svelte-fa";
  import { onMount, onDestroy, tick } from "svelte";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { createMessage, updateMessage } from "$queries/messages";
  import { newapi as api, query } from "$lib/api";
  import { requirePassword } from "$lib/auth";

  let messageWindow;
  let ownPrivKey;
  let ownPubKey;

  onMount(async () => {
    await requirePassword();
    ownPrivKey = keypair().privkey.toString("hex");
    ownPubKey = keypair().pubkey.toString("hex").substring(2);
  });

  onDestroy(() => {
    clearInterval(readMessagesInterval);
  });

  let uniq = (a, k) => [...new Map(a.map((x) => [k(x), x])).values()];

  $: users = uniq(
    [
      ...$storeMessages.map(
        ({ fromUser: { username, avatar_url, id, pubkey } }) => ({
          username,
          avatar_url,
          id,
          pubkey,
        })
      ),
      ...$storeMessages.map(
        ({ toUser: { username, avatar_url, id, pubkey } }) => ({
          username,
          avatar_url,
          id,
          pubkey,
        })
      ),
    ],
    (m) => m.username
  ).filter((u) => u.username !== $user.username);

  let selectedUser;
  let sendMessage;
  let readMessagesInterval;

  async function onSubmit() {
    let encryptedMessage = encrypt(
      ownPrivKey,
      selectedUser.pubkey,
      sendMessage
    );

    let {
      insert_messages_one: { id },
    } = await query(createMessage, {
      message: {
        message: encryptedMessage,
        to: selectedUser.id,
      },
    });

    await api().url("/mail-message-received").post({
      userId: selectedUser.id,
    });

    $storeMessages.push({
      message: encryptedMessage,
      created_at: Date.now(),
      from: $user.id,
      to: selectedUser.id,
      id: id,
      viewed: true,
      toUser: {
        avatar_url: selectedUser.avatar_url,
        id: selectedUser.id,
        username: selectedUser.username,
        pubkey: selectedUser.pubkey,
      },
      fromUser: {
        avatar_url: $user.avatar_url,
        id: $user.id,
        username: $user.username,
        pubkey: $user.pubkey,
      },
    });

    $storeMessages = [...$storeMessages];
    sendMessage = "";

    await tick();
    scrollDown();
  }

  function timestamp(data) {
    let time = new Date(data);
    return time.toLocaleDateString();
  }

  $: scrollDown($storeMessages);
  async function scrollDown(l) {
    await tick();
    if (messageWindow) messageWindow.scrollTop = messageWindow.scrollHeight;
  }

  const setReadMessages = async (user) => {
    $storeMessages.forEach((message) => {
      if (message.from === user.id && message.viewed === false) {
        message.viewed = true;
      }
    });

    $unreadMessages.forEach((message) => {
      if (message.from === user.id) {
        message.viewed = true;
      }
    });

    $unreadMessages = $unreadMessages.filter(
      (message) => message.viewed === false
    );

    api().url("/markRead").post({ from: user.id });
  };

  async function handleSelection(user) {
    selectedUser = user;

    selectedUser.pubkeyFormatted = fromBase58(user.pubkey, network)
      .publicKey.toString("hex")
      .substring(2);

    setReadMessages(user);
    readMessagesInterval = setInterval(() => setReadMessages(user), 1000);

    scrollDown();
  }

  const messagesSort = (messageA, messageB) => {
    if (messageA.created_at > messageB.created_at) {
      return 1;
    }

    if (messageA.created_at < messageB.created_at) {
      return -1;
    }

    return 0;
  };

  const unreadMessagesFromUser = (user) => {
    return $unreadMessages.filter((message) => message.from === user.id);
  };
</script>

<div class="flex justify-center items-center py-10">
  <div class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-2">
    <h2 class="text-center mb-10">Messages</h2>

    <div class="border p-10 w-full rounded-lg space-y-4 dark-bg">
      {#if selectedUser === undefined}
        <a href={`/${$user.username}`} class="text-[#30bfad]">
          <div class="flex">
            <Fa icon={faChevronLeft} class="my-auto mr-1" />
            <div>Back to profile</div>
          </div>
        </a>
        {#each users as user}
          <div class="flex">
            <div class="bg-[#30bfad] w-3 py-2 rounded-l-lg" />
            <button
              class="bg-[#31373e] flex justify-center items-center space-x-4 w-full p-2 px-10 rounded-r-lg"
              on:click={() => handleSelection(user)}
            >
              <img
                src={`/api/public/${user.avatar_url}`}
                alt="avatar"
                class="w-10 h-10 rounded-full"
              />
              <p>{user.username}</p>
              {#if unreadMessagesFromUser(user).length > 0}
                <p>
                  ({unreadMessagesFromUser(user).length})
                </p>
              {/if}
            </button>
          </div>
        {/each}
        {#if $storeMessages.length === 0}
          <p class="text-center">No messages yet.</p>
        {/if}
      {:else}
        <div>
          <div class="flex justify-center">
            <a href={`/${selectedUser.username}`}>
              <div class="flex items-center">
                <img
                  src={`/api/public/${selectedUser.avatar_url}`}
                  alt="avatar"
                  class="w-12 h-12 rounded-full"
                />

                <p class="ml-4">{selectedUser.username}</p>
              </div>
            </a>
          </div>
          <button
            class="text-[#30bfad]"
            on:click={() => {
              selectedUser = undefined;
              clearInterval(readMessagesInterval);
            }}
          >
            <div class="flex">
              <Fa icon={faChevronLeft} class="my-auto mr-1" />
              <div>Back</div>
            </div>
          </button>
        </div>
        <div
          class="bg-[#31373e] border border-white/50 space-y-4 w-full py-4 px-5 md:px-10 rounded-lg max-h-96 overflow-auto"
          bind:this={messageWindow}
        >
          {#each $storeMessages
            .filter((message) => message.from === selectedUser.id || message.to === selectedUser.id)
            .sort(messagesSort) as message}
            <div
              class="flex {message.from === selectedUser.id
                ? 'justify-start'
                : 'justify-end'}"
            >
              <div
                class="w-2/3 rounded-lg p-2 {message.from === selectedUser.id
                  ? 'dark-bg'
                  : 'bg-primary text-black'}"
              >
                <p class="break-all">
                  {decrypt(
                    ownPrivKey,
                    message.from === selectedUser.id
                      ? message.fromUser.pubkey
                      : message.toUser.pubkey,
                    message.message
                  )}
                </p>
                <p class="text-xs text-gray-400 text-right">
                  {timestamp(message.created_at)}
                </p>
              </div>
            </div>
          {/each}
        </div>
        <form on:submit|preventDefault={onSubmit}>
          <textarea
            bind:value={sendMessage}
            required
            placeholder="Enter message..."
            id="message"
            name="message"
            class="rounded-lg w-full bg-[#31373e]/75 border border-white/50"
          />
          <button class="primary-btn ml-auto">Send message</button>
        </form>
      {/if}
    </div>
  </div>
</div>
