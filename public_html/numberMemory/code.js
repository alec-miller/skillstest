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

let running = false;
let valToGuess = "";
let score = 1;
var justRan = false;
let pb;

function startGame(){
    if(score == 1){
        getScores();
    }
    if(!running){
        let t = document.getElementById("title");
        let c = document.getElementById("clickbox");
        let d1 = document.getElementById("desc_1");
        let d2 = document.getElementById("desc_2");
        document.getElementById("current_score").innerHTML = "Current Score: " + (score-1);
        d1.innerHTML = "";
        d2.innerHTML = "";
        for(let x=0; x<score;x++){
            valToGuess += Math.floor(Math.random()*10);
        }
        t.innerHTML = valToGuess;
        createProgressbar("timer","2s");
        // Wait 2 seconds for user to memorize, then quiz them.
        setTimeout(function(){
            running = false;
            answerBox = document.getElementById('clickBox');
            answerBox.setAttribute("onclick", "");
            bar = document.getElementById('inner');
            bar.remove();
            t.innerHTML = "What was the number?"
            var input = document.createElement('input');
            var btn = document.createElement('input');
            var br = document.createElement('br');
            input.type = 'text';
            input.id = 'input';
            // Lets user press enter to submit
            input.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    document.getElementById("btn").click();
                }
            });
            btn.type = 'button';
            btn.value = 'Submit';
            btn.id = 'btn';
            btn.setAttribute("onclick","checkAnswer()");
            answerBox.appendChild(input);
            answerBox.appendChild(br);
            answerBox.appendChild(btn);
        },2000)
    }
}

function checkAnswer(){
    let guess = document.getElementById("input").value;
    document.getElementById("input").remove();
    document.getElementById("btn").remove();
    if(guess == valToGuess){
        valToGuess = "";
        score++;
        startGame();
    }else{
        document.getElementById("title").innerHTML = "";
        document.getElementById("clickBox").style.backgroundColor = "#f23729"
        setTimeout(function(){
            running = false;
            justRan = false;
            document.getElementById("clickBox").style.backgroundColor = "rgb(196, 191, 191)"
            document.getElementById("title").innerHTML = "Your Score: " + (score-1);
            document.getElementById("desc_1").innerHTML = "Correct Answer: " + valToGuess;
            document.getElementById("desc_2").innerHTML = "Your Answer: " + guess;
            score = 1;
            valToGuess = "";
            document.getElementById("clickBox").setAttribute("onClick", "startGame()");
        }, 150);
        sendScores();
    }
}

let prev = "";
function createProgressbar(id, duration, callback) {
    running = true;
    var progressbar = document.getElementById(id);
    progressbar.className = 'timer';
    var progressbarinner = document.createElement('div');
    progressbarinner.className = 'inner';
    progressbarinner.id = 'inner';
    progressbarinner.style.animationDuration = duration;
  
    if (typeof(callback) === 'function') {
      progressbarinner.addEventListener('animationend', callback);
    }
    progressbar.appendChild(progressbarinner);
    progressbarinner.style.animationPlayState = 'running';
    prev = progressbarinner;
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
    newObject = { 'score':(score-1)}
    dataString = JSON.stringify(newObject);
    let url = '/numberScores/';
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-type', 'application/json');
    httpRequest.send(dataString);
}

function getScores() {
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
    let url = '/get/numberScores/';
    httpRequest.open('GET', url);
    httpRequest.send();
  }