const express = require('express')

// creating an express instance
const app = express()  
const bodyParser = require('body-parser')  
const mongoose = require('mongoose');

const configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//check if connection has been established - hat keine spezielle funktion, nur die bestätigung dass alles passt
mongoose.connection.once('open', function(){
   console.log('connection has been made, now make fireworks....');
}).on('error', function(error){
    console.log('connection error:', error);
});


const Radio = require('./models/radio');

app.use(bodyParser.json())

// BLEIBT
app.post("/api/newradio", (req, res) => {
    console.log('newradio backend post route');
    console.log(req.body);
        let radio = new Radio({
        radioname: req.body.radiostation,
        radiourl: req.body.stationurl,
        nowplayingurl: req.body.nowplayingurl,
        radiocountry: req.body.stationcountry,
        radiolanguage: req.body.stationlanguage
        });
    console.log(radio);
    radio.save();
    res.status(201).send(radio);
    console.log(radio);
});

// BLEIBT
app.post("/api/securecontent", (req, res) => {
    console.log('securecontent backend post route');
    console.log(req.body.securedContent)    
    Radio.findOne({ radioname: 'Radio Wien'}, function (err, radio) {
        console.log(radio)
        radio.securecontent.push(req.body.securedContent);
        radio.save();
    });
});

// BLEIBT
app.get("/api/securecontent", (req, res) => {
    console.log('securecontent backend get route');
    Radio.findOne({ radioname: 'Radio Wien'}, function (err, radio) {
        console.log(radio)
        res.send({ secureContent: radio.securecontent })
    });
});

// BLEIBT
app.get("/api/radiodata", (req,res) => {
    Radio.find(function (err, radiodata) {
        console.log(radiodata)
        res.send({ radiodata: radiodata})
    })
});

app.listen(4000, () => {  
  console.log("App listening on port 4000")
})