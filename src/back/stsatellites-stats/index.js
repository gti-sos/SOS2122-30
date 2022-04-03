const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();


const app = express();
const port = process.env.PORT || 8080;

//URLs
const BASE_API_URL= "/api/v1";
const s = "/stsatellites-stats";
const javier_doc = "https://documenter.getpostman.com/view/20110246/UVyn2yXJ";


//----------------------------------------------------------------------------------------------------


module.exports = (app) => {
    console.log("Exporting Cryptocoin Stats API");

    app.use(bodyParser.json());


    //Resource
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


    db.insert(satellites); //database initialized 
    res.send(JSON.stringify(satellites,null,2));


    //POSTMAN
    app.get(BASE_API_URL + s +"/docs", (req,res) => {
        res.redirect(javier_doc);
    });

    //Load inicial
    app.get(BASE_API_URL + s + "/loadInitialData", (req, res)=>{
    var Sat = satellites.length;
    if(Sat == 0){
        satellites = satellites_2;
        res.redirect(BASE_API_URL + s);
    }else{
        res.sendStatus(409, "Conflict");
    }


    //GET 

    //Conjunto
    app.get(BASE_API_URL + s, (req, res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((s)=>{
                return {country : s.country, year : s.year, quarter : s.quarter, ['st-launched'] : s['st-launched'], ['st-orbit'] : s['st-orbit'], ['st-destroyed'] : s['st-destroyed']};
                // It is needed to do a map to the db so the 'id' doesn't show up
            }),null,2));
        });
        
    });

    //Elemento
    app.get(BASE_API_URL + s + "/:country/:year/:quarter", (req, res)=>{
        var satYear = parseInt(req.params.year);
        var satCountry = req.params.country;
        var satQ = req.params.quarter;

        db.find({country : satCountry, year: satYear, quarter: satQ}, {_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET: "+ err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else{
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });

    });
    
    //POST

    //Conjunto
    app.post(BASE_API_URL + s, (req, res)=>{
        satBody = req.body;
        satCountry = req.body.country;
        satYear = parseInt(req.body.year);
        satQ = req.body.quarter;

        db.find({country : satCountry, year: satYear, quarter: satQ}, function(err,data){
            if(err,data){
                console.error("ERROR POST: "+err);
                res.sendStatus(500);
            }else{
                if(data.length == 0){
                    if(!satBody.country || !satBody.year || !satBody.quarter || !satBody['st-launched'] || !satBody['st-orbit'] || !satBody['st-destroyed']){
                        console.log("Data is missing or incorrect. Perhaps number of parameters is incorrect?");
                        return res.sendStatus(400);
                    }else{
                        db.insert(satBody);
                        return res.status(201).send(JSON.stringify(satBody,null,2));
                        // CANT SEPARATE "status" FROM "send" IN DIFFERENT LINES. CRASHES.
                    }
                }else{
                    console.log("Conflict");
                    res.sendStatus(409);
                }
            }
        });
    });
    
    //Elemento
    app.post(BASE_API_URL + s + "/:country/:year/:quarter",(req,res)=>{
        res.sendStatus(405, "Method not allowed");
    });

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

    if(!satBody.country || !satBody.year || !satBody.quarter || !satBody['st-launched'] || !satBody['st-orbit'] || !satBody['st-destroyed']){
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
}