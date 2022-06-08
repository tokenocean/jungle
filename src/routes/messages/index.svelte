<script>
  import Fa from "svelte-fa";
  import { tick } from "svelte";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { session } from "$app/stores";
  import { createMessage, updateMessage } from "$queries/messages";
  import { api, query } from "$lib/api";

  export let messages;

  let uniq = (a, k) => [...new Map(a.map((x) => [k(x), x])).values()];
  let users = uniq(
    messages.map(({ fromUser: { username, avatar_url, id } }) => ({
      username,
      avatar_url,
      id,
    })),
    (m) => m.username
  );

  users = users.filter((user) => user.username !== $session.user.username);

  let selectedUser;
  let sendMessage;

  async function onSubmit() {
    let {
      insert_messages_one: { id },
    } = await query(createMessage, {
      message: {
        message: sendMessage,
        to: selectedUser.id,
      },
    });

    messages.push({
      message: sendMessage,
      created_at: Date.now(),
      from: $session.user.id,
      to: selectedUser.id,
      id: id,
      user: {
        avatar_url: selectedUser.avatar,
        id: selectedUser.id,
        username: selectedUser.username,
      },
    });

    messages = [...messages];
    sendMessage = "";
    await tick();
    getFocus();
  }

  function timestamp(data) {
    let time = new Date(data);
    return time.toLocaleDateString();
  }

  let bottom;
  function getFocus() {
    bottom.focus({ preventScroll: false });
  }

  async function handleSelection(user) {
    selectedUser = user;

    await tick();
    getFocus();

    api.auth(`Bearer ${$session.jwt}`).url("/markRead").post({ from: user.id });
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
</script>

<div class="flex justify-center items-center py-10">
  <div class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-2">
    <h2 class="text-center mb-10">Messages</h2>

    <div class="border p-10 w-full rounded-lg space-y-4 dark-bg">
      {#if selectedUser === undefined}
        <a href={`/${$session.user.username}`} class="text-[#30bfad]">
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
                src="/api/public/{user.avatar_url}"
                alt="avatar"
                class="rounded-full w-12"
              />
              <p>{user.username}</p>
              <p>
                ({messages.filter(
                  (message) =>
                    message.from === user.id || message.to === user.id
                ).length})
              </p>
            </button>
          </div>
        {/each}
        {#if messages.length === 0}
          <p class="text-center">No messages yet.</p>
        {/if}
      {:else}
        <div>
          <div class="flex justify-center">
            <div class="flex items-center">
              <img
                src="/api/public/{selectedUser.avatar_url}"
                alt="avatar"
                class="rounded-full w-12 mr-4"
              />
              <p>{selectedUser.username}</p>
            </div>
          </div>
          <button
            class="text-[#30bfad]"
            on:click={() => (selectedUser = undefined)}
          >
            <div class="flex">
              <Fa icon={faChevronLeft} class="my-auto mr-1" />
              <div>Back</div>
            </div>
          </button>
        </div>
        <div
          class="bg-[#31373e] border border-white/50 space-y-4 w-full py-4 px-5 md:px-10 rounded-lg max-h-96 overflow-auto"
        >
          {#each messages
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
                  {message.message}
                </p>
                <p class="text-xs text-gray-400 text-right">
                  {timestamp(message.created_at)}
                </p>
              </div>
            </div>
          {/each}
          <a href="" bind:this={bottom} />
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
