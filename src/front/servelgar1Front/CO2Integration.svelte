<script>
    import Button from "sveltestrap/src/Button.svelte";
    import Highcharts from "highcharts";
    import { pop } from "svelte-spa-router";

    let datos = [];
    let datos1 = [];
    let fechas = [];        // El numero maximo que se muestra en la grafica es 15
    
    let kg = [];
    let tot = [];
    let tpc = [];
    
    let ccelectr = [];
    let ccdemand = [];
    let ccmining = [];


    async function loadGraph(){
        const res = await fetch("https://sos2122-22.herokuapp.com/api/v2/co2-stats");
        const res1 = await fetch("/api/v2/cryptocoin-stats");
        if(res.ok){
            datos = await res.json();
            
            console.log("AQUI: " + datos);
            console.log("AQUI2: " + JSON.stringify(datos, null, 2));

            // C02
            datos.forEach(data => {
                fechas.push(data["country"] + "-" + data.year);
                tot.push(data.co2_tot);
                kg.push(data.co2_kg);
                tpc.push(data.co2_tpc);
            });

            datos1 = await res1.json();

            console.log(datos1);
            console.log(JSON.stringify(datos1, null, 2));

            // CRYPTOCOIN-STATS
            datos1.forEach(data => {
                fechas.push(data["country"] + "-" + data.year);
                ccelectr.push(data.ccelectr);
                ccdemand.push(data.ccdemand);
                ccmining.push(data.ccmining);
            });

            console.log(fechas);


        }else{
            window.alert("No hay datos para este pais");
            console.log("INTERNAL FATAL ERROR");
            window.location.href = `/#/cryptocoin-stats`;
        }


        Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Gráfico de barras sobre la relación de las emisiones de CO2 (Belén Rodríguez Salazar) mezclado con el consumo de criptomonedas.'
    },
    xAxis: {
        categories: fechas,
        title: {
            text: 'Pais-Año'
        },
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percentage',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip:{
        split: true,
        valueSuffix: "",
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -70,
        y: 130,
        floating: true,
        borderWidth: 1,
        baccoefficientsroundColor:
            Highcharts.defaultOptions.legend.baccoefficientsroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'kg',
        data: kg,
    },{
        name: 'tot',
        data: tot,
    },{
        name: 'tpc',
        data: tpc,
    },{
        name: 'Consumo eléctrico (GWh)',
        data: ccelectr,
    },{
        name: 'Demanda eléctrica (TWh)',
        data: ccdemand,
    },{
        name: '% de minería',
        data: ccmining,
    }],
    });
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{loadGraph}"></script>
</svelte:head>

<main>        
    <br>
    <br>
    <Button id="back" outline color="secondary" on:click="{pop}"> Atrás</Button>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
               
            </p>
        </figure>  
    </main>
    
    
    <style>
        .highcharts-figure {
          min-width: 100%;
          max-width:100%;
          margin: 1em auto;
        }
        #container {
          height: 600px;
        }
        
    </style>