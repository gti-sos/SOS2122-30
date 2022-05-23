<script>
    import Button from "sveltestrap/src/Button.svelte";
    import Highcharts from "highcharts";
    import { pop } from "svelte-spa-router";




    // TO-DO: Corregir la variable fechas. 
    //          Los valores de datos1 no corresponden al pais-año que debería
    //          Parece que se asocia a los primeros datos que recoge fechas en vez de las coincidencias

    

    async function apiCO2(){

        var crypto = [];
        var CO2 = [];





        const res = await fetch("https://sos2122-22.herokuapp.com/api/v2/co2-stats");

        const res1 = await fetch("/api/v2/cryptocoin-stats");

        if(!res.ok){
            
            window.alert("No hay datos para este pais");
            console.log("INTERNAL FATAL ERROR");
            window.location.href = `/#/cryptocoin-stats`;

        }else{

            crypto = await res1.json();
            CO2 = await res.json();
            

          var cat = [];

          CO2.forEach(data=>{
              cat.push(data["country"]+"-"+data.year);
          });


          console.log("EH TU: "+cat);
  
          crypto.forEach((data)=>{
              cat.push(data["country"]+"-"+data.year);
          });


          var dataCO2 = CO2.map((dato)=>{
              return parseFloat(dato.co2_tot);
          });

          var dataCrypto = [];

          dataCO2.forEach((el)=>{
              dataCrypto.push(0);
          });

          crypto.forEach((el)=>{
              dataCO2.push(0);
          });

          crypto.forEach((dato)=>{
              dataCrypto.push(dato.ccelectr);
          });

        }

        



        Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Relación entre las emisiones totales de CO2 y la electricidad consumida por las criptomonedas'
    },
    xAxis: {
        categories: cat,
        title: {
            text: 'Pais'
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
        x: -20,
        y: 80,
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
        name: 'CO2',
        data: dataCO2,
    },{
        name: 'Consumo eléctrico (GWh)',
        data: dataCrypto,
    }]
    });
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{apiCO2}"></script>
</svelte:head>

<main>        
    <br>
    <Button id="back" outline color="secondary" on:click="{pop}"> Atrás</Button>
    <br>
    <div id='caja'>
        <h1>API SOS2122-22</h1>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
               
            </p>
            <div style="text-align: center">fuente: <a href="https://sos2122-22.herokuapp.com/#/Co2StatsTable" target="_blank">aqui</a></div>
        </figure>
    </div>
    <br>  
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
        #caja{
      padding: 2%;
      border: 1px solid black;
    }
        
    </style>