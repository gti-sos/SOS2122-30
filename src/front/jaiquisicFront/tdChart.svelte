<script>
    import { onMount } from "svelte";
     import { pop } from "svelte-spa-router";

      import{Nav, NavItem, NavLink } from "sveltestrap";

      const BASE_API_PATH = "/api/v2/technology_devices_stats/";

      async function loadGraphs(){
        let MyData=[];
        const resData = await fetch(BASE_API_PATH);
        MyData = await resData.json();
      


        // recoger datos por paises

        var russia = MyData.filter((p)=>{
            return p.country == "EEUU"
        }).map((dato)=>{
            return parseFloat(dato.mpreused)
        })
        eeuu = eeuu.reduce(function(sum,value){
            return sum+value;
        }, 0) / eeuu.length;
        
        var spain = MyData.filter((p)=>{
            return p.country == "Spain"
        }).map((dato)=>{
            return parseFloat(dato.mpreused)
        })
        spain = spain.reduce(function(sum,value){
            return sum+value;
        },0) / spain.length;

        var germany = MyData.filter((p)=>{
            return p.country == "Germany"
        }).map((dato)=>{
            return parseFloat(dato.mpreused)
        })
        germany = germany.reduce(function(sum,value){
            return sum+value;
        },0) / germany.length;

        var uk = MyData.filter((p)=>{
            return p.country == "UK"
        }).map((dato)=>{
            return parseFloat(dato.mpreused)
        })
        uk = uk.reduce(function(sum,value){
            return sum+value;
        },0) / uk.length;

        var france = MyData.filter((p)=>{
            return p.country == "France"
        }).map((dato)=>{
            return parseFloat(dato.mpreused)
        })
        france = france.reduce(function(sum,value){
            return sum+value;
        },0) / france.length;

        var ctx = document.getElementById('myChart').getContext('2d');
       var data = {
      datasets: [{
          data: [eeuu,spain,france, germany, uk],
          backgroundColor: [
          'rgba(200,200, 30)',
          'rgba(0, 0, 200)',
          'rgba(255,30,30)',
          'rgba(200,30,30)',
          'rgba(0,30,30)'
          ]
      }],
      labels: ["EEUU","Spain","France", "Germany", "UK"]
  };
        var myDoughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data
          
          });
        
      }
      
    </script>
    
  <svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" on:load="{loadGraphs}"></script>
  </svelte:head>
  
  
  
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