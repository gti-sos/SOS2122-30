<script>
    import { onMount } from "svelte";
    import { pop } from "svelte-spa-router";
    import{Nav, NavItem, NavLink } from "sveltestrap";
</script>
<main>
    <Nav>
        <NavItem>
          <NavLink href="#/info">Main Page</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/satellites-stats/st-HighCharts">Highcharts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/satellites-stats">Data</NavLink>
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