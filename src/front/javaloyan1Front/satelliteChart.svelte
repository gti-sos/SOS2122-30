<script>
    import{Nav, NavItem, NavLink } from "sveltestrap";
    
    const BASE_API_PATH = "/api/v2/satellites-stats/";
</script>
<svelte:head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
</svelte:head>
<main>
    <Nav>
        <NavItem>
          <NavLink href="#/info">Main Page</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/satellites/stHighChart">Highcharts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/satellites-stats">Data</NavLink>
        </NavItem>
    </Nav>

    <h1>Satellites</h1>
        <div id= "firstChart" style = "height: 250px;"></div>
        <script>
            let morris = new Morris.Line({
                // ID of the element in which to draw the chart.
                element: 'firstChart',
                // Chart data records -- each entry in this array corresponds to a point on
                // the chart.
                data: [
                    { year: '2008', value: 20 },
                    { year: '2009', value: 10 },
                    { year: '2010', value: 5 },
                    { year: '2011', value: 5 },
                    { year: '2012', value: 20 }
                ],
                // The name of the data record attribute that contains x-values.
                xkey: 'year',
                // A list of names of data record attributes that contain y-values.
                ykeys: ['value'],
                // Labels for the ykeys -- will be displayed when you hover over the
                // chart.
                labels: ['Value']
            });
        </script>
</main>