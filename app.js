const express = require('express')
const app = express()  
const bodyParser = require('body-parser')  
const mongoose = require('mongoose');
const configDB = require('./config/database.js');
mongoose.connect(configDB.url);

mongoose.connection.once('open', function(){
   console.log('connection has been made, now make fireworks....');
}).on('error', function(error){
    console.log('connection error:', error);
});

const Radio = require('./models/radio');
const User = require('./models/user');

app.use(bodyParser.json())


// routes
app.get("/api/radiodata", (req,res) => {
    Radio.find(function (err, radiodata) {
        console.log(radiodata)
        res.send({ radiodata: radiodata})
    })
});

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

app.post("/api/securecontent", (req, res) => {
    console.log('securecontent backend post route');
    console.log(req.body.securedContent)
    console.log(req.body.channell)
    var channelforsecuredcontent = req.body.channell
    Radio.findOne({ radioname: channelforsecuredcontent}, function (err, radio) {
        console.log(radio)
        radio.securecontent.push(req.body.securedContent);
        radio.save();
    });
});

app.get("/api/securecontent", (req, res) => {
    console.log('securecontent backend get route');
    Radio.findOne({ radioname: 'Radio Wien'}, function (err, radio) {
        console.log(radio)
        res.send({ secureContent: radio.securecontent })
    });
});

app.post("/api/deletechannel", (req, res) => {
    console.log('deletechannel backend post route');
    console.log(req.body.deletedChannel)
    var channel = req.body.deletedChannel
    console.log(channel)
    Radio.findOneAndRemove({ radioname: channel}, function (err, radio) {
        console.log(radio)
    })
});

app.post("/api/deleteuser", (req, res) => {
    console.log('deleteuser backend post route');
    console.log(req.body.deletedUser)
    var theuser = req.body.deletedUser
    console.log(theuser)
    User.findOneAndRemove({ username: theuser}, function (err, user) {
        console.log(user)
    })
});

app.get("/api/userdata", (req, res) => {
  async function asyncCall() {
    const result = await User.find();
    // const result = 'dummy data'
    console.log(result);
    res.send({ allusers: result})
  }
  asyncCall();
});



//handle production
    //Static folder
    app.use(express.static(__dirname + '/dist/'));
    
    //Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/dist/index.html'));


var server = app.listen(4000, '46.101.174.202');   
  console.log("App listening on port 4000 on 46.101.174.202");
