<script lang="ts">
  import { marked } from "marked";
  import { onMount } from "svelte";

  let message = $state("");

  let history: { role: string; content: string }[] = $state([]);
  $inspect(history);

  async function enviarMensagem(e: SubmitEvent) {
    e.preventDefault();
    const tmp = message;
    history.push({ role: "user", content: message });
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

<div class="mx-auto flex w-[95%] flex-col items-center py-12 lg:w-[50rem]">
  <h1 class="ml-3 self-start py-4 text-2xl font-bold text-white">
    Assitente virtual para desastres naturais
  </h1>
  <div class="w-full rounded-t-xl border-1 bg-white p-4">
    {#if history.length == 0}
      <p class="text-zinc-600">Como posso te ajudar?</p>
    {/if}
    {#each history.filter((msg) => msg.role != "developer") as msg}
      <div class="border-zinc-300 py-2 not-last:border-b">
        {@html marked(msg.content)}
      </div>
    {/each}
  </div>
  <form onsubmit={enviarMensagem} class="flex w-full">
    <input
      class="w-full rounded-bl-xl border-1 bg-white p-4"
      type="text"
      placeholder="Digite sua Mensagem"
      bind:value={message}
    />
    <button
      class="cursor-pointer border-1 bg-zinc-200 p-4"
      onclick={() => resetar()}>Reiniciar</button
    >
    <button
      class="cursor-pointer rounded-br-xl border-1 bg-zinc-200 p-4"
      type="submit">Enviar</button
    >
  </form>
  <div class="mt-8 self-start text-zinc-300">
    <h1 class="text-lg">Créditos</h1>
    <ul>
      <li>Allan de Souza Cardoso - RM: 561721</li>
      <li>Júlia Borges Paschoalinoto - RM: 564725</li>
      <li>Lucas Werpp Franco - RM: 556044</li>
    </ul>
  </div>
</div>
