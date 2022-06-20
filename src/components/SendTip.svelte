<script>
  import { token, psbt, tipUser, prompt } from "$lib/store";
  import { broadcast, sign, pay } from "$lib/wallet";
  import { api } from "$lib/api";
  import { requirePassword } from "$lib/auth";
  import { info, err } from "$lib/utils";

  let amount = 1000;

  export async function submit() {
    $prompt = undefined;
    await requirePassword();

    try {
      await pay(undefined, $tipUser.address, amount);

      $psbt = await sign();
      await broadcast();

      let res = await api
        .auth(`Bearer ${$token}`)
        .url("/tip")
        .post({
          psbt: $psbt && $psbt.toBase64(),
          amount,
        })
        .json();

      amount = 1000;
      info("Tip sent!");
    } catch (e) {
      err(e);
    }
  }
</script>

<h1 class="mb-5 text-4xl">Tip {$tipUser.username}</h1>

<form on:submit|preventDefault={submit}>
  <label for="tip" class="form-label">Amount: <b>{amount} sats</b> </label>
  <input
    required
    type="range"
    class="form-range w-full"
    id="tip"
    min="1000"
    step="100"
    max="100000"
    on:input={(e) => (amount = e.target.value)}
  />
</form>
