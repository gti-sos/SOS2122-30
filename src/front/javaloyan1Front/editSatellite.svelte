

<script>
    export let params = {};
	import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    let sat = {};

    let updateC = {};
    let updateY = {};
    let updateQ = {};
    let updateSL = {};
    let updateSO = {};
    let updateSD = {};

    async function getSatellite(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/stsatellites-stats/" + params.country +"/"
            + params.year + "/"+params.quarter);
		if(res.ok){
			const data = await res.json();
			sat = data;
			updateC = sat.country;
            updateY = sat.year;
            updateQ = sat.quarter;
            updateSL = sat.stlaunched;
            updateSO = sat.storbit;
            updateSD = sat.stdestroyed;
			console.log("Received stats" + JSON.stringify(sat,null,2));
		}
		
	}

</script>
<main>
    <h1>Editar información Satélite: {params.country}, {params.year}, {params.quarter}</h1>
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
            <td><input bind:value="{sat.country}"></td>
            <td><input bind:value="{sat.year}"></td>
            <td><input bind:value="{sat.quarter}"></td>
            <td><input bind:value="{sat.stlaunched}"></td>
            <td><input bind:value="{sat.storbit}"></td>
            <td><input bind:value="{sat.stdestroyed}"></td>
            <td><Button 
                    outline
                    color="primary"
                    on:click="{insertSat}">
                    Insertar
                </Button>
            </td>
        </tr>
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
        </tr>
    </tbody>
    </table>
    {/await}
    
    <Button outline color = "secondary" on:click = "{pop}">Back</Button>
</main>

<style>
   
</style>

