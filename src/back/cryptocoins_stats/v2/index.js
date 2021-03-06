const req = require("express/lib/request");
const DataStore = require("nedb");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require('cors');
const express = require("express");

const app = express();

app.use(cors());

var db = new DataStore();

    //URL 
const BASE_API_URL= "/api/v2";
const url_sergio = "/cryptocoin-stats";
const API_DOC_CC = "https://documenter.getpostman.com/view/19481690/UVyn1ycR";


// PROXY  SOS-27
var paths='/remoteAPI';
var apiServerHost = 'https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats';

app.use(paths, function(req, res) {
    var url = apiServerHost + req.url;
    console.log('piped: ' + req.url);
    req.pipe(request(url)).pipe(res);
  });

module.exports= (app) => {
    console.log("Exporting Cryptocoin Stats API");
    

    app.use(bodyParser.json());

    // resource variable
    var cryptocoinstats = [
        {
            "country": "eeuu",
            "year": 2021,
            "ccelectr": 3894.83,
            "ccdemand": 14.92,
            "ccmining": 35.40
        },
        {
            "country": "eeuu",
            "year": 2020,
            "ccelectr": 3843.8,
            "ccdemand": 8.68,
            "ccmining": 10.41
        },
        {
            "country": "rusia",
            "year": 2021,
            "ccelectr": 943.075,
            "ccdemand": 14.92,
            "ccmining": 11.23
        },
        {
            "country": "rusia",
            "year": 2020,
            "ccelectr": 943.1,
            "ccdemand": 8.68,
            "ccmining": 7.16
        },
        {
            "country": "china",
            "year": 2021,
            "ccelectr": 6875.09,
            "ccdemand": 14.92,
            "ccmining": 43.98
        },
        {
            "country": "china",
            "year": 2020,
            "ccelectr": 6875.1,
            "ccdemand": 8.68,
            "ccmining": 53.27
        },
        {
            "country": "españa",
            "year": 2020,
            "ccelectr": 413.6,
            "ccdemand": 5.68,
            "ccmining": 10.27
        },
        {
            "country": "españa",
            "year": 2021,
            "ccelectr": 643.1,
            "ccdemand": 5.69,
            "ccmining": 24.99
        }

    ];

    

    db.insert(cryptocoinstats); //database initialized 
 
    // Redirect to POSTMAN
    app.get(BASE_API_URL + url_sergio +"/docs", (req,res) => {
        res.redirect(API_DOC_CC);
    });


    //Initial Load - Crypto
    app.get(BASE_API_URL + url_sergio + "/loadInitialData", (req,res)=> {
            db.remove({},{multi:true},function(err,data){
            });
            var cryptocoIni = [
            {
                "country": "eeuu",
                "year": 2021,
                "ccelectr": 3894.83,
                "ccdemand": 14.92,
                "ccmining": 35.40
            },
            {
                "country": "eeuu",
                "year": 2020,
                "ccelectr": 3843.8,
                "ccdemand": 8.68,
                "ccmining": 10.41
            },
            {
                "country": "rusia",
                "year": 2021,
                "ccelectr": 943.075,
                "ccdemand": 14.92,
                "ccmining": 11.23
            },
            {
                "country": "rusia",
                "year": 2020,
                "ccelectr": 943.1,
                "ccdemand": 8.68,
                "ccmining": 7.16
            },
            {
                "country": "china",
                "year": 2021,
                "ccelectr": 6875.09,
                "ccdemand": 14.92,
                "ccmining": 43.98
            },
            {
                "country": "china",
                "year": 2020,
                "ccelectr": 6875.1,
                "ccdemand": 8.68,
                "ccmining": 53.27
            },
            {
                "country": "españa",
                "year": 2020,
                "ccelectr": 413.6,
                "ccdemand": 5.68,
                "ccmining": 10.27
            },
            {
                "country": "españa",
                "year": 2021,
                "ccelectr": 643.1,
                "ccdemand": 5.69,
                "ccmining": 24.99
            }
    
        ];
            db.insert(cryptocoIni);
            res.send(JSON.stringify(cryptocoIni,null,2));
    });

// USO DEL PROXY


      
/*
    // GET - RESOURCE
    app.get(BASE_API_URL + url_sergio,(req,res)=>{
        db.find({}, function(err,docs){
            res.send(JSON.stringify(docs.map((c)=>{
                return {country : c.country, year : c.year, ccelectr : c.ccelectr, ccdemand : c.ccdemand, ccmining : c.ccdemand};
                // It is needed to do a map to the db so the 'id' doesn't show up
            }),null,2));
        });
        

    });
*/

//          ALTERNATIVE GET RESOURCE    --      PAGINACION  
    app.get(BASE_API_URL + url_sergio,(req,res)=>{
        var query = req.query;
        var dbInit = {};
        var offset = parseInt(query.offset);
        var limit = parseInt(query.limit);

        // PARSERS
        if(query.country) dbInit["country"] = query.country;
        if(query.year) dbInit["year"] = parseInt(query.year);
        if(query.ccelectr) dbInit["ccelectr"] = parseFloat(query.ccelectr);
        if(query.ccdemand) dbInit["ccdemand"] = parseFloat(query.ccdemand);
        if(query.ccmining) dbInit["ccmining"] = parseFloat(query.ccmining);

        // 1 --> regular order
        // -1 --> reverse order
        db.find(dbInit).sort({country:1,year:-1}).skip(offset).limit(limit).exec((error,cryptocoin)=>{
            cryptocoin.forEach((c)=>{
                delete c._id
            });
            res.status(200);
            res.send(JSON.stringify(cryptocoin,null,2));
            console.log("GET REQUEST have been sent.")

        });
 
    });



    // GET - SUBREPOSITORY - COUNTRY
    app.get(BASE_API_URL + url_sergio + "/:country", (req, res)=>{ 
        var ccCountry = req.params.country;

        db.find({country : ccCountry},{_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET"+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data,null,2));
                    res.status(200);
                } else {
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });

    });


    // GET - ELEMENT
    app.get(BASE_API_URL + url_sergio + "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        console.log(ccYear);

        db.find({country : ccCountry, year: ccYear}, {_id:0}, function(err,data){
            if(err){
                console.error("ERROR GET: "+err);
                res.sendStatus(500);
            } else {
                if(data.length != 0){
                    res.send(JSON.stringify(data[0],null,2));
                    res.status(200);
                } else{
                    console.error("Data not found");
                    res.status(404);
                    res.send("Data not found");
                    
                }
            }
        });
        


    });

    // POST - RESOURCE
    app.post(BASE_API_URL + url_sergio,(req,res)=>{
        
        cc_body = req.body;
        cc_country = req.body.country;
        cc_year = parseInt(req.body.year);

        db.find({country: cc_country, year: cc_year}, function(err,data){
            if(err){
                console.error("ERROR POST: "+err);
                res.sendStatus(500);
            } else {
                if(data.length == 0){
                    if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
                        console.log("Data is missing or incorrect. Perhaps number of parameters is incorrect?");
                        return res.sendStatus(400);
                    } else {
                        db.insert(cc_body);
                        return res.status(201).send(JSON.stringify(cc_body,null,2));
                        // CANT SEPARATE "status" FROM "send" IN DIFFERENT LINES. CRASHES.
                    }
                } else {
                    console.log("Conflict");
                    res.sendStatus(409);
                 }
            }
        });
    });

    // POST - ELEMENT (405) 
    app.post(BASE_API_URL + url_sergio + "/:country/:year",(req,res)=>{
        res.sendStatus(405, "Unable to POST a element");
    });


    // DELETE - RESOURCE
    app.delete(BASE_API_URL + url_sergio, (req, res)=>{
        db.remove({},{multi:true}, function (err,dbRemoved){
            if(err || dbRemoved == 0){
                console.log("ERROR IN DELETING DB:"+err);
                res.sendStatus(500);
            } else{
                console.log("The database has been successfully removed.");
                res.sendStatus(200);
            }
        });
    });


    // DELETE - ELEMENT
    app.delete(BASE_API_URL + url_sergio+ "/:country/:year", (req, res)=>{
        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        db.remove({country : ccCountry, year : ccYear},{multi:true},function(err,data){
            if(err){
                res.sendStatus(500, "Internal Server Error");
            } else if(data == 0){
                res.status(404);
                res.send("Data not found");
            } else {
                console.log("DELETE REQUEST");
                res.status(200).send("All data with "+ccCountry+" and "+ccYear+" has been removed.")
            }
        });
        
        
    });

    // PUT - RESOURCE
    app.put(BASE_API_URL + url_sergio, (req,res)=>{
        res.sendStatus(405,"Unabe to PUT a resource list");
    });

    // PUT - SUBRESOURCE
    app.put(BASE_API_URL + url_sergio + "/:country", (req,res)=>{
        res.sendStatus(405,"Unable to PUT a resource list");
    });

    app.put(BASE_API_URL + url_sergio +"?year", (req,res)=>{

    })

    // PUT - ELEMENT
    app.put(BASE_API_URL + url_sergio + "/:country/:year", (req,res)=>{
        var cc_body = req.body;             // resource updated

        var ccCountry = req.params.country;
        var ccYear = parseInt(req.params.year);

        if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
            console.log("Data is missing or incorrect");
            return res.sendStatus(400);
            // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

        } else {
            db.update({$and: [{country:ccCountry},{year:ccYear}]}, {$set:cc_body},{},function(err,data){
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    if(data == 0){
                        console.log("Data not found");
                        res.sendStatus(404,"Data not found");
                    } else {
                        console.log("Data updated.");
                        res.sendStatus(200,"Element successfully updated.");
                    }
                }
            });
            
        }
    });

};