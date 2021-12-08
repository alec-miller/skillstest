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

let numLeaderboards = [];
let rcLeaderboards = [];
let raLeaderboards = [];
let seqLeaderboards = [];
let visLeaderboards = [];

app.get('/get/leaderboard/:TYPE', (req, res) => {
    let type = req.params.TYPE;
    let find = '';
    let search = true;
    if(type == "number"){
        find = "bestNumberMemoryScore";
        if(numLeaderboards.length >= 199){
            search = false;
        }
    }else if(type == "reactionClick"){
        find = "bestReactionTestClick";
        if(rcLeaderboards.length >= 199){
            search = false;
        }
    }else if(type == "reactionAverage"){
        find = "bestReactionTestAverage";
        if(raLeaderboards.length >= 199){
            search = false;
        }
    }else if(type == "sequence"){
        find = "bestSequenceMemoryScore";
        if(seqLeaderboards.length >= 199){
            search = false;
        }
    }else if(type == "visual"){
        find = "bestVisualMemoryScore";
        if(visLeaderboards.length >= 199){
            search = false;
        }
    }
    if(find != '' && search){
        Users.find({}).exec( function (err, results) {
            let holder = {};
            let x = 0;
            let str = "";
            results.forEach(function(error,num){
                if (err) { 
                    return res.end("Can't find user");
                } else{
                    holder[results[num]["username"]] = results[num][find];
                }
            });
            var items = Object.keys(holder).map(function(key) {
                return [key, holder[key]];
            });

            items.sort(function(first, second) {
                return second[1] - first[1];
            });
            holder = items;
            if(type == "number"){
                while(holder[x] != undefined && x < 200){
                    numLeaderboards.push(holder[x]);
                    str += holder[x][0] + ":" + holder[x][1] + " ";
                    x++
                }
            }else if(type == "reactionClick"){
                while(holder[x] != undefined && x < 200){
                    rcLeaderboards.push(holder[x]);
                    str += holder[x][0] + ":" + holder[x][1] + " ";
                    x++
                }
            }else if(type == "reactionAverage"){
                while(holder[x] != undefined && x < 200){
                    raLeaderboards.push(holder[x]);
                    str += holder[x][0] + ":" + holder[x][1] + " ";
                    x++
                }
            }else if(type == "sequence"){
                while(holder[x] != undefined && x < 200){
                    seqLeaderboards.push(holder[x]);
                    str += holder[x][0] + ":" + holder[x][1] + " ";
                    x++
                }
            }else if(type == "visual"){
                while(holder[x] != undefined && x < 200){
                    visLeaderboards.push(holder[x]);
                    str += holder[x][0] + ":" + holder[x][1] + " ";
                    x++
                }
            }
            res.send(str);
        });
    }
});

app.get('/get/stats', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end("Can't find user");
            } else if (results[num]["username"] === user) {
                res.send('Best Number Memory Score:'+results[num]['bestNumberMemoryScore']+ "_" +
                    'All Number Memory Scores:'+results[num]['numberMemoryScores']+ "_" +
                    'Best Reaction Test Average:'+results[num]['bestReactionTestAverage']+ "_" +
                    'All Reaction Test Averages:'+results[num]['reactionTestAverages']+ "_" +
                    'Best Reaction Test Click:'+results[num]['bestReactionTestClick']+ "_" +
                    'All Reaction Test Clicks:'+results[num]['reactionTestClicks']+ "_" +
                    'Best Sequence Memory Score:'+results[num]['bestSequenceMemoryScore']+ "_" +
                    'All Sequence Memory Scores:'+results[num]['sequenceMemoryScores']+ "_" +
                    'Best Visual Memory Score:'+results[num]['bestVisualMemoryScore']+ "_" +
                    'All Visual Memory Scores:'+results[num]['visualMemoryScores']
                    );
            }
        });
    });
});

app.post('/account/search/:SEARCH', (req, res) => {
    user = req.params.SEARCH;
    res.send(user);
});

app.get('/get/user', (req, res) => {
    res.send(user);
});

app.get('/account/logout', (req, res) => {
    delete sessions[user];
    user = "guest";
    res.send();
});

function clearDB(){
  Users.collection.drop();
  let numLeaderboards = [];
  let rcLeaderboards = [];
  let raLeaderboards = [];
  let seqLeaderboards = [];
  let visLeaderboards = [];
}

app.listen(port, () => 
  console.log(`Server running.`))