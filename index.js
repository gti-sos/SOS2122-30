const cool = require("cool-ascii-faces");
const express = require("express");

//Para parsear el json
const bodyParser = require("body-parser");
const backend_crypto = require("./src/back/cryptocoins_stats/index");

const app = express();
const port = process.env.PORT || 8080;

const BASE_API_URL= "/api/v1";

//URL Javier
const s = "/stsatellites-stats";



//URL Jaime
const url_jaime = "/technology_devices_stats";



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
  

//Parte de Jaime
var technology_devices_stats = [
    {
        "country": "EEUU",
        "year": 2019,
        "tdwasted": 6918,
        "mpdisuse": 220,
        "mpreused": 74
    },
    {
        "country": "Spain",
        "year": 2019,
        "tdwasted": 1450,
        "mpdisuse": 45.4,
        "mpreused": 89
    },
    {
        "country": "UK",
        "year": 2019,
        "tdwasted": 2695,
        "mpdisuse": 83.1,
        "mpreused": 83
    },
    {
        "country": "Germany",
        "year": 2019,
        "tdwasted": 2549,
        "mpdisuse": 84.7,
        "mpreused": 84
    },
    {
        "country": "France",
        "year": 2019,
        "tdwasted": 2129,
        "mpdisuse": 66.4,
        "mpreused": 76
    },
    {
        "country": "Canada",
        "year": 2019,
        "tdwasted": 739,
        "mpdisuse": 22.5,
        "mpreused": 70
    }

];

var technology_devices_stats2 = technology_devices_stats;



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





//--------------------------------------------------------------
//PARTE JAIME

//LOAD INICIAL
app.get(BASE_API_URL + url_jaime + "/loadInitialData", (req,res)=>{
    var td =  technology_devices_stats.length;
    if (td == 0){
        technology_devices_stats = technology_devices_stats2;
        res.redirect(BASE_API_URL + url_jaime);
    } else{
        res.sendStatus(409, "Conflict");
    }
});

const jaime_URL_API = "https://documenter.getpostman.com/view/19584746/UVyoUwqe";

app.get(BASE_API_URL + url_jaime +"/docs", (req,res) => {
    res.redirect(jaime_URL_API);
});


//GET 

//Conjunto
app.get(BASE_API_URL + url_jaime,(req,res)=>{
    res.send(JSON.stringify(technology_devices_stats,null,2));

});

//Elemento
app.get(BASE_API_URL + url_jaime + "/country/:year", (req, res)=>{
    var tdCountry = req.params.country;
    var tdYear = req.params.year;
    
    
    filteredTD = technology_devices_stats.filter((technology_devices_stats)=>{
        return(technology_devices_stats.country == tdCountry && technology_devices_stats.year == tdYear);
    });
    if(filteredTD == 0){
        res.sendStatus(404, "NOT FOUND");
    }else{
        res.status(200);
        res.send(JSON.stringify(filteredTD[0],null,2)); 
    }
});



//POST

//Conjunto
app.post(BASE_API_URL + url_jaime, (req,res)=>{
    tdBody = req.body;
    td_Country = req.body.country;
    td_Year = req.body.year;
    if(!tdBody.country || !tdBody.year || !tdBody.tdwasted || !tdBody.mpdisuse || !tdBody.mpreused){
        console.log("Data is missing or incorrect");
        return res.sendStatus(400);
    }else {
        for(var i = 0; i < technology_devices_stats.length; i++){
            if(technology_devices_stats[i].country == td_Country && technology_devices_stats[i].year == td_Year){
                return res.sendStatus(409);
            }
        }
        technology_devices_stats.push(tdBody);
        res.sendStatus(201, "CREATED");

    }
});



//Elemento
app.post(BASE_API_URL + url_jaime + "/:country/:year",(req,res)=>{

    res.sendStatus(405, "Method not allowed");

});



//DELETE

//Conjunto
app.delete(BASE_API_URL + url_jaime, (req, res)=>{
    technology_devices_stats = [];
    res.sendStatus(200, "OK");
});


//Elemento
app.delete(BASE_API_URL + url_jaime+ "/:country/:year", (req, res)=>{
    var tdCountry = req.params.country;
    var tdYear = req.params.year;
    var original = technology_devices_stats;

    technology_devices_stats = technology_devices_stats.filter((td)=>{
        return (td.country != tdCountry || td.year != tdYear);
    });

    if(technology_devices_stats.length == original.length){
        res.sendStatus(404, "NOT FOUND");
    } else {
        res.sendStatus(200, "OK");
    }
    
    
});


//PUT

//CONJUNTO
app.put(BASE_API_URL + url_jaime, (req,res)=>{
    res.sendStatus(405,"Unabe to PUT a resource list");
});

//ELEMENTO

app.put(BASE_API_URL + url_jaime + "/:country/:year", (req,res)=>{
    var td_params = req.params;         
    var td_body = req.body;

    var tdCountry = td_params.country;
    var tdYear = td_params.year;

    if(!td_body.country || !td_body.year || !td_body.tdwasted || !td_body.mpdisuse || !td_body.mpreused){
        console.log("Data is missing or incorrect");
        return res.sendStatus(400);
        

    } else {
        for(var i = 0; i < technology_devices_stats.length; i++){
            if(technology_devices_stats[i].country == tdCountry && technology_devices_stats[i].year == tdYear){
                technology_devices_stats[i] = td_body;
                console.log(technology_devices_stats[i].body);
                break;
            }
        }
        res.sendStatus(200, "OK");
    }
});

//-----------------------------------------------------------------------------

app.use("/", express.static('public'));

backend_crypto(app) // FALTA POR IMPLEMENTAR LA BASE DE DATOS

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