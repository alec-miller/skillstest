const URL = 'https://random-word-api.herokuapp.com/word?number=20&swear=0' 

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

let time
let startTime
let endTime

window.onload= function (){
    getScores()
    const txtElem = document.getElementById('txtbox')
    if (txtElem) {
        txtElem.addEventListener('input', () => {
            var elem = document.getElementById('words')
            const allSpans = elem.querySelectorAll('span')
            const listVals = txtElem.value.split('')
            allSpans.forEach((charSpan, i) => {
                const char = listVals[i]
                if (char === undefined) {
                    charSpan.classList.remove('green')
                    charSpan.classList.remove('red')
                } else if (char === charSpan.innerText) {
                    charSpan.classList.add('green')
                    charSpan.classList.remove('red')
                } else {
                    charSpan.classList.remove('green')
                    charSpan.classList.add('red')
                }
            })
            let key = document.getElementById('key')
            if (key.innerText === txtElem.value) {
                done = true
                stopTimer()
                txtElem.value = ''
            }
        })
    }

    function renderWords() {
        $.get(
            URL,
            (data, status) => {
                var words = data
                var elem = document.getElementById('words')
                var key = document.getElementById('key')
                key.innerText = words.join(' ')
                for (var i = 0; i < words.length; i++){
                    for (var j = 0; j < words[i].length; j++) {
                        const span  = document.createElement('span')
                        span.innerText = words[i][j]
                        elem.appendChild(span)
                    }
                    let space  = document.createElement('span')
                    space.innerText = ' '
                    elem.appendChild(space)
                };
            });
    }
    renderWords()
}

var startGame = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            var start = new Date()
            startTime = start.getTime()
        }
    };
})();

var score
function stopTimer() {
    let end = new Date()
    endTime = end.getTime()
    time = endTime - startTime

    var wpm  = 20 * 60000 / time
    // wpm = word count * 60000 / time

    score = String(Math.floor(wpm))
    var scoreElem = document.getElementById('scoredisp')
    scoreElem.innerText = 'Score: ' + score + ' WPM'
    sendScores(score)
}

function sendScores(score){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
            } else { alert('Response failure'); }
        }
    }
    console.log(score)
    newObject = {'score':score}
    dataString = JSON.stringify(newObject);
    let url = '/typingScores/';
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
    let url = '/get/typingScores/';
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