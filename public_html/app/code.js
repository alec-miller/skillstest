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