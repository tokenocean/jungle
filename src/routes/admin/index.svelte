<script>
  import { token } from "$lib/store";
  import { onMount, tick, onDestroy } from "svelte";
  import { ArtworkMedia } from "$comp";
  import { updateUser, deleteSamples } from "$queries/users";
  import { api, hasura, query } from "$lib/api";
  import { err, info } from "$lib/utils";
  import { requireLogin } from "$lib/auth";

  export let users;

  let headers = () => ({
    "authorization": `Bearer ${$token}`,
    "x-hasura-role": "approver",
  })

  let makeArtist = async (user) => {
    try {
      user.is_artist = true;
      await query(
        updateUser,
        { id: user.id, user: { is_artist: true, info: null } },
        headers()
      );

      await query(deleteSamples, { user_id: user.id }, headers());

      await api
        .url("/mail-artist-application-approved")
        .auth(`Bearer ${$token}`)
        .post({
          userId: user.id,
        });

      users = users.filter((u) => u.id !== user.id);
      info(`${user.username} is now an artist!`);
    } catch (error) {
      console.log(error);
      err(error);
    }
  };

  let denyArtist = async (user) => {
    try {
      await query(
        updateUser,
        { id: user.id, user: { info: null } },
        {
          "X-Hasura-Role": "approver",
        }
      ).catch(err);

      await query(
        deleteSamples,
        { user_id: user.id },
        {
          "X-Hasura-Role": "approver",
        }
      ).catch(err);

      await api
        .auth(`Bearer ${$token}`)
        .url("/mail-artist-application-denied")
        .post({
          userId: user.id,
        });

      users = users.filter((u) => u.id !== user.id);
      info(`${user.username} has been denied!`);
    } catch (error) {
      err(error);
    }
  };
</script>

<div class="container mx-auto mt-20">
  <h2 class="mb-10">Artist Applicants</h2>
  {#each users as user}
    <div class="flex w-full mb-8">
      <div class="flex-grow mb-auto mr-2 mt-2">
        <div class="mb-2">
          <h4><span class="font-bold">Username: </span>{user.username}</h4>
        </div>

        <div class="mb-2">
          <h4><span class="font-bold">Email: </span>{user.display_name}</h4>
        </div>

        <div class="mb-2">
          <h4><span class="font-bold">Info: </span>{user.info}</h4>
        </div>

        <h4><span class="font-bold">Artwork samples: </span></h4>
        <div class="text-center my-auto mr-2 flex">
          {#each user.samples as sample}
            <div class="w-40 mb-2 mr-2">
              <a href={`https://ipfs.io/ipfs/${sample.url}`}>
                <ArtworkMedia
                  artwork={{ filename: sample.url, filetype: sample.type }}
                />
              </a>
            </div>
          {/each}
        </div>
      </div>

      <div class="text-center">
        <button class="primary-btn mt-4" on:click={() => makeArtist(user)}
          >Approve</button
        >
        <button class="primary-btn mt-4" on:click={() => denyArtist(user)}
          >Deny</button
        >
      </div>
    </div>
    <hr />
  {/each}
</div>