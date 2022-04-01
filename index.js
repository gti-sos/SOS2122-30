const cool = require("cool-ascii-faces");
const express = require("express");

//Para parsear el json
const bodyParser = require("body-parser");
const backend_crypto = require("./src/back/cryptocoins_stats/index");
const backend_td = require("./src/back/td-stats/index")

const app = express();
const port = process.env.PORT || 8080;

const BASE_API_URL= "/api/v1";

//URL Javier
const s = "/stsatellites-stats";



app.use(bodyParser.json());

//Parte de Javier
var satellites = [
    { 
        "country": "eeuu", 
        "year": 2020 ,
        "quarter": "second", 
        "st-launched": 529, 
        "st-orbit": 362, 
        "st-destroyed": 8 
    },
    {
        "country": "eeuu", 
        "year": 2020 ,
        "quarter": "third", 
        "st-launched": 664, 
        "st-orbit": 441, 
        "st-destroyed": 14
    },
    {
        "country": "eeuu", 
        "year": 2021 ,
        "quarter": "first", 
        "st-launched": 880, 
        "st-orbit": 652, 
        "st-destroyed": 58
    },
    {
        "country": "eeuu", 
        "year": 2021 ,
        "quarter": "second", 
        "st-launched": 1610, 
        "st-orbit": 973, 
        "st-destroyed": 67
    },
    {
        "country": "eeuu", 
        "year": 2021 ,
        "quarter": "third", 
        "st-launched": 1929, 
        "st-orbit": 1503, 
        "st-destroyed": 145
    }
];

var satellites_2 = satellites;
  



//--------------------------------------------------------------
//Load inicial - Javier
app.get(BASE_API_URL + s + "/loadInitialData", (req, res)=>{
    var Sat = satellites.length;
    if(Sat == 0){
        satellites = satellites_2;
        res.redirect(BASE_API_URL + s);
    }else{
        res.sendStatus(409, "Conflict");
    }
});

//  ---- /DOCS ------

const javier_doc = "https://documenter.getpostman.com/view/20110246/UVyn2yXJ";

app.get(BASE_API_URL + s +"/docs", (req,res) => {
    res.redirect(javier_doc);
});


//GET 

//Conjunto
app.get(BASE_API_URL + s, (req, res)=>{
    var Sat = satellites.length;
    res.send(JSON.stringify(satellites,null,2));
});




//Elemento
app.get(BASE_API_URL + s + "/:country/:year/:quarter", (req, res)=>{
    var satYear = req.params.year;
    var satCoun = req.params.country;
    var satQ = req.params.quarter;

    filteredSat = satellites.filter((satellite)=>{
        return (satellite.year == satYear && satCoun == satellite.country && satQ == satellite.quarter);
    });
    
    if(filteredSat == 0){
        res.sendStatus(404, "NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredSat[0],null,2)); 
        //Por si acaso hay mas de 1 elemento (no debería)
        //se escoge el primero
    }

});



//POST

//Conjunto
app.post(BASE_API_URL + s, (req, res)=>{
    satBody = req.body;
    satCountry = req.body.country;
    satYear = req.body.year;
    satQ = req.body.quarter;

    if(!satBody.country || !satBody.year || !satBody.quarter || !satBody.st-launched || !satBody.st-orbit || !satBody.st-destroyed){
        return res.sendStatus(400);
        // Un dato pasado con un POST debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

    } else {
        for(var i = 0; i < satellites.length; i++){
            if(satellites[i].country == satCountry && satellites[i].year == satYear && satellites[i].quarter == satQ){
                return res.sendStatus(409, "Conflict");
            }
        }
        satellites.push(req.body);
        res.sendStatus(201, "CREATED");

    }

});



//Elemento
app.post(BASE_API_URL + s + "/:country/:year/:quarter",(req,res)=>{
    res.sendStatus(405, "Method not allowed");
});



//DELETE

//Conjunto
app.delete(BASE_API_URL + s, (req, res)=>{
    satellites = [];
    res.sendStatus(200, "OK");
});


//Elemento
app.delete(BASE_API_URL + s + "/:country/:year", (req, res)=>{
    var satYear = req.params.year;
    var satCoun = req.params.country;

    satellites = satellites.filter((satellite)=>{
        return (satellite.name != satYear || satellite.country != satCoun);
    });

    if(satellites_2.length == satellites){
        res.sendStatus(404, "Not Found");
    }else{
        res.sendStatus(200, "OK");
    }
});

//PUT

//Elemento

app.put(BASE_API_URL + s + "/:country/:year/:quarter", (req,res)=>{
    var cc_params = req.params;         // variable a actualizar
    var satBody = req.body;             // recurso actualizado

    var satQ = req.params.quarter;
    var satCountry = req.params.country;
    var satYear = req.params.year;

    if(!satBody.country || !satBody.year || !satBody.quarter || !satBody.st-launched || !satBody.st-orbit || !satBody.st-destroyed){
        return res.sendStatus(400, "Bad Request");
        // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

    } else {
        for(var i = 0; i < satellites.length; i++){
            if(satellites[i].country == satCountry && satellites[i].year == satYear && satellites[i].quarter ==satQ){
                satellites[i] = satBody;
                break;
            }
        }
        res.sendStatus(200, "OK");
    }
});

//Conjuto

app.put(BASE_API_URL + s, (req,res)=>{
    res.sendStatus(405,"Unabe to PUT a resource list");
});


//-----------------------------------------------------------------------------

app.use("/", express.static('public'));

backend_crypto(app) // FALTA POR IMPLEMENTAR LA BASE DE DATOS




backend_td(app)




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