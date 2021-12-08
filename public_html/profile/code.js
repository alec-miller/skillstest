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

function goThere(){
    window.location.href = '/profile/index.html';
}

function searchUser(user){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            goThere();
        }else { 
            alert('Response failure'); }
        }
    }
    let url = '/account/search/'+user;
    httpRequest.open('POST', url);
    httpRequest.send();
}

function getProfile(user){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let split = httpRequest.responseText.split("_");
            let table = document.getElementById("table");
            let dropdown = document.getElementById("dropdown");
            document.getElementById("user").innerHTML = user;
            for(let x = 0; x < split.length; x++){
                let parts = split[x].split(":");
                let str = "";
                if(x % 2 == 0){
                    str += "<tr><td><span id='score_'"+x+" class='scores'>" + parts[0] + ": " + parts[1];
                    if(x == 2 || x == 4){
                        str += "ms";
                    }
                    str += "</span></td></tr>";
                    if(table != null){
                    table.innerHTML += str;}
                }else{
                    let get = parts[1];
                    scores = get.split(",");
                    str += '<tr><td><div class="dropdown"><button class="dropbtn">' + parts[0] +
                    '</button><div class="dropdown-content">';
                    if(parts[1].length == 1){
                        str += '<span class="options" id="o0" onmouseover="topHover(\'o0\');' +
                        'onmouseleave="topUnhover(\'o0\' )">'+parts[1]+'</span><br>';
                    }else if(parts[1].length > 1){
                        for(let i=0;i<scores.length;i++){
                            str += '<span class="options" id="o' + i+'" onmouseover="topHover(\'o\'' + i + 
                            ');onmouseleave="topUnhover(\'o\'' + i + ')">'+scores[i];
                            if(x == 3 || x == 5){
                                str += "ms";
                            }
                            str += '</span><br>';
                        }
                    }
                    str += '</div></div><br><br></td></tr>';
                    if(table != null){table.innerHTML += str;}
                }
            }
        }else { 
            alert('Response failure'); }
        }
    }
    let url = '/get/stats';
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
            if(httpRequest.responseText != "guest"){
                document.getElementById("signup").innerHTML = "LOG OUT"
                document.getElementById("signup").setAttribute("onClick","logout()")
                login.innerHTML = "PROFILE";
                login.setAttribute("onClick","profile()")
                let user = httpRequest.responseText;
                getProfile(user);
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