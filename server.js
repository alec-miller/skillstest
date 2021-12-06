const express = require('express')
const mongoose = require('mongoose')
const parser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3000
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/skillstest'
var user = "guest";

mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    reactionTestAverages: [Number],
    reactionTestClicks: [Number],
    bestReactionTestAverage: Number,
    bestReactionTestClick: Number,
    numberMemoryScores: [Number],
    bestNumberMemoryScore: Number,
    sequenceMemoryScores: [Number],
    bestSequenceMemoryScore: Number,
    visualMemoryScores: [Number],
    bestVisualMemoryScore: Number,
});

const Users = mongoose.model('Users', usersSchema);

app.use( parser.text({type: '*/*'}) );
app.use(cookieParser());

var sessions = {};
const LOGIN_TIME = 600000000000000;

function filterSessions() {
    var now = Date.now();
    for (x in sessions) {
        time = sessions[x];
        if (time + LOGIN_TIME < now) {
        delete sessions[x];
        }
    }
}

setInterval(filterSessions, 2000);

app.use(express.static('public_html'))

function addSession(username) {
    var now = Date.now();
    sessions[username] = now;
}

function doesUserHaveSession(username) {
    return username in sessions;
}

function authenticate(req, res, next) {
    var c = req.cookies;
    if (c && c.login)  {
      var username = c.login.username;
      if (doesUserHaveSession(username)) {
        addSession(username);
        next();
      } else {
        res.redirect('/app/index.html');
      }
    } else {
      res.redirect('/app/index.html');
    }
  }

app.post('/account/create/:username/:password', function (req, res) {
    var count = 0;
    Users.find().exec((err, results)=>{
        results.forEach(function(error,num){
            if(results[num]["username"] === req.params.username){
                count = count + 1;
            }
        })
        if(count == 0){
            var newUser = new Users({
                username: req.params.username,
                password: req.params.password,
                bestReactionTestAverage: 10000000,
                bestReactionTestClick: 10000000,
                bestNumberMemoryScore: 0,
                bestSequenceMemoryScore: 0,
                bestVisualMemoryScore: 0
            });
            newUser.save(function (err) { if (err) console.log('FAIL'); });
            res.send("valid");
        }else{
            res.send("taken")
        }
    })
});

app.get('/account/login/:username/:password', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end('failed to login');
            } else if (results[num]["username"] === req.params.username) {
                if(results[num]["password"] === req.params.password){
                    user = results[num]["username"];
                    addSession(req.params.username);
                    res.cookie("login", {username: req.params.username}, {maxAge: LOGIN_TIME});
                    res.end('1');
                }else{
                    res.end('bad');
                }
            }
        });
    });
});

app.post('/reactionScores', (req, res) => {
    let requestData = JSON.parse( req.body );
    let average = requestData.average;
    let scores = requestData.scores;
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("guest");
            } else if (results[num]["username"] === user) {
                if(average < results[num]["bestReactionTestAverage"]){
                    results[num]["bestReactionTestAverage"] = average;
                }
                for(let x = 0; x < scores.length; x++){
                    if(scores[x] < results[num]["bestReactionTestClick"]){
                        results[num]["bestReactionTestClick"] = scores[x];
                    }
                    results[num]["reactionTestClicks"].push(scores[x]);
                }
                results[num]["reactionTestAverages"].push(average);
            }
            results[num].save(function (err) {if (err) console.log('FAIL');});
        });
    });
});

app.post('/numberScores', (req, res) => {
    let requestData = JSON.parse( req.body );
    let score = requestData.score;
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("guest");
            } else if (results[num]["username"] === user) {
                if(score > results[num]["bestNumberMemoryScore"]){
                    results[num]["bestNumberMemoryScore"] = score;
                }
                results[num]["numberMemoryScores"].push(score);
            }
            results[num].save(function (err) {if (err) console.log('FAIL');});
        });
    });
});

app.post('/sequenceScores', (req, res) => {
    let requestData = JSON.parse( req.body );
    let score = requestData.score;
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("guest");
            } else if (results[num]["username"] === user) {
                if(score > results[num]["bestSequenceMemoryScore"]){
                    results[num]["bestSequenceMemoryScore"] = score;
                }
                results[num]["sequenceMemoryScores"].push(score);
            }
            results[num].save(function (err) {if (err) console.log('FAIL');});
        });
    });
});

app.post('/visualScores', (req, res) => {
    let requestData = JSON.parse( req.body );
    let score = requestData.score;
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("guest");
            } else if (results[num]["username"] === user) {
                if(score > results[num]["bestVisualMemoryScore"]){
                    results[num]["bestVisualMemoryScore"] = score;
                }
                results[num]["visualMemoryScores"].push(score);
            }
            results[num].save(function (err) {if (err) console.log('FAIL');});
        });
    });
});

app.get('/get/reactionScores', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("Can't find user");
            } else if (results[num]["username"] === user) {
                let str = "" + results[num]["bestReactionTestAverage"] + " " + results[num]["bestReactionTestClick"];
                res.send(str);
            }
        });
    });
});

app.get('/get/numberScores', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("Can't find user");
            } else if (results[num]["username"] === user) {
                let str = "" + results[num]["bestNumberMemoryScore"] 
                res.send(str);
            }
        });
    });
});

app.get('/get/sequenceScores', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("Can't find user");
            } else if (results[num]["username"] === user) {
                let str = "" + results[num]["bestSequenceMemoryScore"]
                res.send(str);
            }
        });
    });
});

app.get('/get/visualScores', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("Can't find user");
            } else if (results[num]["username"] === user) { 
                let str = "" + results[num]["bestVisualMemoryScore"];
                res.send(str);
            }
        });
    });
});

app.get('/get/user', (req, res) => {
    res.send(user);
});

function clearDB(){
  Users.collection.drop();
}

app.listen(port, () => 
  console.log(`Server running.`))