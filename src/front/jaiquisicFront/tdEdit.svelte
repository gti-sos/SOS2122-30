<script>
    export let params = {};

    import {onMount} from 'svelte';
	import  Button  from "sveltestrap/src/Button.svelte";
    import  Table  from "sveltestrap/src/Table.svelte";
    import { pop } from "svelte-spa-router";

    

    let ewaste = {};
    let updatedCountry = "";
    let updatedYear= "";
    let updatedTdwasted = "";
    let updatedMpdisuse = "";
    let updatedMpreused = "";
    let okMsg = "";
	let visible = false;
	let visibleOk = false;

    onMount(getEwaste);

    async function getEwaste(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/technology_devices_stats/" + params.country + "/" + params.year);
		if(res.ok){
		const data =await res.json();
		ewaste = data;

        updatedCountry = ewaste.country;
        updatedYear = ewaste.year;
        updatedTdwasted = ewaste.tdwasted;
        updatedMpdisuse = ewaste.mpdisuse;
        updatedMpreused = ewaste.mpreused;

		console.log("Received stats" + JSON.stringify(ewaste,null,2));
		}
		
	}
    async function editEwaste(){
        console.log("Updating data..." );
        const res = await fetch("/api/v2/technology_devices_stats/" + params.country +"/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
              country : updatedCountry,
              year : parseInt(updatedYear),
			  tdwasted : parseInt(updatedTdwasted),
              mpdisuse : parseInt(updatedMpdisuse),
	 		  mpreused : parseInt(updatedMpreused)
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
          visible = true;
          getEwaste();
            if(res.status == 200 || res.status == 201){
                okMsg = "Correct update";
              visibleOk=true;
              }else{
                if(res.status === 404){
                  errorMsg ="DATA NOT FOUND";
                  visibleOk=false;
                  window.alert(errorMsg);
                }
              }
          });
    }
</script>

<main>
    <h1>Editar información de E-waste: <strong>{params.country}</strong>  <strong>{params.year}</strong></h1>   
        {#await ewaste}
        Cargando	
        {:then ewaste} 
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
                    <th>Año</th>
                    <th>E-waste (Ton)</th>
                    <th>Teléfonos móviles en desuso (en millones)</th>
                    <th>% Teléfonos móviles reciclados/reutilizados</th>
                </tr>
            </thead>
            <tbody>
                <tr> 
                    <td><input bind:value="{updatedCountry}"></td>
                    <td><input bind:value="{updatedYear}"></td>
                    <td><input bind:value="{updatedTdwasted}"></td>
                    <td><input bind:value="{updatedMpdisuse}"></td>
                    <td><input bind:value="{updatedMpreused}"></td>
                    <td><Button outline color="primary" on:click="{editEwaste}">Editar</Button></td>
                
                </tr>
            </tbody>
        </Table>

        <Button outline color = "secondary" on:click = "{pop}">Volver</Button>
    {/await}
</main>
