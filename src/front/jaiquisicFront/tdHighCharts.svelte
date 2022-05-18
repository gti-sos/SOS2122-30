<script>
import { onMount } from "svelte";

import{Nav, NavItem, NavLink } from "sveltestrap";
const BASE_API_PATH = "/api/v2/technology_devices_stats/";
let ewasteStats=[];
let ewasteChartCountryYear = [];
let ewasteChartTdwasted = [];
let ewasteChartMpdisused = [];
let ewasteChartMpreused = [];


let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
    let cargados = false;




    async function loadChart() {
        console.log("Fetching data...");
        const res = await fetch(BASE_API_PATH);
        ewasteStats = await res.json();
        if (res.ok) {
            ewasteStats.forEach(stat => {
            ewasteChartCountryYear.push(stat.country+"-"+stat.year);
            ewasteChartTdwasted.push(parseFloat(stat.tdwasted));
            ewasteChartMpdisused.push(parseFloat(stat.mpdisuse));
            ewasteChartMpreused.push(parseFloat(stat.mpreused));
            });
            cargados=true;
        }

    
    console.log("E-waste Chart data:" + ewasteStats);

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'E-waste growth over the years'
    },
    xAxis: {
        categories: ewasteChartCountryYear,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Ton/Ud(mill)/%'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'E-waste',
                data: ewasteChartTdwasted
                },
                {
                name: 'Mobile phones in disuse amount',
                data: ewasteChartMpdisused,
                },
                {
                name: 'Recycled and reused MP(%)',
                data: ewasteChartMpreused
                }]
});
  }

 



</script>

<svelte:head>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/series-label.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script
  src="https://code.highcharts.com/modules/accessibility.js"
  on:load={loadChart}></script>
</svelte:head>

<main>
    <Nav>
        <NavItem>
          <NavLink href="#/info">Main Page</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/#/tdTable/tdChart">Area chart</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/tdTable">Data</NavLink>
        </NavItem>
    </Nav>
  
    <div>
        <h2>
          E-waste Analytics
        </h2>
      </div>

  <div>
      <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
          .
        </p>
      </figure>
  </div>
  

  <div>
    {#if !cargados}
      <p class="error">{errorMsg}</p>
    {/if}
  </div>
</main>

<style>
  main {
      text-align: center;
      padding: 30px;       
  }
  p.error{
    color: red; 
    text-align:center;
    font-size: 20px;
    margin-top:80px;
  }
  
 
</style>