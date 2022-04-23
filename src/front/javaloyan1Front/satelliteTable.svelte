<script>
    import {onMount} from 'svelte';
	import Button from 'sveltestrap';

	let sat = [];
	let newSat = {
		name: "",
		phone: "",
		email: ""
	};

	//let loading = true;
	onMount(getSat);

	async function getSat(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/stsatellites-stats");
		if(res.ok){
			const data =await res.json();
			contacts = data;
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
				getSat();
			});
	}

</script>
<main>
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
						Insert
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
			</tr>
			{/each}
		</tbody>
	</table>
	{/await}
</main>

<style>
   
</style>