function goHome(){
    window.location.href='/app/index.html'
}

function goLeaderboard(){
    window.location.href='/leaderboard/index.html'
}

function login(){
    window.location.href='/account/index.html'
}

function signup(){
    window.location.href='/account/index.html'
}

function hover(id){
    document.getElementById(id).style.backgroundColor = "rgba(16, 110, 187)";
}

function unhover(id){
    document.getElementById(id).style.backgroundColor = "";
}

function profile(){
    window.location.href = '/profile/index.html';
}

function checkUser(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let login = document.getElementById('login');
            if(httpRequest.responseText != "guest"){
                login.innerHTML = "PROFILE";
                login.setAttribute("onClick","profile()")
                user = "user";
            }else{
                login.innerHTML = "LOGIN";
                login.setAttribute("onClick","login()")
            }
        }else { 
            alert('Response failure'); }
        }
    }
    let url = '/get/user';
    httpRequest.open('GET', url);
    httpRequest.send();
}
checkUser();

let score = 0;
let pb = 0;
let correctSquares = [];
let curr_index = 0;
let allowGuessing = false;
let game_started = false;
let gameover = false;
let user = "guest";

function startGame(){
    if(curr_index == 0){
        getScores();
    }
    if(!game_started || gameover){
        game_started = true;
        document.getElementById("current_score").innerHTML = "Current Score: "+score;
        document.getElementById("not_started").style.visibility = "hidden";
        document.getElementById("game_started").style.visibility = "visible";
        let newSquare = Math.floor(Math.random()*9);
        correctSquares.push(newSquare);
        highlightSquares(); 
    }
}

function highlightSquares(){
    if(curr_index == correctSquares.length){
        allowGuessing = true;
        curr_index = 0;
    }else{
        setTimeout(function(){
            document.getElementById("square_"+correctSquares[curr_index]).style.backgroundColor = "white";
            setTimeout(function(){
                document.getElementById("square_"+correctSquares[curr_index]).style.backgroundColor = "rgb(91, 178, 236)";
                curr_index++
                highlightSquares();
            },250);
        },250);
    }
}

function guess(num){
    // Stop unneccessary clicking when answer is showing
    if(allowGuessing){
        let guess = "square_"+num;
        if(correctSquares[curr_index] == num){
            document.getElementById("square_"+correctSquares[curr_index]).style.backgroundColor = "white";
            setTimeout(function(){
                document.getElementById("square_"+correctSquares[curr_index]).style.backgroundColor = "rgb(91, 178, 236)";
                curr_index++;
                if(curr_index == correctSquares.length){
                    setTimeout(function(){
                        game_started = false;
                        allowGuessing = false;
                        score++;
                        curr_index = 0;
                        reset_squares();
                        startGame();
                    },250);
                }
            },250)
        }else{
            sendScores();
            document.getElementById("not_started").style.visibility = "visible";
            document.getElementById("game_started").style.visibility = "hidden";
            document.getElementById("title").innerHTML = "Score: " + score;
            document.getElementById("desc_1").innerHTML = "";
            document.getElementById("desc_2").innerHTML = "Click anywhere to try again.";
            document.getElementById("clickBox").setAttribute("onClick", "restart()");
            allowGuessing = false;
            correctSquares = [];
            curr_index = 0;
            score = 0;
        }
    }
}

function restart(){
    game_started = false;
    document.getElementById("clickBox").setAttribute("onClick", "startGame()");
}

function reset_squares(){
    for(let x = 0; x < 9; x++){
        document.getElementById("square_"+x).style.backgroundColor = "rgb(91, 178, 236)";
    }
}

function sendScores(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
            } else { alert('Response failure'); }
        }
    }
    newObject = { 'score':score}
    dataString = JSON.stringify(newObject);
    let url = '/sequenceScores/';
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(dataString);
}

function getScores() {
    if(user == "guest"){
        document.getElementById("pb").innerHTML = "Personal Best: " + pb;
    }
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let scores = httpRequest.responseText;
                if(scores == "undefined" || scores == "10000000"){
                    pb = 0;
                }else{
                    pb = scores;
                }
                document.getElementById("pb").innerHTML = "Personal Best: " + pb;
            } else { alert('Response failure'); }
        }
    }
    let url = '/get/sequenceScores/';
    httpRequest.open('GET', url);
    httpRequest.send();
}

function logout(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let login = document.getElementById('login');
            document.getElementById("signup").innerHTML = "SIGN UP"
            document.getElementById("signup").setAttribute("onClick","signup()")
            login.innerHTML = "LOGIN";
            login.setAttribute("onClick","login()")
        }else { 
            alert('Response failure'); }
        }
    }
    let url = '/account/logout';
    httpRequest.open('GET', url);
    httpRequest.send();
}