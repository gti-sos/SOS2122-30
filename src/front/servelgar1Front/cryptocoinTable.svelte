<script>
    import {onMount} from 'svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";

	


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


	//let loading = true;
	onMount(getCrypto);
	async function getCrypto(){
		console.log("Fetching stats ... ");
		const res =  await fetch("/api/v2/cryptocoin-stats");
		if(res.ok){
			const data =await res.json();
			cc = data;
			p1 = cc[0];
			console.log("Received stats" + JSON.stringify(cc,null,2));
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
					okMsg = "Recurso añadido correctamente";
					visibleOk=true;
					visible=false;
					window.alert(okMsg);
				
				}else{
					if(res.status == 404){
						errorMsg ="El dato no ha sido encontrado";
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
            visible = true;
            getCrypto();      
            if (res.status==200) {
                errorMsg = "Recurso "+countryDel +" " + yearDel+ " borrado correctamente";
                console.log("Deleted " + countryDel);            
            } else if (res.status==404) {
                errorMsg = "No se ha encontrado el objeto " + countryDel;
                console.log("Resource NOT FOUND");            
            } else {
                errorMsg= res.status + ": " + "No se pudo borrar el recurso";
                console.log("ERROR!");
            }      
        });
   	 }

		async function delCrypto() {
    	console.log("Deleting all data");
		const res = await fetch("/api/v2/cryptocoin-stats",{
								method: "DELETE"	
							}).then( function (res) {
							if(res.ok){
								getRegistrations();
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
        const res = await fetch("/api/v2/cryptocoins-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getCrypto();
			});
    }
</script>



<main>
    {#await cc}
	loading	
	{:then cc} 
	<Table bordered>
		<thead>
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
				}}>
					Editar
				</Button>
				<td><Button outline color="danger" on:click={delCryptoUnico(cc.country,cc.year)}>
					Borrar
				</Button>
				</td>
			</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={loadCrypto}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={delCrypto}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
	{/await}
</main>