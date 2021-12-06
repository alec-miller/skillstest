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

function goHome(){
    window.location.href = '/app/index.html';
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

function loginAccount() {
    let username = $('#username').val();
    let password = $('#password').val();
    $.get(
      '/account/login/' + encodeURIComponent(username) + '/' + encodeURIComponent(password),
      (data, status) => {
        console.log(data);
        if (data == '1') {
          window.location.href = '/app/index.html';
        }else if(data == '2'){
          document.getElementById("bad_login").innerText = "Incorrect username or password";
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
        }
    });
  }
  
  function createAccount() {
    let username = $('#cu_username').val();
    let password = $('#cu_password').val();
    $.post(
      '/account/create/' + encodeURIComponent(username) + '/' + encodeURIComponent(password),
      (data, status) => {
          if(data == "taken"){
            document.getElementById("created").innerHTML = "Username is already taken.";
          }else{
            document.getElementById("created").innerHTML = "User created!";
          }
    });
    document.getElementById("cu_username").value = "";
    document.getElementById("cu_password").value = "";
    document.getElementById("bad_username").innerHTML = "";
    document.getElementById("created").innerHTML = "";
  }