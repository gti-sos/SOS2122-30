<script>
    import {onMount} from 'svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import { pop } from "svelte-spa-router";
	import {Pagination, PaginationItem, PaginationLink} from "sveltestrap";
	
	
	let ewaste = [];
	let newEwaste = {
		country: "",
		year: "",
        tdwasted: "",
        mpdisuse: "",
        mpreused: ""
	};

	let errorMsg = "";
	let okMsg = "";
	let visible = false;
	let visibleOk = false;
	let p1;

	// Variables para la paginación
	let e_offset = 0;
    let offset = 0;
    let limit = 10;
    let e_page = 1;
    let lastPage = 1;
    let total = 0;

	// VARIABLES DE BUSQUEDA

	let searchCountry = "";
	let searchYear = "";
	let searchFrom = "";
	let searchTo = "";

	onMount(getEwaste);

	
	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function cambiapag(page, offset) {
      lastPage = Math.ceil(total/10);
      console.log("Last page = " + lastPage);
      if (page !== e_page) {
        e_offset = offset;
        e_page = page;
        getEwaste();
		getPagination();
      }
    }


	async function paginacion() {
      const data = await fetch("/api/v2/technology_devices_stats");
      if (data.status == 200 || res.status == 201 ) {
        const json = await data.json();
        total = json.length;
        cambiapag(e_page, e_offset);
      } 
    }

	async function getEwaste(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/technology_devices_stats");
		if(res.ok){
		const data =await res.json();
		ewaste = data;
		total = data.length;
		paginacion();
		p1 = ewaste[0];
		console.log("Received stats" + JSON.stringify(ewaste,null,2));
		}
		
	}
	async function getPagination() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/technology_devices_stats" + "?limit=" + limit + "&offset=" + e_offset);
		
		   if(res.ok){
			console.log("getPagination Ok.");
			const data = await res.json();
			ewaste = data;
			console.log("Estadísticas recibidas: "+ ewaste.length);
			paginacion();
		}else{
			window.alert(res.status);
		}
  	}


	async function insertEwaste(){
		console.log("Insert new e-waste stat: " + JSON.stringify(newEwaste));
		const res =  await fetch("/api/v2/technology_devices_stats",
		{
			method:"POST",
			body: JSON.stringify(newEwaste),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res){
			if(res.status == 200 ||res.status == 201){
					getEwaste();
					getPagination();
					okMsg = "Recurso añadido correctamente";
					visibleOk=true;
					visible=false;
					window.alert(okMsg);
				
				}else{
					if(res.status == 409){
						errorMsg ="Ya existe ese dato";
						visibleOk=false;
						visible=true;
						window.alert("ERROR!" + errorMsg);
					}
					window.alert("No se han introducido todos los datos");
		}
	});
}
	async function deleteTD(country, year){
		const res = await fetch("/api/v2/technology_devices_stats/" + country + "/" + year, {
			method: "DELETE"
		}).then(function(res){
			getEwaste();
			getPagination();
			if (res.status==200 || res.status == 201) {
                errorMsg = "Recurso "+ country +" " + year+ " se ha borrado correctamente";
                console.log("Deleted " + country);
				visibleOk = true;
				visible = false;
				window.alert(errorMsg);    
            } else if (res.status==404) {
                errorMsg = "No se ha encontrado el objeto " + country + " " + year ;
                console.log("Resource NOT FOUND");
				visibleOk = false;
				visible = true;
				window.alert(errorMsg);              
            } else {
                errorMsg= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
				visibleOk = false;
				visible = true; 
				window.alert(errorMsg); 
            }
		});
	}

	async function deleteAll(){
		const res = await fetch("/api/v2/technology_devices_stats", {
			method: "DELETE"
		}).then(function(res){
			getEwaste();
			getPagination();
		});
		window.alert("Tabla borrada correctamente");
	}


	async function initialEwaste(){
		console.log("Loading entries....");
        const msg = await fetch("/api/v2/technology_devices_stats/loadInitialData").then(function(res){
			visible = true;
			if(res.status == 200 || res.status == 201){
				console.log("200");
				errorMsg = "Objetos cargados correctamente";
				window.alert(errorMsg);
			} else if (res.status == 400){
				errorMsg = "Ha ocurrido un fallo";
				console.log("BAD REQUEST");
				window.alert(errorMsg);
			} else {
				errorMsg= res.status + ": " + res.statusText;
                console.log("ERROR!");
				window.alert(errorMsg);
			}
		});

		const elements = await fetch("/api/v2/technology_devices_stats/loadInitialData")
			.then(function(elements){
				getEwaste();
				getPagination();
			}); //datos cargados
        const jsonElements = await elements.json();
        e_page = 1;
        totalObj = jsonElements.length;
        console.log("ELEMENTOS: "+ totalObj);
        const res = await fetch("/api/v2/technology_devices_stats?limit=10&offset=1");
        if (res.ok) {
            console.log("Ok: ");
            const json = await res.json();
            ewaste = json;
            console.log("Loading "+ ewaste.length+" objects");
            console.log("Received " + ewaste.length + " e-waste stats");
        } else {
            console.log("ERROR!");
        }
    }

	
	// BÚSQUEDA DE REPOSITORIO

	async function busqueda (searchCountry,searchYear, searchFrom, searchTo){
		if (typeof searchCountry=='undefined'){
			searchCountry = "";
		}
		if (typeof searchYear == 'undefined'){
			searchYear = "";
		}
		if (typeof searchFrom == 'undefined'){
			searchFrom = "";
		}
		if (typeof searchTo == 'undefined'){
			searchTo = "";
		}

		const res = await fetch("/api/v2/technology_devices_stats?country="+searchCountry+"&year="+searchYear+"&from="+searchFrom+"&to="+searchTo);

		if(res.status == 200 || res.status == 201){
			const data = await res.json();
			ewaste = data;
			if(ewaste.length == 1){
				errorMsg = "Se ha encontrado "+ ewaste.length + " dato";
			} else {
				errorMsg = "No se ha encontrado ningún dato para los parametros introducidos";
			}
		} else if (res.status == 404){
			errorMsg = "No se ha encontrado datos con los parámetros introducidos.";
		}
		window.alert(errorMsg);
	}
	

