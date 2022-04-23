<script>
    import {onMount} from 'svelte';
	import Button from 'sveltestrap/src/Table.svelte';

	let contacts = [];
	let newContact = {
		name: "",
		phone: "",
		email: ""
	};

	//let loading = true;
	onMount(getContacts);

	async function getContacts(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/stsatellites-stats");
		if(res.ok){
			const data =await res.json();
			contacts = data;
			console.log("Received stats" + JSON.stringify(contacts,null,2));
		}
		
	}

	async function insertSat(){
		console.log("inserting contact: " + JSON.stringify(newContact));
		const res = await fetch("/api/v2/stsatellites-stats",
			{
				method: "POST",
				body: JSON.stringify(newContact),
				headers: {
					"Content-Type":"application/json"
				}
			}).then(function(res){
				getContacts();
			});
	}

</script>
<main>
    {#await contacts}
	loading	
	{:then contacts} 
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
				<td><input bind:value="{newContact.country}"></td>
				<td><input bind:value="{newContact.year}"></td>
				<td><input bind:value="{newContact.quarter}"></td>
				<td><input bind:value="{newContact.stlaunched}"></td>
				<td><input bind:value="{newContact.storbit}"></td>
				<td><input bind:value="{newContact.stdestroyed}"></td>
				<td><Button 
					color="primary"
					on:click="{insertSat}">
					Insert</Button>
				</td>
			</tr>
			{#each contacts as contact}
			<tr>
				<td>
					{contact.country}
				</td>
				<td>
					{contact.year}
				</td>
				<td>
					{contact.quarter}
				</td>
				<td>
					{contact.stlaunched}
				</td>
				<td>
					{contact.storbit}
				</td>
				<td>
					{contact.stdestroyed}
				</td>
			</tr>
			{/each}
		</tbody>
	</table>
	{/await}
</main>

<style>
    table{
		margin-left: auto;
		margin-right: auto;
	}
	td{
		padding: 1em;
	}
</style>