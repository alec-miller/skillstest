function goHome(){
    window.location.href='/app/index.html'
}

let started = false;
let earlyClick = false;
let startTime;
let endTime;
let count = 0;
let waiting = true;
let totalTime = 0;

function startGame(){
    let b = document.getElementById("clickBox");
    let t = document.getElementById("title");
    let d1 = document.getElementById("desc_1");
    let d2 = document.getElementById("desc_2")
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
                        let date = new Date;
                        startTime = date.getTime();
                        b.style.backgroundColor = "#67c96a"
                        d1.innerText = "Click!";
                        waiting = false;
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
                let date = new Date();
                endTime = date.getTime();
                let reactionTime = endTime - startTime;
                b.style.backgroundColor = "rgb(196, 191, 191)";
                t.innerText = reactionTime;
                d1.innerText = "Click to continue"
                count++;
                totalTime += reactionTime;
                started = false;
            }
        }
    }else{
        t.innerText = "Average reaction time: " + Math.floor(totalTime/5) + "ms";
        d1.innerText = "Click to try again";
        count = 0;
        started = false;
        earlyClick = false;
        waiting = true;
    }
}