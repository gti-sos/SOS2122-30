<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte"
	import cryptocoinTable from "./servelgar1Front/cryptocoinTable.svelte"
<<<<<<< HEAD
	import TdTable from "./jaiquisicFront/tdTable.svelte";

=======
	import satelliteTable from "./javaloyan1Front/satelliteTable.svelte"
>>>>>>> f84d0fc918d1cdde52bf8a3b7c50440896568096

	console.log("Funcionas");
	const routes = {
		'/': Home,
		"/ccTable": cryptocoinTable,
<<<<<<< HEAD
		"/tdTable": TdTable
=======
		"/stTable": satelliteTable
>>>>>>> f84d0fc918d1cdde52bf8a3b7c50440896568096
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