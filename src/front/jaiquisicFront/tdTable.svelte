<script>
    import {onMount} from 'svelte';
	let contacts = [];
	let p1;
	//let loading = true;
	onMount(getContacts);
	async function getContacts(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v1/technology_devices_stats");
		if(res.ok){
		const data =await res.json();
		contacts = data;
		p1 = contacts[0];
		console.log("Received stats" + JSON.stringify(contacts,null,2));
		}
		
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
					year
				</th>
				<th>
					tdwasted
				</th>
				<th>
					mpdisuse
				</th>
				<th>
					mpreused
				</th>
			</tr>
		</thead>
		<tbody>
			{#each contacts as contact}
			<tr>
				<td>
					{contact.country}
				</td>
				<td>
					{contact.year}
				</td>
				<td>
					{contact.tdwasted}
				</td>
				<td>
					{contact.mpdisuse}
				</td>
				<td>
					{contact.mpreused}
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