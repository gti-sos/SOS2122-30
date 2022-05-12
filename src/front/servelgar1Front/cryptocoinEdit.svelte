
<script>
	import {onMount} from "svelte";
    import {pop} from "svelte-spa-router";
    import Alert from 'sveltestrap/src/Alert.svelte';
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    export let params = {};

    let cc = {};
	let upCountry = "";
	let upYear = "";
	let upElectr = "";
	let upDemand = "";
	let upMining = "";
    let errorMsg = "";
 	let okMsg = "";
	let visible = false;
	let visibleOk = false;


    onMount(getCrypto);


  async function getCrypto() {
        console.log("Fetching data..." + params.country + " " + params.year);
        const res = await fetch("/api/v2/cryptocoin-stats/" + params.country +"/" + params.year);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            cc = json;
            upCountry = cc.country;
            upYear = parseInt(cc.year);
            upElectr = parseFloat(cc.ccelectr);
            upDemand = parseFloat(cc.ccdemand);
            upMining = parseFloat(cc.ccmining);
            console.log(JSON.stringify(cc));
            console.log("Received data.");
        } else {
            if(res.status === 404){
                    errorMsg = `No existe dato con país: ${params.country} y año: ${params.year}`;
                    console.log("ERROR!" + errorMsg);
              visibleOk=false;
              visible=true;
		      	} else if (res.status === 500) {
        		    errorMsg = "No se han podido acceder a la base de datos";
      	  	} else {
                    errorMsg = "No se han introducido todos los datos.";
                }
			
      		console.log("ERROR!" + errorMsg);
        }
    }


    async function updateCC() {
        console.log("Updating data..." );
        const res = await fetch("/api/v2/cryptocoin-stats/" + params.country +"/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
              country : upCountry,
              year : parseInt(upYear),
			  ccelectr : parseFloat(upElectr),
              ccdemand : parseFloat(upDemand),
	 		  ccmining : parseFloat(upMining)
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
          visible = true;
          getCrypto();
            if(res.status == 200 || res.status == 201){
              okMsg = "Actualización correcta";
              visibleOk=true;
              }else{
                  if(res.status === 400){
                    errorMsg ="Rellene los campos.";
                    visibleOk=false;
                  }
                
                if(res.status === 404){
                  errorMsg ="El dato solicitado no existe";
                  visibleOk=false;
                  window.alert(errorMsg);
                }
              }
          });
    }



</script>

<main>
  <h1>Editar campos: <strong>{params.country}</strong>  <strong>{params.year}</strong></h1>
  {#await cc}
  loading
    {:then cc}
  <Table bordered>
      <thead>
          <div>
              <Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
                  {#if errorMsg}
                      <p>ERROR: {errorMsg}</p>
                     {/if}
              </Alert>
              <Alert color="success" isOpen={visibleOk} toggle={() => (visibleOk = false)}>
                  {#if okMsg}
                      <p>Correcto: {okMsg}</p>
                      {/if}
              </Alert>
          </div>
      
      
          <tr>
              <th>País</th>
              <th>Año</th>
              <th>Consumo electrico</th>
              <th>Demanda electrica</th>
              <th>Porcentaje de mining</th>
          </tr>
      </thead>
      
      <tbody>
      
          <tr>
              <td>{upCountry}</td>
              <td>{upYear }</td>
              <td><input type=float bind:value="{upElectr}"></td>
              <td><input type=float bind:value="{upDemand}"></td>
              <td><input type=float bind:value="{upMining}"></td>
              <td><Button on:click={updateCC}>Actualizar</Button></td>
              
          </tr>
      </tbody>
  </Table>
  
  
  <Button outline color="secondary" on:click="{pop}">Volver</Button>
  {/await}
  </main>