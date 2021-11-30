function goHome(){
    window.location.href='/app/index.html'
}

function goLeaderboard(){
    window.location.href='/leaderboard/index.html'
}

function goJoin(){
    window.location.href='/login/index.html'
}

function hover(id){
    document.getElementById(id).style.backgroundColor = "rgba(16, 110, 187)";
}

function unhover(id){
    document.getElementById(id).style.backgroundColor = "";
}

let running = false;
let valToGuess = "";
let score = 1;
var justRan = false;

function startGame(){
    if(!running){
        let t = document.getElementById("title");
        let c = document.getElementById("clickbox");
        let d1 = document.getElementById("desc_1");
        let d2 = document.getElementById("desc_2");
        d1.innerHTML = "";
        d2.innerHTML = "";
        for(let x=0; x<score;x++){
            valToGuess += Math.floor(Math.random()*10);
        }
        t.innerHTML = valToGuess;
        createProgressbar("timer","2s");
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
        document.getElementById("current_score").innerHTML = "Current Score: " + score;
        valToGuess = "";
        score++;
        startGame();
    }else{
        document.getElementById("title").innerHTML = "";
        document.getElementById("clickBox").style.backgroundColor = "#f23729"
        setTimeout(function(){
            document.getElementById("clickBox").style.backgroundColor = "rgb(196, 191, 191)"
            document.getElementById("title").innerHTML = "Your Score: " + (score-1);
            document.getElementById("desc_1").innerHTML = "Correct Answer: " + valToGuess;
            document.getElementById("desc_2").innerHTML = "Your Answer: " + guess;
        }, 150);
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