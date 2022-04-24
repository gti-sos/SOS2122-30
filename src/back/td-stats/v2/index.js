const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
var db = new DataStore();

const BASE_API_URL= "/api/v2";
const url_jaime = "/technology_devices_stats";
const jaime_URL_API = "https://documenter.getpostman.com/view/19584746/UVyoUwqe";

module.exports = (app) => {
    console.log("Exporting E-waste Stats");

    app.use(bodyParser.json());
    

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

    db.insert(technology_devices_stats);

    /***/
    app.get(BASE_API_URL + url_jaime +"/docs", (req,res) => {
        res.redirect(jaime_URL_API);
    });


    //LOAD INICIAL
    app.get(BASE_API_URL + url_jaime + "/loadInitialData", (req,res)=>{
        db.remove({},{multi:true},function(err,data){
        });
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
        db.insert(technology_devices_stats);
        res.send(JSON.stringify(technology_devices_stats,null,2));
    });

    //GET 

    //Conjunto
    app.get(BASE_API_URL + url_jaime,(req,res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((m)=>{
                return {country : m.country, year : m.year, tdwasted : m.tdwasted, mpdisuse : m.mpdisuse, mpreused : m.mpreused};
            }),null,2));
        });
    });

    //Elemento
    app.get(BASE_API_URL + url_jaime + "/:country/:year", (req, res)=>{
        var tdYear = parseInt(req.params.year);
        var tdCountry = req.params.country;


        db.find({country : tdCountry, year: tdYear}, {_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET: "+ err);
                res.sendStatus(500, "Internal Server Error");
            }else {
                if(data.length != 0){
                    res.send(JSON.stringify(data[0],null,2));
                    res.status(200);
                } else{
                    res.status(404);
                    res.send("Data not found");
                }
            }
        });

    });


    //POST

    //Conjunto
    app.post(BASE_API_URL + url_jaime,(req, res)=>{
        tdBody = req.body;
        tdCountry = req.body.country;
        tdYear = parseInt(req.body.year);
        

        db.find({country : tdCountry, year: tdYear}, function(err,data){
            if(err){
                console.error("ERROR POST: "+ err);
                res.sendStatus(500, "Internal Server Error");
            }else{
                if(data.length == 0){
                    if(!tdBody.country || !tdBody.year || !tdBody.tdwasted || !tdBody.mpdisuse || !tdBody.mpreused){
                        console.log("Data is missing or incorrect.");
                        return res.sendStatus(400, "Bad Request");
                    }else{
                        db.insert(tdBody);
                        return res.status(201).send(JSON.stringify(tdBody,null,2));
                    }
                }else{
                    console.log("DATA ALREADY EXISTS");
                    res.sendStatus(409);
                }
            }
        });
    });


    //Elemento
    app.post(BASE_API_URL + url_jaime + "/:country/:year",(req,res)=>{

        res.sendStatus(405, "Method not allowed");

    });


    //DELETE

    //Conjunto
    app.delete(BASE_API_URL + url_jaime, (req, res)=>{
        db.remove({},{multi:true}, function (err, dbRemoved){
            if(err || dbRemoved == 0){
                console.log("ERROR IN DELETING DB:" + err);
                res.sendStatus(500, "Internal Server Error");
            }else{
                console.log("Successfully removed");
                res.sendStatus(200);
            }
        });
    });


    //Elemento
    app.delete(BASE_API_URL + url_jaime+ "/:country/:year", (req, res)=>{
        var tdCountry = req.params.country;
        var tdYear = parseInt(req.params.year);
        
        db.remove({country : tdCountry, year: tdYear},{multi:true}, function(err,data){
            if(err){
                res.sendStatus(500, "Internal Server Error");
            }else if(data == 0){
                res.status(404);
                res.send("Data not found");
            }else{
                res.sendStatus(200);
            }
        });
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
        var tdYear = parseInt(td_params.year);

        if(!td_body.country || !td_body.year || !td_body.tdwasted || !td_body.mpdisuse || !td_body.mpreused){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            

        } else {
            db.update({$and: [{country : tdCountry}, {year: tdYear}]}, {$set:td_body},
                function(err,data){
                if(err){
                    res.sendStatus(500, "Internal Server Error");
                }else{
                    if(data==0){
                        res.status(404);
                        res.send("Data not found");
                    }else{  
                        res.sendStatus(200, "OK");
                    }
                }
            });    
        }
    });

    
    //paginacion
    function paginacion(req, lista){
        var res = [];
        const limit = req.query.limit;
        const offset = req.query.offset;

        if(limit<1 || offset<0 || offset > lista.length){
            res.push("Error en el limit y/o offset");
            return res;
        }
        res = lista.slice(offset, parseint(limit) + parseint(offset));
        return res;
    }



    };