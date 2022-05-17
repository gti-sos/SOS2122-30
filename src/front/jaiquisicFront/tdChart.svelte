<script>
    import { onMount } from "svelte";
     import { pop } from "svelte-spa-router";
     import ApexCharts from 'apexcharts'
     import{Nav, NavItem, NavLink } from "sveltestrap";

      const BASE_API_PATH = "/api/v2/technology_devices_stats/";

     
      var options = {
  chart: {
    type: 'area'
  },
  series: [
                {
                name: 'E-waste (Ton)',
                data: ewasteChartTdwasted
                },
                {
                name: 'Mobile phones in disuse amount',
                data: ewasteChartMpdisused,
                },
                {
                name: 'Recycled and reused MP (%)',
                data: ewasteChartMpreused
                }
  ],
  xaxis: {
    categories: [1990, 2000, 2010, 2019, 2022, 2050]
  }
}

var chart = new ApexCharts(document.querySelector('#chart'), options)
chart.render()
  
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