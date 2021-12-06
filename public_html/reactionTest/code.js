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
    window.location.href='/login/index.html'
}

function hover(id){
    document.getElementById(id).style.backgroundColor = "rgba(16, 110, 187)";
}

function unhover(id){
    document.getElementById(id).style.backgroundColor = "";
}

let started = false;
let earlyClick = false;
let startTime;
let endTime;
let count = 0;
let waiting = true;
let totalTime = 0;
let pba = 0;
let score = 0;
let pbc = 0

function startGame(){
    let b = document.getElementById("clickBox");
    let t = document.getElementById("title");
    let d1 = document.getElementById("desc_1");
    let d2 = document.getElementById("desc_2");
    document.getElementById("pba").innerHTML = "Personal Best Average: " + pba;
    document.getElementById("current_score").innerHTML = "Current Average: " + score;
    document.getElementById("pbc").innerHTML = "Personal Best Click: " + pbc;
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
                if(reactionTime < pbc){
                    pbc = Math.floor(reactionTime);
                }
                totalTime += reactionTime;
                score = Math.floor(totalTime / count);
                started = false;
            }
        }
    }else{
        if(Math.floor(totalTime/5) < pba || pba == 0){
            pba = Math.floor(totalTime/5);
        }
        t.innerText = "Average reaction time: " + Math.floor(totalTime/5) + "ms";
        d1.innerText = "Click to try again";
        count = 0;
        score = 0;
        started = false;
        earlyClick = false;
        waiting = true;
    }
}