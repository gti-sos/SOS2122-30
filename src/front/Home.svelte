<script>
import {
      Button,
      Table,
      Card,
      CardBody,
      CardFooter,
      CardHeader,
      CardSubtitle,
      CardText,
      CardTitle,
      Col,
      Container,
      Row,
      Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    NavItem,
    NavLink,
    Navbar
    } from "sveltestrap"
</script>


<main>

    <body>

        <Card>
          <CardBody><h1>
            SOS2122-30
          </h1></CardBody>
        </Card>

        <CardBody>
        <h3>
            Project description:
        </h3>
        Analysis of the relation that exists between the sources of pollution of different new-age Technology 
      </CardBody>


        <br>
        

        


        <div class="mb-3">
         <Nav tabs>

          <Dropdown group size="lg">
            <DropdownToggle nav caret>Postman v1</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/api/v1/cryptocoin-stats/docs">
              Cryptocoin-stats</a></DropdownItem>
              <DropdownItem>
                <a href="/api/v1/technology_devices_stats/docs">
                  Ewaste-stats</a></DropdownItem>
              <DropdownItem><a href="/api/v1/stsatellites-stats/docs">
                Stsatellites-stats</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>


          <Dropdown group size="lg">
            <DropdownToggle nav caret>Postman v2</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/api/v2/cryptocoin-stats/docs">
              Cryptocoin-stats</a></DropdownItem>
              <DropdownItem>
                <a href="/api/v2/technology_devices_stats/docs">
                  Ewaste-stats</a></DropdownItem>
              <DropdownItem><a href="/api/v2/stsatellites-stats/docs">
                Stsatellites-stats</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <br>

         

          <Dropdown group size="lg" nav setActiveFromChild>
            <DropdownToggle nav caret>API V1</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/api/v1/cryptocoin-stats">
              Cryptocoin-stats</a></DropdownItem>
              <DropdownItem>
                <a href="/api/v1/technology_devices_stats">
                  Ewaste-stats</a></DropdownItem>
              <DropdownItem><a href="/api/v1/stsatellites-stats">
                Stsatellites-stats</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown group size="lg" nav setActiveFromChild>
            <DropdownToggle nav caret>API V2</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/api/v2/cryptocoin-stats">
              Cryptocoin-stats</a></DropdownItem>
              <DropdownItem>
                <a href="/api/v2/technology_devices_stats">
                  Ewaste-stats</a></DropdownItem>
              <DropdownItem><a href="/api/v2/stsatellites-stats">
                Stsatellites-stats</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown group size="lg" nav setActiveFromChild>
            <DropdownToggle nav caret>FRONTEND</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/#/cryptocoin-stats">
              Cryptocoin-stats</a></DropdownItem>
              <DropdownItem>
                <a href="/#/tdTable">
                  Ewaste-stats</a></DropdownItem>
              <DropdownItem>
                <a href="/#/satellites-stats">
                Stsatellites-stats</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavItem>
            <NavLink href="#/Analytics">GRUPAL ANALYTICS</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#/About">VIDEOS</NavLink>
          </NavItem>
          </Nav>
        </div>

        


        <div class="mb-3">
          <Dropdown group size="md" nav setActiveFromChild>
            <DropdownToggle nav caret>VIEWS AND INTREGRATIONS - CRYPTOCOIN-STATS</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/#/cryptocoin-stats/Integrations">
              Integrations</a></DropdownItem>
              <DropdownItem>
                <a href="/#/cryptocoin-stats/cryptoChart">
                  Chart.js</a></DropdownItem>
              <DropdownItem>
                <a href="/#/cryptocoin-stats/cryptoHighChart">
                Highchart</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown group size="md" nav setActiveFromChild>
            <DropdownToggle nav caret>VIEWS AND INTREGRATIONS - EWASTE-STATS</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a href="/#/tdTable/Integrations">
              Integrations</a></DropdownItem>
              <DropdownItem>
                <a href="/#/tdTable/tdChart">
                  ApexCharts.js</a></DropdownItem>
              <DropdownItem>
                <a href="#/tdTable/tdHighCharts">
                Highchart</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown group size="md" nav setActiveFromChild>
            <DropdownToggle nav caret>VIEWS AND INTREGRATIONS - SATELLITE-STATS</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <a href="/#/satellites-stats/satelliteChart">
                  Morris.js</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>


        <Card class="mb-3">
          <CardHeader>
            <CardTitle>
              <a href="https://github.com/gti-sos/SOS2122-30">
              Repository
            </a>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle><a href="https://github.com/Servelgar">
              Sergio Velázquez García
            </a></CardSubtitle>
            <br>
            <CardSubtitle>
              <a href="https://github.com/alonyanez">
                Javier Alonso Yáñez
              </a></CardSubtitle>
            <br>
            <CardSubtitle>
              <a href="https://github.com/Jaiquisic23">
                Jaime Quintero Sicre
              </a></CardSubtitle>
          </CardBody>
          <CardFooter>
            <h4>Universidad de Sevilla - Ingeniería Informática: Tecnologías Informáticas</h4>
          </CardFooter>
        </Card>

    </body>
</main>

<style>
    main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
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
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>