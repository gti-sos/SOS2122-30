const cool = require("cool-ascii-faces");
const express = require("express");
const cors = require("cors");
const request = require("request");

//Para parsear el json
const bodyParser = require("body-parser");

// V1
const backend_crypto1 = require("./src/back/cryptocoins_stats/v1/index");
const backend_td1 = require("./src/back/td-stats/v1/index");
const backend_satellites1 = require("./src/back/stsatellites/v1/index");



// V2
const backend_crypto2 = require("./src/back/cryptocoins_stats/v2/index");
const backend_td2 = require("./src/back/td-stats/v2/index");
const backend_satellites2 = require("./src/back/stsatellites/v2/index");



const app = express();
const port = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());

// PROXYS

var paths = "/remoteAPI";
var apiServerHost = 'https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats';

app.use(paths, function(req, res) {
    var url = apiServerHost + req.url;
    console.log('piped: ' + req.url);
    req.pipe(request(url)).pipe(res);
  });




//-----------------------------------------------------------------------------

app.use("/", express.static('./public'));

// V1
backend_crypto1(app); 

backend_td1(app);

backend_satellites1(app);


// V2cd
backend_crypto2(app); 

backend_td2(app);

backend_satellites2(app);



app.get("/cool",(req,res)=>{
    console.log("Requested /cool route");
    res.send("<html><body><h1>"+cool()+"</h1></body></html>");
});

app.get("/time",(req,res)=>{
    console.log("Requested /time route");
    res.send("<html><body><h1>"+new Date()+"</h1></body></html>");
});

app.listen(port, () => {
    console.log(`Server TRULY ready at port ${port}`);
});

console.log(`Server ready at port ${port}`);

console.log(cool());