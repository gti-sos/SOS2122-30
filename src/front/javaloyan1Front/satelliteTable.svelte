<script>
    import {onMount} from 'svelte';
	import Button from "sveltestrap/src/Button.svelte";
	import { pop } from "svelte-spa-router";

	let sat = [];
	let initialSat = [];
	let newSat = {
		name: "",
		phone: "",
		email: ""
	};

	//let loading = true;
	onMount(getSatellite);

	async function getSatellite(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/stsatellites-stats");
		if(res.ok){
			const data = await res.json();
			sat = data;
			initialSat = data;
			console.log("Received stats" + JSON.stringify(sat,null,2));
		}
		
	}

	async function insertSat(){
		console.log("inserting satellite: " + JSON.stringify(newSat));
		const res = await fetch("/api/v2/stsatellites-stats",
			{
				method: "POST",
				body: JSON.stringify(newSat),
				headers: {
					"Content-Type":"application/json"
				}
			}).then(function(res){
				getSatellite();
			});
	}

	async function editSat(){
		console.log("inserting satellite: " + JSON.stringify(newSat));
		const res = await fetch("/api/v2/stsatellites-stats",
			{
				method: "PUT",
				body: JSON.stringify(newSat),
				headers: {
					"Content-Type":"application/json"
				}
			}).then(function(res){
				getSatellite();
			});
	}

	async function deleteSat(c, y, q){
		const res = await fetch("/api/v2/stsatellites-stats" + "/" + c + "/" + y + "/" + q, {
			method: "DELETE"
		}).then(function(res){
			getSatellite();
		});
	}

	async function deleteSatAll(){
		const res = await fetch("/api/v2/stsatellites-stats", {
			method: "DELETE"
		}).then(function(res){
			getSatellite();
		});
	}

	async function ilSat(){
		console.log("inserting satellite: " + JSON.stringify(newSat));
		const res =  await fetch("/api/v2/stsatellites-stats");
		if(res.ok){
			sat = initialSat;
			console.log("Received stats" + JSON.stringify(sat,null,2));
		}
	}

</script>
<main>
	<h1>Satellite stats</h1>
    {#await sat}
	loading	
	{:then sat} 
	<table>
		<thead>
			<tr>
				<th>
					Country
				</th>
				<th>
					Year
				</th>
				<th>
					Quarter
				</th>
				<th>
					Stlaunched
				</th>
				<th>
					Storbit
				</th>
				<th>
					Stdestroyed
				</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newSat.country}"></td>
				<td><input bind:value="{newSat.year}"></td>
				<td><input bind:value="{newSat.quarter}"></td>
				<td><input bind:value="{newSat.stlaunched}"></td>
				<td><input bind:value="{newSat.storbit}"></td>
				<td><input bind:value="{newSat.stdestroyed}"></td>
				<td><Button 
						outline
						color="primary"
						on:click="{insertSat}">
						Insertar
					</Button>
				</td>
			</tr>
			{#each sat as satellite}
			<tr>
				<td>
					{satellite.country}
				</td>
				<td>
					{satellite.year}
				</td>
				<td>
					{satellite.quarter}
				</td>
				<td>
					{satellite.stlaunched}
				</td>
				<td>
					{satellite.storbit}
				</td>
				<td>
					{satellite.stdestroyed}
				</td>
				<td>
					<a href = "/#/stTable/{satellite.country}/{satellite.year}/{satellite.quarter}">
						<Button 
							outline
							color="primary">
							Editar
						</Button> 
					</a>
				</td>
				<td><Button 
						outline
						color="primary">
						on:click = "{deleteSat}">
						Borrar
					</Button>
				</td>
			</tr>
			{/each}
			<Button outline color = "primary" on:click = "{ilSat}">Cargar Datos</Button>
			<Button outline color = "primary" on:click = "{deleteSatAll}">Borrar Datos</Button>
			<br>
			<Button outline color = "secondary" on:click = "{pop}">Volver</Button>
		</tbody>
	</table>
	{/await}
</main>

<style>
   
</style>