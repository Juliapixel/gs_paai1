<script lang="ts">
  import { onMount } from "svelte";

  let message = $state("");

  let history: { role: string; content: string }[] = $state([]);
  $inspect(history);

  async function enviarMensagem() {
    const tmp = message;
    message = "";
    const resp = await fetch(
      "/chat?" + new URLSearchParams({ message: tmp }).toString(),
    );
    const outcome = await resp.json();
    history = outcome.state;
  }

  async function resetar() {
    history = [];
    await fetch("/chat/clear");
  }

  onMount(async () => {
    await resetar();
  });
</script>

<div class="flex flex-col items-center py-12">
  <h1 class="py-4 text-2xl text-white">Assitente virtual para emergências</h1>
  <div class="w-[50rem] rounded-t-xl border-1 bg-white p-4">
    {#if history.length == 0}
      <p>Como posso te ajudar?</p>
    {/if}
    {#each history.filter((msg) => msg.role != "developer") as msg}
      <pre
        class="border-zinc-300 py-2 whitespace-pre-wrap not-last:border-b">{msg.content}</pre>
    {/each}
  </div>
  <div class="flex w-[50rem]">
    <input
      class="w-full rounded-bl-xl border-1 bg-white p-4"
      type="text"
      placeholder="Digite sua Mensagem"
      bind:value={message}
    />
    <button
      class="cursor-pointer border-1 bg-zinc-200 p-4"
      onclick={() => resetar()}>Resetar</button
    >
    <button
      class="cursor-pointer rounded-br-xl border-1 bg-zinc-200 p-4"
      onclick={() => enviarMensagem()}>Enviar</button
    >
  </div>
</div>
