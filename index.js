const cool = require("cool-ascii-faces");
const express = require("express");

//Para parsear el json
const bodyParser = require("body-parser");


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

var satellites_2 = [
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

//Parte de Jaime
var technology_devices_stats = [
    {
        country: "EEUU",
        year: 2019,
        tdwasted: 6918,
        mpdisuse: 220,
        mpreused: 74
    },
    {
        country: "Spain",
        year: 2019,
        tdwasted: 1450,
        mpdisuse: 45.4,
        mpreused: 89
    },
    {
        country: "UK",
        year: 2019,
        tdwasted: 2695,
        mpdisuse: 83.1,
        mpreused: 83
    },
    {
        country: "Germany",
        year: 2019,
        tdwasted: 2549,
        mpdisuse: 84.7,
        mpreused: 84
    },
    {
        country: "France",
        year: 2019,
        tdwasted: 2129,
        mpdisuse: 66.4,
        mpreused: 76
    },
    {
        country: "Canada",
        year: 2019,
        tdwasted: 739,
        mpdisuse: 22.5,
        mpreused: 70
    }

];

// Parte de Sergio
var cryptocoin_stats = [
    {
        "country": "EEUU",
        "year": 2021,
        "ccelectr": 3894.83,
        "ccdemand": 14.92,
        "ccmining": 35.40
    },
    {
        "country": "EEUU",
        "year": 2020,
        "ccelectr": 3843.8,
        "ccdemand": 8.68,
        "ccmining": 10.41
    },
    {
        "country": "RUSSIA",
        "year": 2021,
        "ccelectr": 943.075,
        "ccdemand": 14.92,
        "ccmining": 11.23
    },
    {
        "country": "RUSSIA",
        "year": 2020,
        "ccelectr": 943.1,
        "ccdemand": 8.68,
        "ccmining": 7.16
    },
    {
        "country": "CHINA",
        "year": 2021,
        "ccelectr": 6875.09,
        "ccdemand": 14.92,
        "ccmining": 43.98
    },
    {
        "country": "CHINA",
        "year": 2020,
        "ccelectr": 6875.1,
        "ccdemand": 8.68,
        "ccmining": 53.27
    }

];

//--------------------------------------------------------------
//Load inicial
app.get(BASE_API_URL + s + "/loadInitialData", (req, res)=>{
    var Sat = satellites.length;
    if(Sat == 0){
        res.send(JSON.stringify(satellites_2,null,2));
    }else{
        res.sendStatus(409, "Conflict");
    }
});


//--------------------------------------------------------------

//GET 

//Conjunto
app.get(BASE_API_URL + s, (req, res)=>{
    res.send(JSON.stringify(satellites,null,2));
});

app.get(BASE_API_URL +"/technology_devices_stats",(req,res)=>{
    res.send(JSON.stringify(technology_devices_stats,null,2));

});

app.get(BASE_API_URL +"/cryptocoin_stats",(req,res)=>{
    res.send(JSON.stringify(cryptocoin_stats,null,2));

});

//Elemento
app.get(BASE_API_URL + s + "/:name", (req, res)=>{
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

app.get(BASE_API_URL + "/cryptocoin_stats/:name", (req, res)=>{
    var cryYear = req.params.year;
    filteredCry = cryptocoin_stats.filter((cryptocoin_stats)=>{
        return (cryptocoin_stats.year == cryYear);
    });

    if(filteredCry == 0){
        res.sendStatus(404, "NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredCry[0],null,2)); 
    }

});

//POST

app.post(BASE_API_URL + s, (req, res)=>{
    satellites.push(req.body);
    res.sendStatus(201, "CREATED");
});

app.post(BASE_API_URL +"/technology_devices_stats",(req,res)=>{
    technology_devices_stats.push(req.body);

    res.sendStatus(201, "CREATED");

});

app.post(BASE_API_URL +"/cryptocoin_stats",(req,res)=>{
    cryptocoin_stats.push(req.body);

    res.sendStatus(201, "CREATED");

});

//DELETE

//Conjunto
app.delete(BASE_API_URL + s, (req, res)=>{
    satellites = [];
    res.sendStatus(200, "OK");
});

app.delete(BASE_API_URL + "/cryptocoin_stats", (req, res)=>{
    cryptocoin_stats = [];
    res.sendStatus(200, "OK");
});

//Elemento
app.delete(BASE_API_URL + s + "/:name", (req, res)=>{
    var satName = req.params.name;
    satellites = satellites.filter((satellite)=>{
        return (satellite.name != satName);
    });
    res.sendStatus(200, "OK");
});

app.delete(BASE_API_URL + "/cryptocoin_stats/:name", (req, res)=>{
    var satName = req.params.name;
    cryptocoin_stats = cryptocoin_stats.filter((cryptocoin_stats)=>{
        return (cryptocoin_stats.name != satName);
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