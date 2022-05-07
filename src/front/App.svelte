<script>
	import Router from "svelte-spa-router"
	import Home from "./Home.svelte"
	import cryptocoinTable from "./servelgar1Front/cryptocoinTable.svelte"
	import cryptocoinEdit from "./servelgar1Front/cryptocoinEdit.svelte"
	import TdTable from "./jaiquisicFront/tdTable.svelte"
	import TdEdit from "./jaiquisicFront/tdEdit.svelte"
	import satelliteTable from "./javaloyan1Front/satelliteTable.svelte"
	import EditSatellite from "./javaloyan1Front/editSatellite.svelte";
	import cryptoHighChart from "./servelgar1Front/cryptoHighChart.svelte"
	import cryptoChart from "./servelgar1Front/cryptoChart.svelte";
	import MergeGraph from "./MergeGraph.svelte";

	console.log("Funcionas");
	const routes = {
		'/': Home,
		'/info': Home,

		"/tdTable": TdTable,
		"/tdTable/:country/:year": TdEdit,


		"/ccTable": cryptocoinTable,
		"/ccTable/:country/:year": cryptocoinEdit,
		"/ccTable/cryptoHighChart": cryptoHighChart,
		"/ccTable/cryptoChart" : cryptoChart,


		"/stTable": satelliteTable,
		"/stTable/:country/:year/:quarter": EditSatellite,

		"/Analytics": MergeGraph
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