const req = require("express/lib/request");

module.exports = (app) => {

const bodyParser = require("body-parser");

//URL 
const BASE_API_URL= "/api/v1";
const url_sergio = "/cryptocoin-stats";
const API_DOC_CC = "https://documenter.getpostman.com/view/19481690/UVyn1ycR";

// https://documenter.getpostman.com/view/19481690/UVyn1ycR

app.use(bodyParser.json());

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
        "country": "russia",
        "year": 2021,
        "ccelectr": 943.075,
        "ccdemand": 14.92,
        "ccmining": 11.23
    },
    {
        "country": "russia",
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
    }

];

const cryptocoinstats2 = [
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
        "country": "russia",
        "year": 2021,
        "ccelectr": 943.075,
        "ccdemand": 14.92,
        "ccmining": 11.23
    },
    {
        "country": "russia",
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
    }

];




app.get(BASE_API_URL + url_sergio +"/docs", (req,res) => {
    res.redirect(API_DOC_CC);
});

//Load inicial - Sergio
app.get(BASE_API_URL + url_sergio + "/loadInitialData", (req,res)=> {
    var crypto = cryptocoinstats.length;
    if (crypto == 0){
        cryptocoinstats = cryptocoinstats2;
        res.redirect(BASE_API_URL + url_sergio);
    } else {
        res.sendStatus(409, "Conflict");        // Ya hay datos en el repositorio
    }
})

// GET - CONJUNTO
app.get(BASE_API_URL + url_sergio,(req,res)=>{
    res.status(200);
    res.send(JSON.stringify(cryptocoinstats,null,2));

});




// GET - PAISES CONCRETOS
app.get(BASE_API_URL + url_sergio + "/:country", (req, res)=>{
    var ccCountry = req.params.country;

    filteredCrypto = cryptocoinstats.filter((cryptocoinstats)=>{
        return (cryptocoinstats.country == ccCountry);
    });

    if(filteredCrypto == 0){
        res.sendStatus(404, "NOT FOUND");
    }else{
        res.status(200);
        res.send(JSON.stringify(filteredCrypto,null,2)); 

    }

});

// GET - AÑO CONCRETO
app.get(BASE_API_URL + url_sergio + "?:year", (req, res)=>{
    var ccYear = req.params.year;

    filteredCrypto = cryptocoinstats.filter((cryptocoinstats)=>{
        return (cryptocoinstats.year == ccYear);
    });

    if(filteredCrypto == 0){
        res.sendStatus(404, "NOT FOUND");
    }else{
        res.status(200);
        res.send(JSON.stringify(filteredCrypto,null,2)); 

    }

});



// GET - ELEMENTO CONCRETO
app.get(BASE_API_URL + url_sergio + "/:country/:year", (req, res)=>{
    var ccCountry = req.params.country;
    var ccYear = req.params.year;


    filteredCrypto = cryptocoinstats.filter((cryptocoinstats)=>{
        return (cryptocoinstats.country == ccCountry && cryptocoinstats.year == ccYear );
    });

    if(filteredCrypto == 0){
        res.sendStatus(404, "NOT FOUND");
    }else{
        res.status(200);
        res.send(JSON.stringify(filteredCrypto[0],null,2)); 
        //Por si acaso hay mas de 1 elemento (no debería)
        //se escoge el primero
    }

});

// POST - CONJUNTO
app.post(BASE_API_URL + url_sergio,(req,res)=>{
    cc_body = req.body;
    cc_country = req.body.country;
    cc_year = req.body.year;

    if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
        console.log("Data is missing or incorrect");
        return res.sendStatus(400);
        // Un dato pasado con un POST debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

    } else {
        for(var i = 0; i < cryptocoinstats.length; i++){
            if(cryptocoinstats[i].country == cc_country && cryptocoinstats[i].year == cc_year){
                return res.sendStatus(409);
            }
        }
        cryptocoinstats.push(req.body);
        res.sendStatus(201, "CREATED");

    }
});

// POST - ELEMENTO 
app.post(BASE_API_URL + url_sergio + "/:country/:year",(req,res)=>{
    res.sendStatus(405, "Unable to POST a element");
});


// DELETE - CONJUNTO
app.delete(BASE_API_URL + url_sergio, (req, res)=>{
    cryptocoinstats = [];
    res.sendStatus(200, "OK");
});


// DELETE - ELEMENTO
app.delete(BASE_API_URL + url_sergio+ "/:country/:year", (req, res)=>{
    var ccCountry = req.params.country;
    var ccYear = req.params.year;
    var cc_body = req.body;
    var antiguo_array = cryptocoinstats;

    cryptocoinstats = cryptocoinstats.filter((cryptocoinstats)=>{
        return (cryptocoinstats.country != ccCountry || cryptocoinstats.year != ccYear);
    });

    if(cryptocoinstats.length == antiguo_array.length){
        res.sendStatus(404);
    } else {
        res.sendStatus(200, "OK");
    }
    
    
});

// PUT - CONJUNTO
app.put(BASE_API_URL + url_sergio, (req,res)=>{
    res.sendStatus(405,"Unabe to PUT a resource list");
});

// PUT - SUBCONJUNTO
app.put(BASE_API_URL + url_sergio + "/:country", (req,res)=>{
    res.sendStatus(405,"Unabe to PUT a resource list");
});

// PUT - ELEMENTO CONCRETO
app.put(BASE_API_URL + url_sergio + "/:country/:year", (req,res)=>{
    var cc_params = req.params;         // variable a actualizar
    var cc_body = req.body;             // recurso actualizado

    var ccCountry = req.params.country;
    var ccYear = req.params.year;

    if(!cc_body.country || !cc_body.year || !cc_body.ccelectr || !cc_body.ccmining || !cc_body.ccdemand){
        console.log("Data is missing or incorrect");
        return res.sendStatus(400);
        // Un dato pasado con un PUT debe contener el mismo id del recurso al que se especifica en la URL; en caso contrario se debe devolver el código 400.

    } else {
        for(var i = 0; i < cryptocoinstats.length; i++){
            if(cryptocoinstats[i].country == ccCountry && cryptocoinstats[i].year == ccYear){
                cryptocoinstats[i] = cc_body;
                console.log(cryptocoinstats[i].body);
                return res.sendStatus(200, "OK");
            }
        }
        res.sendStatus(404,"NOT FOUND");
        
    }
});

};