function hover(id){
    document.getElementById('box_'+id).style.backgroundColor = "rgba(16, 110, 187)";
}

function unhover(id){
    document.getElementById('box_'+id).style.backgroundColor = "";
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
    window.location.href = '/account/index.html';
}

function signup(){
    window.location.href = '/account/index.html';
}

function goLeaderboard(){
    window.location.href = '/leaderboard/index.html';
}

function goHome(){
    window.location.href = '/app/index.html';
}

function profile(){
    window.location.href = '/profile/index.html';
}

function getLeaderboard(type){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let vals = httpRequest.responseText.split(" ");
            let b = document.getElementById("board");
            b.innerHTML = "";
            let x = 0;
            let badCount = 0;
            let failsafe = 10;
            while(vals[x] != '' && x < 200 && failsafe > 0){
                let v = vals[x].split(":")
                if(v[1] < 100000){
                    b.innerHTML += '<div id="box_'+(x-badCount)+'" class="box" onclick="searchUser(\''+v[0]+
                    '\')" onmouseover="hover('+(x-badCount)+');" onmouseleave="unhover('+(x-badCount)+')">' + 
                    '<span id="useless">&nbsp;</span><span id="pos'+(x-badCount)+'" class="posBox">'+((x-badCount)+1)+
                    '.</span><span id="user" class="userBox">'+v[0]+'</span><span id="time" class="scoreBox">'+v[1]+
                    '</span></div>';
                    failsafe = 10;
                }else{
                    failsafe--;
                    badCount++;
                }
                x++;
            }
        }else { 
            alert('Response failure'); }
        }
    }
    if(type == "number"){
        document.getElementById("curr_test").innerHTML = "Number Memory";
        document.getElementById("curr_test_btn").innerHTML = "Number Memory";
    }else if(type == "reactionClick"){
        document.getElementById("curr_test").innerHTML = "Reaction Test: Click";
        document.getElementById("curr_test_btn").innerHTML = "Reaction Test: Click";
    }else if(type == "reactionAverage"){
        document.getElementById("curr_test").innerHTML = "Reaction Test: Average";
        document.getElementById("curr_test_btn").innerHTML = "Reaction Test: Average";
    }else if(type == "sequence"){
        document.getElementById("curr_test").innerHTML = "Sequence Memory";
        document.getElementById("curr_test_btn").innerHTML = "Sequence Memory";
    }else if(type == "visual"){
        document.getElementById("curr_test").innerHTML = "Visual Memory";
        document.getElementById("curr_test_btn").innerHTML = "Visual Memory";
    }else if(type == "typing"){
        document.getElementById("curr_test").innerHTML = "Typing Speed";
        document.getElementById("curr_test_btn").innerHTML = "Typing Speed";
    }
    let url = '/get/leaderboard/' + type;
    httpRequest.open('GET', url);
    httpRequest.send();
}

function checkUser(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let login = document.getElementById('login');
            console.log(httpRequest);
            if(httpRequest.responseText != "guest"){
                document.getElementById("signup").innerHTML = "LOG OUT"
                document.getElementById("signup").setAttribute("onClick","logout()")
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