<script>
    import { onMount } from "svelte";
     import { pop } from "svelte-spa-router";
     import ApexCharts from 'apexcharts'
     import{Nav, NavItem, NavLink } from "sveltestrap";

      const BASE_API_PATH = "/api/v2/technology_devices_stats/";

      async function loadChart() {
        console.log("Fetching data...");
        const res = await fetch(BASE_API_PATH);
        ewasteStats = await res.json();
        if (res.ok) {
            ewasteStats.forEach(stat => {
            ewasteChartMpreused.push(parseFloat(stat.mpreused));
            });
            cargados=true;
        }

     
      var options = {
    chart: {
          height: 350,
          type: 'area'
    }, 
    stroke: {
          curve: 'smooth'
    },
    xaxis: {
          categories: [ewasteChartMpreused]
    }, 
    series: [
            {
              name: 'Recycled and reused MP (%)',
              data: ewasteChartMpreused
            }
  ]
}

var chart = new ApexCharts(document.querySelector('#chart'), options)
chart.render()
}

  
  </script>
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
  </main>
  <canvas id="myChart"></canvas>
  
  <style>
       main {
        text-align: center;
        padding: 30px;       
    }
    </style>