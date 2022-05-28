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
          var year2 = [];

            CO2.forEach((dato)=>{
                year.push(parseInt(dato.year));
            });

            crypto.forEach((dato)=>{
                year2.push(parseInt(dato.year));
            });

            var cat = year.concat(year2);

            // Quitamos duplicados
            cat = cat.filter(function(valor,indiceActual,arreglo){
                let indiceAlBuscar = arreglo.indexOf(valor);
                if (indiceActual == indiceAlBuscar){
                    return true;
                } else {
                    return false;
                }
            });

            var yearAux= cat;

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

             for (var i = 0; i < cat.length; i++){
                var x = CO2.filter((e)=>{
                    return e.year == cat[i];
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

             for (var i = 0; i < cat.length;i++){
               var x = crypto.filter((e)=>{
                 return e.year == cat[i];
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
                categories: cat,
                title: {
                    text: 'Año'
                },
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Índice',
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
            type: 'area',
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

        var resCrypto = [];
        var resGasto = [];
        

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
            var year2 = [];
            
            gasto.forEach((dato)=>{
                year.push(parseInt(dato.year));
            });

            crypto.forEach((dato)=>{
                year2.push(parseInt(dato.year));
            });

            var cat = year.concat(year2);

            // Quitamos duplicados
            cat = cat.filter(function(valor,indiceActual,arreglo){
                let indiceAlBuscar = arreglo.indexOf(valor);
                if (indiceActual == indiceAlBuscar){
                    return true;
                } else {
                    return false;
                }
            });

            var yearAux= cat;

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


  /*

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
 */
                for (var i = 0; i < cat.length; i++){
                  var x = gasto.filter((f)=>{
                        return f.year == cat[i] && f.country == "españa";
                  }).map((m)=>{
                          return redondeoADos(m.pe_to_gdp*0.01);
                  });

                  var y = crypto.filter((f)=>{
                          return f.year == cat[i] && f.country == "españa";
                  }).map((m)=>{
                            return redondeoADos(m.ccmining*0.01);
                  });


                  if(y.length == 0){
                    resCrypto.push(0);
                  } else {
                    resCrypto.push(y);
                  }

                  if(x.length == 0){
                      resGasto.push(0);
                  } else{
                      resGasto.push(x);
                  }
                }

                var a = [0.11,0,0.22,0.33];
                var b = [0.43,0.53,0.73];

                console.log("DEPURAR GASTO "+resGasto);
                console.log("DEPURAR CRYPTO "+resCrypto);
                console.log("AÑOS "+year);


                Highcharts.chart('gasto', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Relación entre minería y gasto público en España'
            },
            xAxis: {
                categories: cat,
                title: {
                    text: 'Año'
                },
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Índice',
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
                name: 'PIB',
                data: resGasto,
            },{
                name: 'Índice minería global',
                data: resCrypto,
            }]
            });

        }
    }

    async function apiPrecios(){
      var data = [];
      var nombres = [];
      var precioMinimo = [];
      var precioMaximo = [];

      const res = await fetch ("https://cex.io/api/currency_limits");

      if(!res.ok){
          window.alert("Ha habido un error en recoger los datos de la API PRECIOS CRIPTOMONEDAS");
          console.log("Error precios API");
          window.location.href = `https://cex.io/api/currency_limits`;
      } else {
          data = await res.json();
          
          nombres = data["data"]["pairs"].map((m)=>{
              return m.symbol1;
          }); 

          nombres = nombres.slice(0,10);

        //  console.log("DEPURAR NOMBRES "+nombres);
        // console.log("DEPURAR NOMBRES "+nombres.length);

          precioMinimo = data["data"]["pairs"].map((m)=>{
            return redondeoADos(parseFloat(m.minPrice));
          });

          precioMinimo = precioMinimo.slice(0,10);

         // console.log("DEPURAR PRECIO MINIMO: "+ precioMinimo);
         // console.log("DEPURAR PRECIO MINIMO: "+ precioMinimo.length);

          precioMaximo = data["data"]["pairs"].map((m)=>{
            return redondeoADos(parseFloat(m.maxPrice));
          });

          precioMaximo = precioMaximo.slice(0,10);

          // console.log("DEPURAR PRECIO MAXIMO "+ precioMaximo);
          // console.log("DEPURAR PRECIO MAXIMO "+ precioMaximo.length);

          var trace1 = {
              type: 'scatter',
              x: precioMinimo,
              y: nombres,
              mode: 'markers',
              name: 'Precio mínimo histórico (USD)',
              marker: {
                color: 'rgba(156, 255, 196, 0.95)',
                line: {
                  color: 'rgba(156, 165, 196, 1.0)',
                  width: 1,
                },
                symbol: 'circle',
                size: 16
              }
          };

          var trace2 = {
            x: precioMaximo,
            y: nombres,
            mode: 'markers',
            name: 'Precio máximo histórico (USD)',
            marker: {
              color: 'rgba(204, 0, 204, 0.95)',
              line: {
                color: 'rgba(217, 217, 217, 1.0)',
                width: 1,
              },
              symbol: 'circle',
              size: 16
            }
          };

        
        var data = [trace1, trace2];

        var layout = {
            title: 'Precios mínimos y máximos históricos de diferentes criptomonedas',
            xaxis: {
              showgrid: false,
              showline: true,
              linecolor: 'rgb(102, 102, 102)',
              titlefont: {
                font: {
                  color: 'rgb(204, 204, 204)'
                }
              },
              tickfont: {
                font: {
                  color: 'rgb(102, 102, 102)'
                }
              },
              autotick: false,
              dtick: 100000,
              ticks: 'outside',
              tickcolor: 'rgb(102, 102, 102)'
            },
            margin: {
              l: 140,
              r: 40,
              b: 50,
              t: 80
            },
            legend: {
              font: {
                size: 10,
              },
              yanchor: 'middle',
              xanchor: 'right'
            },
            width: 600,
            height: 600,
            paper_bgcolor: 'rgb(254, 247, 234)',
            plot_bgcolor: 'rgb(254, 247, 234)',
            hovermode: 'closest'
        };
  
        Plotly.newPlot('myDiv', data, layout);

      }

    }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{apiCO2}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{apiGasto}"></script>

    <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load="{apiMagic}"></script>
    <script src='https://cdn.plot.ly/plotly-1.58.4.min.js' on:load={apiPrecios}></script>

</svelte:head>

<main>        
    <br>
    <Button id="back" outline color="secondary" on:click="{pop}"> Atrás</Button>
    <br>

    <div id='caja'>
        <h3>API SOS2122-22 -  Belén Rodríguez Salazar</h3>
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
        <h3>API SOS2122-27 - Roque Fernandez Iglesias</h3>
        <div style="margin:auto;"> 
          <figure class="highcharts-figure">
              <div id="gasto"></div>
              <p class="highcharts-description">
                 
              </p>
            <div style="text-align: center">fuente: <a href="https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats" target="_blank">aqui</a></div>
          </figure>
      </div>

    <br>

    <div id='caja'>
        <h3>API MAGIC: THE GATHERING</h3>
            <div id="chartex2"></div>
            <div style="text-align: center">fuente: <a href="https://api.magicthegathering.io/v1/cards" target="_blank">aqui</a></div>
    </div>

    <div id='caja'>
      <h3>API PRECIOS CRIPTOMONEDAS</h3>
          <div id="myDiv"></div>
          <div style="text-align: center">fuente: <a href="https://cex.io/api/currency_limits" target="_blank">aqui</a></div>
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