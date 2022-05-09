<script>
    import{Nav, NavItem, NavLink } from "sveltestrap";
    const BASE_API_PATH = "/api/v2/cryptocoin-stats/";
    let cryptoCoinData=[];
    let cryptoCoinChartCountryYear = [];
    let cryptoCoinChartElectr = [];
    let cryptoCoinChartDemand = [];
    let cryptoCoinChartMining = [];
 
	let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
    let cargados = false;


    async function loadChart() {
        console.log("Fetching data...");
        const res = await fetch(BASE_API_PATH);
        cryptoCoinData = await res.json();
        if (res.ok) {
            cryptoCoinData.forEach(stat => {
            cryptoCoinChartCountryYear.push(stat.country+"-"+stat.year);
            cryptoCoinChartElectr.push(parseFloat(stat.ccelectr));
            cryptoCoinChartDemand.push(parseFloat(stat.ccdemand));
            cryptoCoinChartMining.push(parseFloat(stat.ccmining));
            });
            cargados=true;
        }
        
    console.log("Cryptocoin polution Chart data: " + cryptoCoinData);
            
    Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Data recolected by the Cambridge Bitcoin Electricity Consumption Index'
      },
      xAxis: {
          categories: cryptoCoinChartCountryYear,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'TWh/GW/%'
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
          name: 'Electric consumption',
          data: cryptoCoinChartElectr
      },
      {
          name: 'Electric demand',
          data: cryptoCoinChartDemand,
       },
       {
          name: '% of Mining',
          data: cryptoCoinChartMining
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
          <NavLink href="#/ccTable/cryptoChart">Chart.js</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/ccTable">Data</NavLink>
        </NavItem>
    </Nav>
  
    <div>
        <h2>
          Cryptocoin Consumption Analytics
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