<script>
    import {onMount} from 'svelte';
	import Button from "sveltestrap/src/Button.svelte";
	import { pop } from "svelte-spa-router";
	import {Pagination, PaginationItem, PaginationLink} from "sveltestrap";

	let sat = [];
	let initialSat = [];
	let newSat = {
		country: "",
		year: "",
		quarter: "",
		stlaunched: "",
		storbit: "",
		stdestroyed: ""
	};


	let errorM = "";
	let okM = "";
	let visible = false;
	let visibleOk = false;


	//Paginación
	//---------------------------------------------------------------------
	// Variables para la paginación
	let s_offset = 0;
    let offset = 0;
    let limit = 10;
    let s_page = 1;
    let lastPage = 1;
    let total = 0;
	
	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function cambiapag(page, offset) {
      lastPage = Math.ceil(total/10);
      console.log("Last page = " + lastPage);
      if (page !== s_page) {
        s_offset = offset;
        s_page = page;
        getSatellite();
		getPagination();
      }
    }


	async function pagination() {
      const data = await fetch("/api/v2/stsatellites-stats");
      if (data.status == 200 || res.status == 201 ) {
        const json = await data.json();
        total = json.length;
        cambiapag(s_page, s_offset);
      } 
    }


	//---------------------------------------------------------------------



	onMount(getSatellite);

	//Get inicial
	async function getSatellite(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/stsatellites-stats");
		if(res.ok){
			const data = await res.json();
			sat = data;
			pagination();
			initialSat = data;
			console.log("Received stats" + JSON.stringify(sat,null,2));
		}
		
	}

	async function getPagination() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/stsatellites-stats" + "?limit=" + limit + "&offset=" + s_offset);
		
		   if(res.ok){
			console.log("getPagination Ok.");
			const data = await res.json();
			sat = data;
			console.log("Estadísticas recibidas: "+sat.length);
			pagination();
		}else{
			window.alert(res.status);
		}
  	}


	//Put
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
				if(res.status == 200 ||res.status == 201){
					getSatellite();
					getPagination();
					okM = "Recurso añadido correctamente";
					visibleOk=true;
					visible=false;
					window.alert(okM);
				
				}else{
					if(res.status == 409){
						errorM ="Ya existe ese dato";
						visibleOk=false;
						visible=true;
						window.alert("Error" + errorM);
					}
					if(res.status == 409){
						errorM ="El dato ya existe";
						visibleOk=false;
						visible=true;
						window.alert("Error" + errorM);
					}
					window.alert("No se han introducido todos los datos");
				}
			}); 
	}


	//Eliminar 1 st
	async function deleteSat(countryS, yearS, quarterS){
		const res = await fetch("/api/v2/stsatellites-stats/" + countryS + "/" + yearS + "/" + quarterS, {
			method: "DELETE"
		}).then(function(res){
			getSatellite();
			getPagination();
			if (res.status==200 || res.status == 201) {
                okM = "Recurso "+countryS +"-" + yearS+ "-" +quarterS+ "se ha borrado correctamente";
                console.log("Deleted " + countryS);
				visibleOk = true;
				visible = false;
				window.alert(okM);    
            } else if (res.status==404) {
                errorM = "No se ha encontrado el objeto " + countryS + "-" + yearS + "-" + quarterS;
                console.log("Resource NOT FOUND");
				visibleOk = false;
				visible = true;
				window.alert(errorM);              
            } else {
                errorM= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
				visibleOk = false;
				visible = true; 
				window.alert(errorM); 
            }
		});
	}

	//Eliminar todos los st
	async function deleteSatAll(){
		const res = await fetch("/api/v2/stsatellites-stats", {
			method: "DELETE"
		}).then(function(res){
			if(res.ok){
				getSatellite();
				getPagination();
				okM = "Todos los datos se han eliminado";
				visibleOk=true;
				visible=false;
				window.alert(okM);
			}else{
				errorM = "No hay datos que borrar";
				visibleOk=false;
				visible=true;
				window.alert(errorM);
			}
		});
	}

	//Carga inicial
	async function ilSat(){
		console.log("inserting satellite: " + JSON.stringify(newSat));
		const res =  await fetch("/api/v2/stsatellites-stats/loadInitialData").then(function(res){
		visible = true;
			if(res.status == 200 || res.status == 201){
				console.log("200");
				okM = "Datos iniciales cargados correctamente";
				window.alert(okM);
			} else if (res.status == 400){
				errorM = "Ha ocurrido un fallo";
				window.alert(errorM);
			} else {
				errorM= res.status + "Fallo inesperado" + res.statusText;
				window.alert(errorM);
			}
		});
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
				<th>Country</th>
				<th>Year</th>
				<th>Quarter</th>
				<th>Stlaunched</th>
				<th>Storbit</th>
				<th>Stdestroyed</th>
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
			{#each sat as sat}
			<tr>
				<td>{sat.country}</td>
				<td>{sat.year}</td>
				<td>{sat.quarter}</td>
				<td>{sat.stlaunched}</td>
				<td>{sat.storbit}</td>
				<td>{sat.stdestroyed}</td>
				<td>
					<a href = "/#/stTable/{sat.country}/{sat.year}/{sat.quarter}">
						<Button 
							outline
							color="primary">
							Editar
						</Button> 
					</a>
				</td>
				<td>
					<Button 
						outline
						color="primary"
						on:click = {deleteSat(sat.country,sat.year,sat.quarter)}>
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
	<div>
		<Pagination ariaLabel="Web pagination">
			<PaginationItem class = {s_page === 1 ? "enable" : ""}>
				  <PaginationLink previous href="#/stTable" on:click={() => cambiapag(s_page - 1, s_offset - 10)}/>
			</PaginationItem>
			{#each range(lastPage, 1) as page}
				  <PaginationItem class = {s_page === page ? "active" : ""}>
					<PaginationLink previous href="#/stTable" on:click={() => cambiapag(page, (page - 1) * 10)}>
						{page}
					</PaginationLink>
				  </PaginationItem>
			{/each}
			<PaginationItem class = {s_page === lastPage ? "disabled" : ""}>
				  <PaginationLink next href="#/stTable" on:click={() => cambiapag(s_page + 1, s_offset + 10)}/>
			</PaginationItem>
			</Pagination>
	</div>
	{/await}
</main>

<style>
   
</style>