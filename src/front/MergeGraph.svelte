<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
    import{Nav, NavItem, NavLink } from "sveltestrap";
    import Highcharts from "highcharts";

    const delay = ms => new Promise(res => setTimeout(res,ms));
    //CC STATS
    let cryptoCoinData = [];
    let cryptoCoinChartCountryYear = [];
    let cryptoCoinChartElectr = [];
    let cryptoCoinChartDemand = [];
    let cryptoCoinChartMining = []; 
    //TD STATS
    let ewasteStats=[];
    let ewasteChartCountryYear = [];
    let ewasteChartTdwasted = [];
    let ewasteChartMpdisused = [];
    let ewasteChartMpreused = [];

    //ST STATS
    let stStats = [];
    let st_country_year = [];
    let st_quarter = [];
    let st_launched = [];
    let st_storbit = [];
    let st_destroyed = [];


    let yearC = [];
    let yearS = [];
    let yearE = [];



    function ordenarAsc(array, key) {
         var arrayAux=[];
          for(var i=0; i < array.length-1;i++){
              for (let j = i+1; j < array.length; j++) {
                  if(array[i][key] > array[j][key]){
                      arrayAux = array[i];
                      array[i]=array[j];
                      array[j]=arrayAux;
                  }
              }
          }
          return array;
      }


      function redondeoADos(num) {
          return +(Math.round(num + "e+2")  + "e-2");
      }



      // Coger categoría por años.
      // Hacer la media de cada propiedad entre todos los paises que engloben cada año
      // Rellenar con 0s los que falten


    async function loadGraph(){

        const res = await fetch ("/api/v2/cryptocoin-stats");
        const res2 = await fetch("/api/v2/technology_devices_stats");
        const res3 = await fetch("/api/v2/stsatellites-stats");

        if(!res.ok && !res2.ok && res3.ok){
            console.log("ERROR");
        } else {

            var crypto = [];
            var ewaste = [];
            var st = [];

            crypto = await res.json();
            ewaste = await res2.json();
            st = await res3.json();

            ordenarAsc(crypto,'year');
            ordenarAsc(ewaste,'year');
            ordenarAsc(st,'year');



            crypto.forEach((d)=>{
                yearC.push(parseInt(d.year));
            });

            ewaste.forEach((d)=>{
                yearE.push(parseInt(d.year));
            });

            st.forEach((d)=>{
                yearS.push(parseInt(d.year));
            });

            var cat = yearC.concat(yearS);
            cat = cat.concat(yearE);

            // FILTRAMOS IGUALES
            cat = cat.filter(function(valor,indiceActual,arreglo){
                    let indiceAlBuscar = arreglo.indexOf(valor);
                    if (indiceActual == indiceAlBuscar){
                        return true;
                    } else {
                        return false;
                    }
                });
            
            cat = cat.sort();

            for (var i = 0; i < cat.length; i++){
                var x = crypto.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return redondeoADos(parseFloat(m.ccelectr));
                });
                x = x.reduce(function(sum,value){
                 return sum+value;
               },0) / x.length;

               var y = crypto.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return redondeoADos(parseFloat(m.ccdemand));
                });
                y = y.reduce(function(sum,value){
                 return sum+value;
               },0) / y.length;


               var z = crypto.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return redondeoADos(parseFloat(m.ccmining));
                });
                z = z.reduce(function(sum,value){
                 return sum+value;
               },0) / z.length;

               if(Number.isNaN(x)){
                cryptoCoinChartElectr.push(0);
                cryptoCoinChartDemand.push(0);
                cryptoCoinChartMining.push(0);
               } else {
                cryptoCoinChartElectr.push(x);
                cryptoCoinChartDemand.push(y);
                cryptoCoinChartMining.push(z);
               }

               
            }

            for (var i = 0 ; i < cat.length; i++){
                var x = ewaste.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return redondeoADos(parseFloat(m.tdwasted));
                });
                x = x.reduce(function(sum,value){
                 return sum+value;
               },0) / x.length;

               var y = ewaste.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return redondeoADos(parseFloat(m.mpdisuse));
                });
                y = y.reduce(function(sum,value){
                 return sum+value;
               },0) / y.length;


               var z = ewaste.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return parseInt(m.mpreused);
                });
                z = z.reduce(function(sum,value){
                 return sum+value;
               },0) / z.length;

               if (Number.isNaN(x)){
                ewasteChartTdwasted.push(0);
                ewasteChartMpdisused.push(0);
                ewasteChartMpreused.push(0);
               } else{
                ewasteChartTdwasted.push(x);
                ewasteChartMpdisused.push(y);
                ewasteChartMpreused.push(z);
               }
               
            }

            for (var i = 0 ; i < cat.length; i++){
                var x = st.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return parseInt(m.stlaunched);
                });
                x = x.reduce(function(sum,value){
                 return sum+value;
               },0) / x.length;

               var y = st.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return parseInt(m.storbit);
                });
                y = y.reduce(function(sum,value){
                 return sum+value;
               },0) / y.length;


               var z = st.filter((f)=>{
                        return f.year == cat[i];
                }).map((m)=>{
                    return parseInt(m.stdestroyed);
                });
                z = z.reduce(function(sum,value){
                 return sum+value;
               },0) / z.length;

               if(Number.isNaN(x)){
                st_launched.push(0);
               st_storbit.push(0);
               st_destroyed.push(0);
               } else {
                st_launched.push(x);
               st_storbit.push(y);
               st_destroyed.push(z);
               }

            }

            console.log("AÑOS: "+ cat);
            console.log("DEPURAR CRIPTO : "+ cryptoCoinChartDemand);
            console.log("DEPURAR ST: "+ st_launched);
            console.log("DEPURAR EWASTE: "+ ewasteChartTdwasted);
        }

        
        

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Public expenditure stats by country and year'
            },
            subtitle: {
                text: 'Source: https://sos2122-30.herokuapp.com/'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "Año",
                },
                categories: cat
                
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            
            series: [
                {
                name: 'Electric consumption (TWh)',
                data: cryptoCoinChartElectr
                },
                {
                name: 'Mining (%)',
                data: cryptoCoinChartMining
                },
                {
                name: 'Electric Demand (GW)',
                data: cryptoCoinChartDemand
                },
                //TD STATS
                {
                name: 'E-waste (Ton)',
                data: ewasteChartTdwasted
                },
                {
                name: 'Mobile phones in disuse amount',
                data: ewasteChartMpdisused
                },
                {
                name: 'Recycled and reused MP (%)',
                data: ewasteChartMpreused
                },
                // ST STATS
                {
                name: 'Satellites destroyed',
                data: st_destroyed
                },
                {
                name: 'Satellites launched',
                data: st_launched,
                },
                {
                name: 'Satellites on orbit',
                data: st_storbit
                }
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }
/*
    onMount(getcryptoCoinData);
    onMount(getEwasteStats);
    onMount(getSTStats);
    */
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script
    src="https://code.highcharts.com/modules/accessibility.js"
    on:load={loadGraph}></script>
</svelte:head>

<main>

    <Nav>
        <NavItem>
          <NavLink href="#/info">Main Page</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/cryptocoin-stats">Cryptocoin Data</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="#/satellites-stats">StarLink Satellites Data</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#/tdTable">E-waste Data</NavLink>
          </NavItem>
    </Nav>
<div>
    
</div>
    <div>
        <h2>
            Merged Analytics SOS2122-30
        </h2>
    </div>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>

    <Button outline color="secondary" href="/">Volver</Button>
</main>



  