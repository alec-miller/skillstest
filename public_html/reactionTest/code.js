/*

Reaction test
-------------------
The user is prompted with a box to click when ready, when clicked, the box turns
red and says "wait for green", once the box turns green the user must click as
fast as they can. They do this 5 times and their average reaction time over those
5 clicks are shown.

*/

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

let started = false;
let earlyClick = false;
let startTime;
let endTime;
let count = 0;
let waiting = true;
let totalTime = 0;
let pba;
let score = 0;
let pbc;
let curr_scores = [];

function startGame(){
    if(count == 0){getScores();}
    let b = document.getElementById("clickBox");
    let t = document.getElementById("title");
    let d1 = document.getElementById("desc_1");
    let d2 = document.getElementById("desc_2");
    document.getElementById("current_score").innerHTML = "Current Average: " + score;
    if(count < 5){
        if(!started){
            started = true;
            b.style.backgroundColor = "#e64c4c";
            t.innerText = "...";
            d1.innerText = "Wait for green.";
            d2.innerText = "";
            let wait = Math.floor(Math.random() * 5000) + 1;
            setTimeout(function(){
                if(waiting = true){
                    if(earlyClick){
                        earlyClick = false;
                    }else{
                        b.style.backgroundColor = "#67c96a"
                        d1.innerText = "Click!";
                        waiting = false;
                        let date1 = new Date;
                        startTime = date1.getTime();
                    }
                }
            },wait);
            waiting = true;
        }else{
            if(waiting){
                b.style.backgroundColor = "rgb(196, 191, 191)";
                t.innerText = "Too soon";
                d1.innerText = "Click to try again";
                waiting = false;
                earlyClick = true;
                started = false;
            }else{
                let date2 = new Date();
                endTime = date2.getTime();
                let reactionTime = endTime - startTime;
                b.style.backgroundColor = "rgb(196, 191, 191)";
                t.innerText = reactionTime;
                d1.innerText = "Click to continue"
                count++;
                curr_scores.push(reactionTime);
                totalTime += reactionTime;
                score = Math.floor(totalTime / count);
                started = false;
            }
        }
    }else{
        sendScores();
        t.innerText = "Average reaction time: " + Math.floor(totalTime/5) + "ms";
        d1.innerText = "Click to try again";
        count = 0;
        score = 0;
        totalTime = 0;
        started = false;
        earlyClick = false;
        waiting = true;
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
    newObject = { 'average':score, 'scores':curr_scores}
    dataString = JSON.stringify(newObject);
    let url = '/reactionScores/';
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
                console.log(httpRequest.responseText);
                let scores = httpRequest.responseText.split(" ");
                if(scores[0] == "undefined" || scores[0] == "10000000"){
                    pba = 0;
                }else{
                    pba = scores[0];
                }
                document.getElementById("pba").innerHTML = "Personal Best Average: " + pba;
                if(scores[1] == "undefined" || scores[1] == "10000000"){
                    pbc = 0;
                }else{
                    pbc = scores[1];
                }
                document.getElementById("pbc").innerHTML = "Personal Best Click: " + pbc;
            } else { alert('Response failure'); }
        }
    }
    let url = '/get/reactionScores/';
    httpRequest.open('GET', url);
    httpRequest.send();
  }