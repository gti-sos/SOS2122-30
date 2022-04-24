<script>
    export let params = {};
	import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    let sat = {};

    let updateC = "";
    let updateY = "";
    let updateQ = "";
    let updateSL = "";
    let updateSO = "";
    let updateSD = "";

    onMount(getSatellite);


    async function getSatellite(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/stsatellites-stats/" + params.country +"/"
            + params.year + "/"+params.quarter);
		if(res.ok){
			const data = await res.json();
			sat = data;
			updateC = sat.country;
            updateY = parseInt(sat.year);
            updateQ = sat.quarter;
            updateSL = parseInt(sat.stlaunched);
            updateSO = parseInt(sat.storbit);
            updateSD = parseInt(sat.stdestroyed);
			console.log("Received stats" + JSON.stringify(sat,null,2));
		}
		
	}
    
    async function updateSat(){
        const res = await fetch("/api/v2/stsatellites-stats/" + params.country +"/"
            + params.year + "/"+params.quarter, {
                method: "PUT",
                body: JSON.stringify({
                    country: updateC,
                    year: parseInt(updateY),
                    quarter: updateQ,
                    stlaunched: parseInt(updateSL),
                    storbit: parseInt(updateSO),
                    stdestroyed: parseInt(updateSD)
                    }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (res) {
                visible = true;
                getSatellite();
            });
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
            <td>{updateC}</td>
            <td>{updateY}</td>
            <td>{updateQ}</td>
            <td><input bind:value="{updateSL}"></td>
            <td><input bind:value="{updateSO}"></td>
            <td><input bind:value="{updateSD}"></td>
            <td><Button 
                    outline
                    color="primary"
                    on:click="{updateSat}">
                    Insertar
                </Button>
            </td>
        </tr>
    </tbody>
    </table>
    {/await}
    
    <Button outline color = "secondary" on:click = "{pop}">Volver</Button>
</main>

<style>
   
</style>