<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte"
	import cryptocoinTable from "./servelgar1Front/cryptocoinTable.svelte"
	import TdTable from "./jaiquisicFront/tdTable.svelte";


	console.log("Funcionas");
	const routes = {
		'/': Home,
		"/ccTable": cryptocoinTable,
		"/tdTable": TdTable
	};

</script>

<main>
	<Router {routes} />
</main>

<style>

</style>

<!--
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

-->