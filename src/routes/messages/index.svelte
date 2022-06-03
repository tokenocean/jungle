<script>
  export let messages;
  import Fa from "svelte-fa";
  import { tick } from "svelte";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { session } from "$app/stores";
  import { createMessage, updateMessage } from "$queries/messages";
  import { query } from "$lib/api";

  let uniq = (a, k) => [...new Map(a.map((x) => [k(x), x])).values()];
  let users = uniq(
    messages.map(({ user: { username, avatar_url, id } }) => ({
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
</script>

<div class="flex justify-center items-center py-10">
  <div class="w-full md:w-1/2 lg:w-1/3 px-2">
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
              on:click={async () => {
                selectedUser = {
                  id: user.id,
                  username: user.username,
                  avatar: user.avatar_url,
                };
                await tick();
                getFocus();

                query(updateMessage, {
                  message: { viewed: true },
                  from: user.id,
                });
              }}
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
      {:else}
        <button
          class="text-[#30bfad]"
          on:click={() => (selectedUser = undefined)}
        >
          <div class="flex">
            <Fa icon={faChevronLeft} class="my-auto mr-1" />
            <div>Back</div>
          </div>
        </button>
        <div
          class="bg-[#31373e] space-y-4 w-full p-2 px-10 rounded-lg max-h-96 overflow-auto"
        >
          {#each messages.filter((message) => message.from === selectedUser.id || message.to === selectedUser.id) as message}
            <div>
              <p class="break-all max-w-md">
                {message.from === selectedUser.id
                  ? selectedUser.username
                  : $session.user.username}: {message.message}
              </p>
              <p class="text-xs text-gray-400">
                Sent: {timestamp(message.created_at)}
              </p>
            </div>
          {/each}
          <a href="" bind:this={bottom} />
        </div>
        <form on:submit|preventDefault={onSubmit}>
          <textarea
            bind:value={sendMessage}
            required
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