</script>

<main>
	<h1>Estadísticas E-waste</h1>

	<p><strong>Filtrado de datos</strong></p>
	<Table borderless responsive>
		<tr>
			<td><strong><label>Pais: <input id="filterpais"  bind:value="{searchCountry}"></label></strong></td>
			<td><strong><label>Año: <input  id="campoaño" bind:value="{searchYear}"></label></strong></td>
		</tr>
		<tr>
			<td><strong><label>Año(Desde): <input bind:value="{searchFrom}"></label></strong></td>
			<td><strong><label>Año(Hasta): <input bind:value="{searchTo}"></label></strong></td>
		</tr>
	</Table>
	<div style="text-align:center;padding-bottom: 1%">
		<Button outline color="primary" on:click="{busqueda (searchCountry,searchYear, searchFrom, searchTo)}">Buscar</Button>
	</div>

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
				<td><input bind:value="{newEwaste.country}"></td>
				<td><input bind:value="{newEwaste.year}"></td>
				<td><input bind:value="{newEwaste.tdwasted}"></td>
				<td><input bind:value="{newEwaste.mpdisuse}"></td>
				<td><input bind:value="{newEwaste.mpreused}"></td>
				<td><Button outline color="primary" on:click="{insertEwaste}">Añadir</Button></td>
				
			</tr>
			{#each ewaste as ewaste}
			<tr>
				<td>{ewaste.country}</td>
				<td>{ewaste.year}</td>
				<td>{ewaste.tdwasted}</td>
				<td>{ewaste.mpdisuse}</td>
				<td>{ewaste.mpreused}</td>
				<td><Button outline color="warning" on:click={function (){
					window.location.href = `/#/tdTable/${ewaste.country}/${ewaste.year}`
				}}>Editar</Button> 
					
				</td>
				<td>
					<Button outline color="primary" on:click = {deleteTD(ewaste.country,ewaste.year)}>Borrar</Button>
				</td>
			</tr>
			{/each}
			<Button outline color = "primary" on:click = "{initialEwaste}">Cargar Datos</Button>
			<Button outline color = "primary" on:click = "{deleteAll}">Borrar datos</Button>
			<br>
			<Button outline color = "secondary" on:click = "{pop}">Volver</Button>
		</tbody>

		<div>
			
		</div>
	</Table>
	<div>
		<Pagination ariaLabel="Web pagination">
			<PaginationItem class = {e_page === 1 ? "enable" : ""}>
				  <PaginationLink previous href="#/tdTable" on:click={() => cambiapag(e_page - 1, e_offset - 10)}/>
			</PaginationItem>
			{#each range(lastPage, 1) as page}
				  <PaginationItem class = {e_page === page ? "active" : ""}>
					<PaginationLink previous href="#/tdTable" on:click={() => cambiapag(page, (page - 1) * 10)}>
						{page}
					</PaginationLink>
				  </PaginationItem>
			{/each}
			<PaginationItem class = {e_page === lastPage ? "disabled" : ""}>
				  <PaginationLink next href="#/tdTable" on:click={() => cambiapag(e_page + 1, e_offset + 10)}/>
			</PaginationItem>
			</Pagination>
	</div>
	{/await}
</main>
