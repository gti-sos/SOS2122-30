<main>
    <Nav>
        <NavItem>
          <NavLink href="#/info">Main Page</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/tdTable/tdHighCharts">Highcharts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/tdTable">Data</NavLink>
        </NavItem>
    </Nav>
  
    <h1>Percent of mobiles reused or recycled (2019)</h1>

    <div>
      {#if !cargados}
        <p class="error">{errorMsg}</p>
      {/if}
    </div>
    
    <div id="chart"></div>

  </main>
  
  <svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</svelte:head>

<script>
    import { onMount } from "svelte";
   import { pop } from "svelte-spa-router";
   import{Nav, NavItem, NavLink } from "sveltestrap";
   
    const BASE_API_PATH = "/api/v2/technology_devices_stats/";
 

  let ewasteStats=[];
  let ewasteChartCountry = [];
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
            ewasteChartCountry.push(stat.country);
            ewasteChartTdwasted.push(parseFloat(stat.tdwasted));
            ewasteChartMpdisused.push(parseFloat(stat.mpdisuse));
            ewasteChartMpreused.push(parseFloat(stat.mpreused));
            });
            cargados=true;
        }

    
      console.log("E-waste Chart data:" + ewasteStats);
/*
      //bar option
      var options = {
          series: [{
                 name: 'E-waste',
                data: ewasteChartTdwasted
                },
                {
                name: 'Mobile phones in disuse amount',
                data: ewasteChartMpdisused
                },
                {
                name: 'Recycled and reused MP(%)',
                data: ewasteChartMpreused
                }],
          chart: {
          type: 'bar',
          height: 430
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        tooltip: {
          shared: true,
          intersect: false
        },
        xaxis: {
          categories: ewasteChartCountry,
        },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render(); }
*/
        //PolarArea
      var options = {
          series: ewasteChartMpreused,
          chart: {
          type: 'polarArea',
        },
        stroke: {
          colors: ['#fff']
        },
        fill: {
          opacity: 0.8
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();}

/*
        //Area option
      var options = {
        series: [{
                 name: 'E-waste',
                data: ewasteChartTdwasted
                },
                {
                name: 'Mobile phones in disuse amount',
                data: ewasteChartMpdisused
                },
                {
                name: 'Recycled and reused MP(%)',
                data: ewasteChartMpreused
        }],
          chart: {
          height: 350,
          type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'País',
          categories: ewasteChartCountry
        },
        yAxis: {
          title: {
              text: '%'
          }
        },
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      }
*/
    onMount(loadChart);
    
</script>

<style>
     main {
      text-align: center;
      padding: 30px;       
  }
  </style>