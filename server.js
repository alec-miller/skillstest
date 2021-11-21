const express = require('express')
const mongoose = require('mongoose')
const parser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3000
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/oogla'
var user = null;

mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const itemsSchema = new mongoose.Schema({
    title: String,
    desc: String,
    image: String,
    price: Number,
    status: String
});
const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    listings: [itemsSchema],
    purchases: [itemsSchema] });

const Items = mongoose.model('Items', itemsSchema);
const Users = mongoose.model('Users', usersSchema);

app.use( parser.text({type: '*/*'}) );
app.use(cookieParser());

var sessions = {};
const LOGIN_TIME = 600000;

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

app.get('/login/*',authenticate);
app.use(express.static('public_html'))
app.get('/', (req, res) => { res.redirect('/app/index.html'); });

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

app.post('/app/create/:username/:password', function (req, res) {
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
                password: req.params.password
            });
            newUser.save(function (err) { if (err) console.log('FAIL'); });
            res.send("valid");
        }else{
            res.send("taken")
        }
    })
});

app.get('/app/login/:username/:password', (req, res) => {
    Users.find({}).exec( function (err, results) {
        results.forEach(function(error,num){
            if (err) { 
                return res.end('failed to login');
            } else if (results[num]["username"] === req.params.username) {
                if(results[num]["password"] === req.params.password){
                    user = results[num]["username"];
                    addSession(req.params.username);
                    res.cookie("login", {username: req.params.username}, {maxAge: 6000000});
                    res.end('1');
                }else{
                    res.end('bad');
                }
            }
        });
    });
});

app.post('/login/listing', function (req, res) {
    itemData = JSON.parse( req.body );
    var newItem = new Items({
        title: itemData.title,
        desc: itemData.desc,
        image: itemData.image,
        price: itemData.price,
        status: itemData.status
    });
    Users.find().exec((err, results)=>{
        results.forEach(function(error,num){
            if(results[num]["username"] === user){
                results[num]["listings"].push(newItem);
                results[num].save(function (err) {if (err) console.log('FAIL');});
            }
        })
    })
    newItem.save(function (err) {if (err) console.log('FAIL'); });
    res.send('SAVED');
});

app.get('/search/listings/:KEYWORD', (req, res) => {
    var str = "";
    var l = [];
    Items.find().exec((err, results)=>{
        results.forEach(function(error,num){
            if(results[num]["desc"].includes(req.params.KEYWORD)){
                str += JSON.stringify(results[num]);
                l.push(results[num]);
            }
        })
    res.end(JSON.stringify(l));
    })
});

app.get('/get/listings', (req, res) => {
    Users.find().exec((err, results)=>{
        results.forEach(function(error,num){
            if(results[num]["username"] === user){
                res.end(JSON.stringify(results[num]["listings"]));
            }
        })
    })
});

app.post('/sold/:ITEM', (req, res) => {
    let x;
    Items.find().exec((err, results)=>{
        results.forEach(function(error,num){
            if(results[num]["title"] === req.params.ITEM){
                x = results[num];
                results[num]["status"] = "SOLD";
                results[num].save(function (err) {if (err) console.log('FAIL');});
            }
        })
    })
    Users.find().exec((err, data)=>{
        data.forEach(function(error,val){
            if(data[val]["username"] === user){
                data[val]["purchases"].push(x);
                data[val].save(function (err) {if (err) console.log('FAIL');});
            };
            for(i in data[val]["listings"]){
                if(data[val]["listings"][i]["title"] === req.params.ITEM){
                    data[val]["listings"][i]["status"] = "SOLD";
                    data[val].save(function (err) {if (err) console.log("FAIL");});
                }
            }
        })
    })
});

app.get('/get/purchases', (req, res) => {
    Users.find().exec((err, results)=>{
        results.forEach(function(error,num){
            if(results[num]["username"] === user){
                res.end(JSON.stringify(results[num]["purchases"]));
            }
        })
    })
});

app.get('/get/user', (req, res) => {
    res.send(user);
});

function clearDB(){
  Users.collection.drop();
  Items.collection.drop();
}

app.listen(port, () => 
  console.log(`Server running.`))