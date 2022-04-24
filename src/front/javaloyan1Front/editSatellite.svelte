<script>
    export let params = {};
	import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

</script>
<main>
    <h1>Editar información Satélite: {params.country}, {params.year}, {params.quarter}</h1>
    <Button outline color = "secondary" on:click = "{pop}">Back</Button>
</main>

<style>
   
</style>