const cool = require("cool-ascii-faces");
const express = require("express");

//Para parsear el json
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 8080;

const BASE_API_URL= "/api/v1";

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

//GET 

//Conjunto
app.get(BASE_API_URL + "/stsatellites-stats", (req, res)=>{
    res.send(JSON.stringify(satellites,null,2));
});

//Elemento
app.get(BASE_API_URL + "/stsatellites-stats/:name", (req, res)=>{
    var satYear = req.params.year;
    filteredSat = satellites.filter((satellite)=>{
        return (satellite.year == satYear);
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

app.post(BASE_API_URL + "/stsatellites-stats", (req, res)=>{
    contacts.push(req.body);
    res.sendStatus(201, "CREATED");
});

//DELETE

//Conjunto
app.delete(BASE_API_URL + "/stsatellites-stats", (req, res)=>{
    satellites = [];
    res.sendStatus(200, "OK");
});

//Elemento
app.delete(BASE_API_URL + "/stsatellites-stats/:name", (req, res)=>{
    var satName = req.params.name;
    satellites = satellites.filter((satellite)=>{
        return (satellite.name != satName);
    });
    res.sendStatus(200, "OK");
});

//PUT


//-----------------------------------------------------------------------------

app.use("/", express.static('public'));

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