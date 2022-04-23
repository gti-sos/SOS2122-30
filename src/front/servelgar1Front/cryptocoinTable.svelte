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
	let totaldata=12;

	// Variables para la paginación
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;




	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function cambiapag(page, offset) {
      
      lastPage = Math.ceil(total/10);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getReg();
		getOlimpic1();
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

	//let loading = true;
	onMount(getCrypto);
	async function getCrypto(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/cryptocoin-stats");
		if(res.status == 200 || res.status == 201){
			const data =await res.json();
			cc = data;
			p1 = cc[0];
			console.log("Received stats" + JSON.stringify(cc,null,2));
		}
		
	}

	async function getOlimpic1() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/cryptocoin-stats" + "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.status == 200 || res.status == 201){
			console.log("Ok.");
			const json = await res.json();
			cc = json;
			console.log(`We have ${cc.length} olimpic.`);
			for(let i=0; i<cc.length ; i++){
				let c = [];
				let y = cc[i].year;
				if(y > yFrom && y<yTo){
					c.push(y);
					cc = c;
				}
			}
			paginacion();
		}else{
			console.log("Error");
			
		}
  	}

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
					getOlimpic1();
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
					if(res.status == 409){
						errorMsg ="El dato solicitado ya existe";
						visibleOk=false;
						visible=true;
						window.alert("ERROR!" + errorMsg);
					}
					window.alert("???");
				}
			}); 
	}

	async function delCryptoUnico(countryDel, yearDel) {const res = 
			await fetch("/api/v2/cryptocoin-stats"+ "/" + countryDel + "/" + yearDel, {
            method: "DELETE"
        }).then(function (res) {
            getCrypto();
			getOlimpic1();      
            if (res.status==200 || res.status == 201) {
                errorMsg = "Recurso "+countryDel +" " + yearDel+ " borrado correctamente";
                console.log("Deleted " + countryDel);
				visibleOk = true;
				visible = false;  
				           
            } else if (res.status==404) {
                errorMsg = "No se ha encontrado el objeto " + countryDel;
                console.log("Resource NOT FOUND");
				visibleOk = false;
				visible = true;              
            } else {
                errorMsg= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
				visibleOk = false;
				visible = true;  
            }
			     
        });
   	 }

		async function delCrypto() {
    	console.log("Deleting all data");
		const res = await fetch("/api/v2/cryptocoin-stats",{
								method: "DELETE"	
							}).then( function (res) {
							if(res.ok){
								getCrypto();
								getOlimpic1();
								okMsg = "Todos los datos se han eliminado";
								visibleOk=true;
								visible=false;
							}else{
								errorMsg = "No hay datos que borrar";
								visibleOk=false;
								visible=true;
							}
							})
	}


	async function loadCrypto(){
        console.log("Loading entries....");
        const msg = await fetch("/api/v2/cryptocoin-stats/loadInitialData").then(function(res){
			visible = true;
			if(res.status == 200 || res.status == 201){
				console.log("200");
				errorMsg = "Objetos cargados correctamente";
			} else if (res.status == 400){
				errorMsg = "Ha ocurrido un fallo";
				console.log("BAD REQUEST");
			} else {
				errorMSG= res.status + ": " + res.statusText;
                console.log("ERROR!");
			}
		});

		const elements = await fetch("/api/v2/cryptocoin-stats/loadInitialData"); //datos cargados
        const jsonElements = await elements.json();
        c_page = 1;
        totalObj = jsonElements.length;
        console.log("ELEMENTOS: "+ totalObj);
        const res = await fetch("/api/v2/cryptocoin-stats?limit=10&offset=1"); //datos mostrados
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            cc = json;
			getCrypto();
            console.log("Loading "+poverty.length+" objects");
            console.log("Received " + poverty.length + " cryptocoin stat.");
        } else {
            console.log("ERROR!");
        }

    }
</script>



<main>
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
				<th>Country</th>
				<th>year</th>
				<th>ccelectr</th>
				<th>ccdemand</th>
				<th>ccmining</th>
			</tr>
		</thead>
		<tbody>
<!--			{#each cc as cc}  -->
			<tr>
				<td><input bind:value={newCC.country} type="text"/></td>
				<td><input bind:value={newCC.year} type="text" /></td>
				<td><input bind:value={newCC.ccelectr} type="text" /></td>
				<td><input bind:value={newCC.ccdemand} type="text" /></td>
				<td><input bind:value={newCC.ccmining} type="text" /></td>
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
					window.location.href = `/#/ccTable/${cc.country}/${cc.year}`
				}}>Editar</Button>
				<td><Button outline color="danger" on:click={delCryptoUnico(cc.country,cc.year)}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			
		</tbody>
		<div>
			<Pagination ariaLabel="Web pagination">
				<PaginationItem class = {c_page === 1 ? "enable" : ""}>
					  <PaginationLink previous href="#/ccTable" on:click={() => cambiapag(c_page - 1, c_offset - 10)}/>
				</PaginationItem>
				{#each range(lastPage, 1) as page}
					  <PaginationItem class = {c_page === page ? "active" : ""}>
						<PaginationLink previous href="#/ccTable" on:click={() => cambiapag(page, (page - 1) * 10)}>
							{page}
						</PaginationLink>
					  </PaginationItem>
				{/each}
				<PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
					  <PaginationLink next href="#/ccTable" on:click={() => cambiapag(c_page + 1, c_offset + 10)}/>
				</PaginationItem>
			  </Pagination>
		</div>
	</Table>
	{/await}
</main>