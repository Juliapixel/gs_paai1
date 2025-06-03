<script lang="ts">
    let { data } = $props();

    let message = $state("");

    let history: {role: string, content: string}[] = $state([]);
    $inspect(history)

    async function enviarMensagem() {
        const tmp = message
        message = ""
        const resp = await fetch("/chat?" + new URLSearchParams({message: tmp}).toString());
        const outcome = await resp.json();
        history = outcome.state
    }
</script>

<div class="p-4 border-1 rounded-xl w-[50rem] bg-white">
    {#if history.length == 0}
        <p>Digite seu pedido</p>
    {/if}
    {#each history.filter((msg) => msg.role != "developer") as msg}
        <pre class="py-2 not-last:border-b border-zinc-200 whitespace-pre-wrap">{msg.content}</pre>
    {/each}
</div>
<div class="w-[50rem]">
    <input class="p-2 border-1 rounded-xl bg-white w-max" type="text" placeholder="Digite sua Mensagem" bind:value={message}/>
    <button class="p-2 border-1 rounded-xl bg-zinc-200 cursor-pointer" onclick={() => enviarMensagem()}>Enviar</button>
</div>
