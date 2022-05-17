<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';
    import{Nav, NavItem, NavLink } from "sveltestrap";
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


    async function getcryptoCoinData(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/cryptocoin-stats");
        if(res.ok){
            const data = await res.json();
            cryptoCoinData = data;
            console.log("Estadísticas recibidas: "+cryptoCoinData.length);
            //inicializamos los arrays para mostrar los datos
            cryptoCoinData.forEach(stat => {
                cryptoCoinChartCountryYear.push(stat.country+"-"+stat.year);
                cryptoCoinChartElectr.push(parseFloat(stat.ccelectr));
                cryptoCoinChartMining.push(parseFloat(stat.ccmining));
                cryptoCoinChartDemand.push(parseFloat(stat.ccdemand));            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
		}
    }
    async function getEwasteStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/technology_devices_stats");
        if(res.ok){
            const data = await res.json();
            ewasteStats = data;
            console.log("Estadísticas recibidas: "+ ewasteStats.length);
            //inicializamos los arrays para mostrar los datos
            ewasteStats.forEach(stat => {
                ewasteChartCountryYear.push(stat.country + "-" + stat.year);
                ewasteChartTdwasted.push(parseFloat(stat.tdwasted));
                ewasteChartMpdisused.push(parseFloat(stat.mpdisuse));
                ewasteChartMpreused.push(parseFloat(stat.mpreused));            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
        }
    }

    async function getSTStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/stsatellites-stats");
        if(res.ok){
            const data = await res.json();
            stStats = data;
            console.log("Estadísticas recibidas: "+stStats.length);
            //inicializamos los arrays para mostrar los datos
            stStats.forEach(stat => {
                st_country_year.push(stat.country+"-"+stat.year);
                st_launched.push(parseFloat(stat.stlaunched));
                st_storbit.push(parseFloat(stat.storbit));
                st_destroyed.push(parseFloat(stat.stdestroyed));            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
        }
    }

    async function loadGraph(){
        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Public expenditure stats by country and year'
            },
            subtitle: {
                text: 'Source: https://datosmacro.expansion.com'
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            xAxis: {
                title: {
                    text: "Country-Year",
                },
                // Listado del eje X de Sergio
                categories: cryptoCoinChartCountryYear
                
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
                name: '...',
                data: st_destroyed
                },
                {
                name: '...',
                data: st_launched,
                },
                {
                name: '...',
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
    onMount(getcryptoCoinData);
    onMount(getEwasteStats);
    onMount(getSTStats);
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>    
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
            <NavLink href="#/stTable">StarLink Satellites Data</NavLink>
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



  