function hover(num){
    let square = document.getElementById("square_" + num);
    let text = document.getElementById("skill_" + num);
    text.style.color = "#c78938";
    square.style.boxShadow = "1px 1px 2px black, 0 0 25px #57c5de, 0 0 5px #57c5de";
}

function noHover(num){
    let square = document.getElementById("square_" + num);
    let text = document.getElementById("skill_" + num);
    text.style.color = "black";
    square.style.boxShadow = "";
}

function topHover(id){
    document.getElementById(id).style.backgroundColor = "rgba(16, 110, 187)";
}

function topUnhover(id){
    document.getElementById(id).style.backgroundColor = "";
}

function reactionTest(){
    window.location.href = '/reactionTest/index.html';
}

function visualMemory(){
    window.location.href = '/visualMemory/index.html';
}

function sequenceMemory(){
    window.location.href = '/sequenceMemory/index.html';
}

function numberMemory(){
    window.location.href = '/numberMemory/index.html';
}

function login(){
    console.log("hi");
    window.location.href = '/login/index.html';
}

function signup(){
    window.location.href = '/login/index.html';
}

function goLeaderboard(){
    window.location.href = '/leaderboard/index.html';
}