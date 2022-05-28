<script>
    import {
        onMount
     } from "svelte";
     import {
          pop
      } from "svelte-spa-router";

      import{Nav, NavItem, NavLink } from "sveltestrap";

      const BASE_API_PATH = "/api/v2/cryptocoin-stats/";

      

      async function loadGraphs(){
        let MyData=[];
        const resData = await fetch(BASE_API_PATH);
        MyData = await resData.json(); 
        console.log(MyData);


        // recoger datos por paises 
        
/*
        var russia = MyData.filter((el)=>{
            return el.country == "russia"
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        })
        russia = russia.reduce(function(sum,value){
            return sum+value;
        },0) / russia.length;

        var eeuu = MyData.filter((el)=>{
            return el.country == "eeuu" 
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        })
        eeuu = eeuu.reduce(function(sum,value){
            return sum+value;
        },0) / eeuu.length;

        var china = MyData.filter((el)=>{
            return el.country == "china" 
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        })
        china = china.reduce(function(sum,value){
            return sum+value;
        },0) / china.length;
*/

        var veinte_veinte_paises = MyData.filter((el)=>{
            return el.year == "2020"
        }).map((dato)=>{
            return dato.country
        });

        var veinte_veinte_mining = MyData.filter((el)=>{
            return el.year == "2020"
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        });

        console.log(veinte_veinte_paises);
        console.log(veinte_veinte_mining);


        var veinte_uno_paises = MyData.filter((el)=>{
            return el.year == "2021"
        }).map((dato)=>{
            return dato.country
        });

        var veinte_uno_mining = MyData.filter((el)=>{
            return el.year == "2021"
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        });

        /////////////////////
        var ctx = document.getElementById('myChart').getContext('2d');
       var data = {
      datasets: [{
          data: veinte_veinte_mining,
          backgroundColor: [
          'rgba(200,200, 30)',
          'rgba(0, 0, 200)'
          ,'rgba(255,30,30)',
          'rgba(0,0,0)',
          'rgba(100,255,100)',
          'rgba(120,0,255)',
          'rgba(255,255,255)'
          ]
      }],
      labels: veinte_veinte_paises
      //  labels: ["2020","2021"]
  };

        var ctx2 = document.getElementById('myChart2').getContext('2d');
    
        var data2 = {
      datasets: [{
          data: veinte_uno_mining,
          backgroundColor: [
          'rgba(200,200, 30)',
          'rgba(0, 0, 200)'
          ,'rgba(255,30,30)',
          'rgba(0,0,0)',
          'rgba(100,255,100)',
          'rgba(120,0,255)',
          'rgba(255,255,255)'
          ]
      }],
      labels: veinte_uno_paises
      //  labels: ["2020","2021"]
  };

        var myDoughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data
          
          });
        /////////////////////
        var myDoughnutChart2 = new Chart(ctx2, {
          type: 'doughnut',
          data: data2
          
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
          <NavLink href="#/cryptocoin-stats/cryptoHighChart">Highcharts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/cryptocoin-stats">Data</NavLink>
        </NavItem>
    </Nav>

    <h1>Percent of mining per country</h1>
  </main>
  <br>
  <h2>2020</h2>
  <br>
  <canvas id="myChart"></canvas>
  <br>
  <h2>2021</h2>
  <canvas id="myChart2"></canvas>
  
  <style>
       main {
        text-align: center;
        padding: 30px;       
    }
    h1 {
      text-align: center;
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
    h2 {
      text-align: center;
      color: #1f88b9;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
    </style>