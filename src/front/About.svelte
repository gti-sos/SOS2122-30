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
            <CardBody><h3>
            VIDEOS
            </h3></CardBody>
            <Nav tabs>
                <NavItem>
                    <NavLink href="https://www.youtube.com/watch?v=LydDOzoq20Y">SERGIO</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#/info">JAIME</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#/info">JAVIER</NavLink>
                  </NavItem>
            </Nav>
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