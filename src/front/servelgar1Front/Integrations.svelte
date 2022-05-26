<script>
    import Button from "sveltestrap/src/Button.svelte";
    import Highcharts from "highcharts";
    import { pop } from "svelte-spa-router";


    
    // FUNCIONES AUXILIARES

    // Funcion auxiliar para ordenar de forma ascendente valores numéricos
    function ordenarAsc(array, key) {
         var arrayAux=[];
          for(var i=0; i < array.length-1;i++){
              for (let j = i+1; j < array.length; j++) {
                  if(array[i][key] > array[j][key]){
                      arrayAux = array[i];
                      array[i]=array[j];
                      array[j]=arrayAux;
                  }
              }
          }
          return array;
      }


      // redondear a dos decimales
      function redondeoADos(num) {
          return +(Math.round(num + "e+2")  + "e-2");
      }


// API SOS 1
    async function apiCO2(){

        var crypto = [];
        var CO2 = [];
        var dataCO2 = [];
        var dataCrypto = [];




        const res = await fetch("https://sos2122-22.herokuapp.com/api/v2/co2-stats");

        const res1 = await fetch("/api/v2/cryptocoin-stats");

        if(!res.ok){
            
            window.alert("No hay datos para este pais");
            console.log("INTERNAL FATAL ERROR");
            window.location.href = `/#/cryptocoin-stats`;

        }else{

            crypto = await res1.json();
            CO2 = await res.json();

            ordenarAsc(crypto, 'year');
            ordenarAsc(CO2, 'year');

          var year = [];


            CO2.forEach((dato)=>{
                year.push(parseInt(dato.year));
            });

            year.push(2021);

            // Quitamos duplicados
            year = year.filter(function(valor,indiceActual,arreglo){
                let indiceAlBuscar = arreglo.indexOf(valor);
                if (indiceActual == indiceAlBuscar){
                    return true;
                } else {
                    return false;
                }
            });

            var yearAux= year;

            var resultadoYear=[];
            for(var i=0;i<CO2.length;i++){
                for(var y=0;y<yearAux.length;y++){
                    if(yearAux[y]==CO2[i].year){
                        resultadoYear.push(CO2[i]);
                        break;
                    }
                }
             };


            // CALCULAR LA MEDIA DE C02 POR AÑO

             for (var i = 0; i < year.length; i++){
                var x = CO2.filter((e)=>{
                    return e.year == year[i];
                }).map((el)=>{
                  return parseFloat(el.co2_tot);
                });
                

                x = x.reduce(function(sum,value){
                    return sum+value;
                },0) / x.length;

                if(Number.isNaN(x)){
                 dataCO2.push(0);
               } else {
                  dataCO2.push(x);
               }
               
             }

             // CALCULAR LA MEDIA DE CONSUMO ELECTRICO POR AÑO

             for (var i = 0; i < year.length;i++){
               var x = crypto.filter((e)=>{
                 return e.year == year[i];
               }).map((el)=>{
                 return redondeoADos(parseFloat(el.ccelectr));
               });

               x = x.reduce(function(sum,value){
                 return sum+value;
               },0) / x.length;


               if(Number.isNaN(x)){
                 dataCrypto.push(0);
               } else {
                  dataCrypto.push(x);
               }
               
             }

        }

        



        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Relación entre las emisiones totales de CO2 y la electricidad consumida por las criptomonedas'
            },
            xAxis: {
                categories: year,
                title: {
                    text: 'Año'
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
                y: 40,
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




// API EXTERNA 1
    async function apiMagic(){
        var dataMagic = [];
        var nombres = [];
        var fuerza = [];
        var resistencia = [];
        var coste = [];
        
        const res = await fetch("https://api.magicthegathering.io/v1/cards");


        if(!res.ok){
            window.alert("Ha habido un error en recoger los datos de la API MAGIC");
            console.log("Error magic API");
            window.location.href = `https://api.magicthegathering.io/v1/cards`;
        } else{
            
            dataMagic = await res.json();
            
            nombres = dataMagic["cards"].filter((e)=>{
                return e.types == "Creature";
            }).map((e)=>{
                return e.name;
            });

            coste = dataMagic["cards"].filter((e)=>{
                return e.types == "Creature";
            }).map((e)=>{
                return e.cmc;
            });

            fuerza = dataMagic["cards"].filter((e)=>{
                return e.types == "Creature";
            }).map((e)=>{
                return e.power;
            });

            resistencia = dataMagic["cards"].filter((e)=>{
                return e.types == "Creature";
            }).map((e)=>{
                return e.toughness;
            });

        }


        var options = {
            series: [{
            name: 'Coste de maná total',
            type: 'area',
            data: coste
          }, {
            name: 'Poder de la carta',
            type: 'line',
            data: fuerza
          },
        {
            name: 'Resistencia de la carta',
            type: 'line',
            data: resistencia
        }],
            chart: {
            height: 350,
            type: 'line',
          },
          stroke: {
            curve: 'smooth'
          },
          title:{
              text: 'Relación coste/fuerza/resistencia de criaturas en Magic the Gathering'
          },
          fill: {
            type:'solid',
            opacity: [0.35, 1],
          },
          labels: nombres,
          markers: {
            size: 0
          },
          yaxis: [
            {
              title: {
                text: 'Cantidad',
              },
            }
          ],
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (y) {
                return y;
              }
            }
          }
          };
  
          var chart = new ApexCharts(document.querySelector("#chartex2"), options);
          chart.render();

    }






    // INTEGRACION 2 --

    // TO-DO: Utilizando españa como medida, poner datos en los años 2018-2022 de minería y luego relacionarlos con el gdp
    
    async function apiGasto(){

        var crypto = [];
        var gasto = [];
        

        const res = await fetch("/api/v2/cryptocoin-stats");
        const res1 = await fetch("/remoteAPI");
        if(!res1.ok){
            window.alert("La API public-expenditure-stats no responde. Pruebe más tarde.");
            console.log("INTERNAL FATAL ERROR");

        } else {
            crypto = await res.json();
            gasto = await res1.json();

            ordenarAsc(crypto,'year');
            ordenarAsc(gasto,'year');

            var year = [];
            
            gasto.forEach((dato)=>{
                year.push(parseInt(dato.year));
            });

            year.push(2021);

            // Quitamos duplicados
            year = year.filter(function(valor,indiceActual,arreglo){
                let indiceAlBuscar = arreglo.indexOf(valor);
                if (indiceActual == indiceAlBuscar){
                    return true;
                } else {
                    return false;
                }
            });

            var yearAux= year;

            var resultadoYear=[];
            for(var i=0;i<gasto.length;i++){
                for(var y=0;y<yearAux.length;y++){
                    if(yearAux[y]==gasto[i].year){
                        resultadoYear.push(gasto[i]);
                        break;
                    }
                }
             };


            
             



             var yearCrypto = [];

             crypto.forEach((c)=>{
               yearCrypto.push(parseInt(c.year));
             });

             yearCrypto = yearCrypto.filter(function(valor,indiceActual,arreglo){
                let indiceAlBuscar = arreglo.indexOf(valor);
                if (indiceActual == indiceAlBuscar){
                    return true;
                } else {
                    return false;
                }
              });


  

              gasto = resultadoYear.filter((e)=>{
                    return e.country == "españa";
              })
                  .map((dato)=>{
                      return redondeoADos(dato.pe_to_gdp*0.01);
              });

  

              // Calculamos la diferencia entre los años disponibles entre APIs

              var diferencia = Math.abs(year.length - yearCrypto.length);

              crypto = crypto.filter((f)=>{
                return f.country == "españa";
              }).map((m)=>{
                return redondeoADos(m.ccmining*0.01);
              });

              for(var i = 0; i < diferencia; i++){
                    crypto.unshift(0);
                }

            var options = {
                series: [
                {
                  name: "Minería respecto al resto del mundo",
                  data: crypto
                },
                {
                  name: "Gasto público respecto a PIB",
                  data: gasto
                }
              ],
                chart: {
                  type: 'area'
              },
              colors: ['#77B6EA', '#545454'],
              dataLabels: {
                enabled: true,
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: 'Relación entre minería y gasto público en España',
                align: 'left'
              },
              grid: {
                borderColor: '#e7e7e7',
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              markers: {
                size: 1
              },
              xaxis: {
                categories: year,
                title: {
                  text: 'Año'
                }
              },
              yaxis: {
                categories: year,
                title: {
                  text: 'Indice'
                },
                tickAmount: 2,
                min: 0.0,
                max: 1.0
              },
              legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
              }
              };
      
              var chart = new ApexCharts(document.querySelector("#chartex1"), options);
              chart.render();

        }
    }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{apiCO2}"></script>

    <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load="{apiMagic}"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load="{apiGasto}"></script>

</svelte:head>

<main>        
    <br>
    <Button id="back" outline color="secondary" on:click="{pop}"> Atrás</Button>
    <br>

    <div id='caja'>
        <h3>API SOS2122-22</h3>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
               
            </p>
            <div style="text-align: center">fuente: <a href="https://sos2122-22.herokuapp.com/#/Co2StatsTable" target="_blank">aqui</a></div>
        </figure>
    </div>

    <br> 

    <div id='caja'>
        <h3>API SOS2122-27</h3>
            <div id="chartex1"></div>
            <div style="text-align: center">fuente: <a href="https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats" target="_blank">aqui</a></div>
    </div>

    <br>

    <div id='caja'>
        <h3>API MAGIC: THE GATHERING</h3>
            <div id="chartex2"></div>
            <div style="text-align: center">fuente: <a href="https://api.magicthegathering.io/v1/cards" target="_blank">aqui</a></div>
    </div>

    

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
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 5em;
      font-weight: 110;
    }
    h3{
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 2em;
      font-weight: 60;
    }
    h4{
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 1em;
      font-weight: 60;
    }
        
    </style>