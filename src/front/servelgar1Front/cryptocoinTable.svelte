<script>
    import {onMount} from 'svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import {Pagination, PaginationItem, PaginationLink} from "sveltestrap";
	


	let cc = [];

	let newCC = {
		country: "",
		year:"",
		ccelectr:"",
        ccdemand:"",
        ccmining:""
	};

	let errorMsg = "";
	let okMsg = "";
	let visible = false;
	let visibleOk = false;
	let p1;

	// Variables para la paginación
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;


	// VARIABLES DE BUSQUEDA

	let searchCountry = "";
	let searchYear = "";
	let searchFrom = "";
	let searchTo = "";


	onMount(getCrypto);

	// FUNCIONES DE PAGINACIÓN

	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function cambiapag(page, offset) {
      lastPage = Math.ceil(total/10);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getCrypto();
		getPagination();
      }
    }


	async function paginacion() {
      const data = await fetch("/api/v2/cryptocoin-stats");
      if (data.status == 200 || res.status == 201 ) {
        const json = await data.json();
        total = json.length;
        cambiapag(c_page, c_offset);
      } 
    }


	
	async function getCrypto(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/cryptocoin-stats");
		if(res.status == 200 || res.status == 201){
			const data =await res.json();
			cc = data;
			total = data.length;
			paginacion();
			p1 = cc[0];
			console.log("Received stats" + JSON.stringify(cc,null,2));
		}
		
	}

	async function getPagination() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/cryptocoin-stats" + "?limit=" + limit + "&offset=" + c_offset);
		
		   if(res.ok){
			console.log("getPagination Ok.");
			const data = await res.json();
			cc = data;
			console.log("Estadísticas recibidas: "+cc.length);
			paginacion();
			
		}else{
			window.alert(res.status);
		}
  	}


	  // INSERTAR ELEMENTO

	async function insertCryptocoin(){
		console.log("Inserting cryptocoin stat...." +JSON.stringify(newCC));
		const res = await fetch("/api/v2/cryptocoin-stats/",
			{
				method:"POST",
				body: JSON.stringify(newCC),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(res){
				
				if(res.status == 200 ||res.status == 201){
					getCrypto();
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


	// BORRAR ELEMENTO CONCRETO

	async function delCryptoUnico(countryDel, yearDel) {const res = 
			await fetch("/api/v2/cryptocoin-stats"+ "/" + countryDel + "/" + yearDel, {
            method: "DELETE"
        }).then(function (res) {
            getCrypto();
			getPagination();      
            if (res.status==200 || res.status == 201) {
                errorMsg = "Recurso "+countryDel +" " + yearDel+ " borrado correctamente";
                console.log("Deleted " + countryDel);
				visibleOk = true;
				visible = false;
				window.alert(errorMsg);  
				           
            } else if (res.status==404) {
                errorMsg = "No se ha encontrado el objeto " + countryDel;
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

		// BORRAR TODOS LOS ELEMENTOS

		async function delCrypto() {
    	console.log("Deleting all data");
		const res = await fetch("/api/v2/cryptocoin-stats",{
								method: "DELETE"	
							}).then( function (res) {
							if(res.ok){
								getCrypto();
								getPagination();
								okMsg = "Todos los datos se han eliminado";
								visibleOk=true;
								visible=false;
								window.alert(okMsg);
							}else{
								errorMsg = "No hay datos que borrar";
								visibleOk=false;
								visible=true;
								window.alert(errorMsg);
							}
							})
	}

	// LOAD INITIAL DATA

	async function loadCrypto(){
        console.log("Loading entries....");
        const msg = await fetch("/api/v2/cryptocoin-stats/loadInitialData").then(function(res){
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

		const elements = await fetch("/api/v2/cryptocoin-stats/loadInitialData")
			.then(function(elements){
				getCrypto();
				getPagination();
			}); //datos cargados
        const jsonElements = await elements.json();
        c_page = 1;
        totalObj = jsonElements.length;
        console.log("ELEMENTOS: "+ totalObj);
        const res = await fetch("/api/v2/cryptocoin-stats?limit=10&offset=1"); //datos mostrados
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            cc = json;
            console.log("Loading "+cc.length+" objects");
            console.log("Received " + cc.length + " cryptocoin stat.");
        } else {
            console.log("ERROR!");
        }
    }


	// BÚSQUEDA DE REPOSITORIO

	async function busqueda (searchCountry, searchYear, searchFrom, searchTo){
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

		const res = await fetch("/api/v2/cryptocoin-stats?country="+searchCountry+"&year="+searchYear+"&from="+searchFrom+"&to="+searchTo);
		

		if(res.status == 200 || res.status == 201){
			const data = await res.json();
			cc = data;
			
			if(!cc.length == 0){
				errorMsg = "Se ha encontrado "+ cc.length + " dato"
			} else {
				errorMsg = "No se ha encontrado el dato con país: "+ searchCountry
			}
		} else if (res.status == 404){
			errorMsg = "No se ha encontrado datos con los parámetros introducidos."
		}
		window.alert(errorMsg);
	}


</script>



<main>
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
		<Button outline color="primary" on:click="{busqueda (searchCountry, searchYear,searchFrom,searchTo)}">Buscar</Button>
	</div>


    {#await cc}
	loading	
	{:then cc} 
	<Table bordered>
		<thead>

			<tr>
				<td><Button outline color="success" on:click={loadCrypto}> Cargar datos</Button></td>
				<td><Button outline color="danger" on:click={delCrypto}>Borrar todo</Button></td>
			</tr>
			
		
			
			<tr>
				<th>País</th>
				<th>Año</th>
				<th>Consumo eléctrico</th>
				<th>Demanda eléctrica</th>
				<th>% de minería</th>
			</tr>
		</thead>
		<tbody>
<!--			{#each cc as cc}  -->
			<tr>
				<td><input bind:value="{newCC.country}"/></td>
				<td><input bind:value="{newCC.year}"  type="number"/></td>
				<td><input bind:value="{newCC.ccelectr}" type="number" /></td>
				<td><input bind:value="{newCC.ccdemand}" type ="number" /></td>
				<td><input bind:value="{newCC.ccmining}" type = "number" /></td>
				<td><Button 
					outline 
					color="primary"
					on:click={insertCryptocoin}>Añadir</Button></td>
			</tr>
			{#each cc as cc } 
			<tr>
				<td>{cc.country}</td>
				<td>{cc.year}</td>
				<td>{cc.ccelectr}</td>
				<td>{cc.ccdemand}</td>
				<td>{cc.ccmining}</td>
				<td><Button outline color="warning" on:click={function (){
					window.location.href = `/#/cryptocoin-stats/${cc.country}/${cc.year}`
				}}>Editar</Button>
				<td><Button outline color="danger" on:click={delCryptoUnico(cc.country,cc.year)}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			
		</tbody>
	</Table>
		<div>
			<Pagination ariaLabel="Web pagination">
				<PaginationItem class = {c_page === 1 ? "enable" : ""}>
					  <PaginationLink previous href="#/cryptocoin-stats" on:click={() => cambiapag(c_page - 1, c_offset - 10)}/>
				</PaginationItem>
				{#each range(lastPage, 1) as page}
					  <PaginationItem class = {c_page === page ? "active" : ""}>
						<PaginationLink previous href="#/cryptocoin-stats" on:click={() => cambiapag(page, (page - 1) * 10)}>
							{page}
						</PaginationLink>
					  </PaginationItem>
				{/each}
				<PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
					  <PaginationLink next href="#/cryptocoin-stats" on:click={() => cambiapag(c_page + 1, c_offset + 10)}/>
				</PaginationItem>
				</Pagination>
		</div>

		<a href="/#/info">
            <Button color="primary">Volver</Button>
          </a>
		  
	{/await}
</main>