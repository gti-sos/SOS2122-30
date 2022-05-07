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
      


        // recoger datos por paises

        var russia = MyData.filter((el)=>{
            return el.country == "russia"
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        })
        russia = russia.reduce(function(sum,value){
            return sum+value;
        }, 0) / russia.length;
        
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




        //recoger datos por años
/*
        var veinteveinte = MyData.filter((el)=>{
            return el.country == "2020"
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        })
        veinteveinte = veinteveinte.reduce(function(sum,value){
            return sum+value;
        }, 0) / veinteveinte.length;
        
        var veinteveintiuno = MyData.filter((el)=>{
            return el.country == "2021"
        }).map((dato)=>{
            return parseFloat(dato.ccmining)
        })
        veinteveintiuno = veinteveintiuno.reduce(function(sum,value){
            return sum+value;
        },0) / veinteveintiuno.length;
     */   
        /////////////////////
        var ctx = document.getElementById('myChart').getContext('2d');
       var data = {
      datasets: [{
          data: [russia,eeuu,china],
          backgroundColor: [
          'rgba(200,200, 30)',
          'rgba(0, 0, 200)',
          'rgba(255,30,30)'
          ]
      }],
      labels: ["russia","eeuu","china"]
  };
        var myDoughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data
          
          });
        /////////////////////
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
          <NavLink href="#/ccTable/cryptoHighChart">Highcharts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/ccTable">Data</NavLink>
        </NavItem>
    </Nav>

    <h1>Percent of mining per country (2020-2021)</h1>
  </main>
  <canvas id="myChart"></canvas>
  
  <style>
       main {
        text-align: center;
        padding: 30px;       
    }
    </style>