/*

Visual Memory
----------------
There's a 3x3 grid of squares, increasing as the levels increase. The user has
to remember which squares get highlighted, then input those same squares in the exact
order or else they fail. The amount of squares highlighted is equal to the level the user
is currently on.

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

function signup(){
    window.location.href='/login/index.html'
}

function hover(id){
    document.getElementById(id).style.backgroundColor = "rgba(16, 110, 187)";
}

function unhover(id){
    document.getElementById(id).style.backgroundColor = "";
}

let score = 0;
let pb = 0;
let numOfSquares = 9;
let currWrongGuesses = 0;
let squaresToGuess = 3;
let correctSquares = [];
let guessed = [];
let allowGuessing = false;
let game_started = false;
let currHeart = 0;
let levelsUntilUpgrade = 2;
let levelMultiplier = 1;
let levelsPerRound = 2;
let currTop = 4;
let borderRadius = 20;

// Start the game unless it's already going
function startGame(){
    if(!game_started){
        game_started = true;
        document.getElementById("pb").innerHTML = "Personal Best: " + pb;
        document.getElementById("current_score").innerHTML = "Current Score: "+score;
        document.getElementById("not_started").style.visibility = "hidden";
        document.getElementById("game_started").style.visibility = "visible";
        correctSquares = [];
        // Get which squares to guess
        while(correctSquares.length < squaresToGuess){
            let pos = Math.floor(Math.random() * numOfSquares);
            if(!correctSquares.includes(pos)){
                correctSquares.push(pos);
            }
        }
        // Show the correct squares to guess
        setTimeout(function(){
            for(let x = 0; x < correctSquares.length; x++){
                let sq = "square_" + correctSquares[x];
                document.getElementById(sq).style.backgroundColor = "gray";
            }
        },500);
        // Hide the correct squares to guess
        setTimeout(function(){
            for(let x = 0; x < correctSquares.length; x++){
                let sq = "square_" + correctSquares[x];
                document.getElementById(sq).style.backgroundColor = "rgb(91, 178, 236)";
            }
            allowGuessing = true;
        },1500);
    }
}

function guess(num){
    // Stop unneccessary clicking when answer is showing
    console.log(num);
    if(allowGuessing){
        let guess = "square_"+num;
        // Correct square guess and hasn't been guessed before
        if(correctSquares.includes(num) && !guessed.includes(num)){
            guessed.push(num);
            document.getElementById(guess).style.backgroundColor = "white";
            correctSquares = correctSquares.filter(function(val){
                return val !== num;
            })
            // If all squares have been found reset board
            if(correctSquares.length == 0){
                setTimeout(function(){
                    score++;
                    allowGuessing = false;
                    game_started = false;
                    guessed = [];
                    levelsUntilUpgrade--;
                    squaresToGuess++;
                    currWrongGuesses = 0;
                    if(levelsUntilUpgrade == 0){
                        reset_squares();
                        updateBoard();
                    }else{
                        reset_squares();
                    }
                    startGame();
                },250);
            }
        } // Squares that haven't been guessed
        else if(!guessed.includes(num)){
            guessed.push(num);
            document.getElementById(guess).style.backgroundColor = "rgb(88, 88, 88)";
            currWrongGuesses++;
            // 3 Wrong guesses, reset round
            if(currWrongGuesses > 2){
                document.getElementById("clickBox").style.backgroundColor = "#f16056"
                setTimeout(function(){
                    document.getElementById("clickBox").style.backgroundColor = "rgb(196, 191, 191)";
                    currHeart++;
                    document.getElementById("heart_"+currHeart).style.color = "rgb(88, 88, 88)";
                    // Gameover, reset everything
                    if(currHeart > 2){
                        if(score > pb){
                            pb = score;
                        }
                        gameover();
                    // Lost a life, reset round
                    }else{
                        game_started = false;
                        setTimeout(function(){
                            reset_squares();
                            setTimeout(function(){
                                startGame();
                            },250);
                        },500);
                    }
                    currWrongGuesses = 0;
                },250);
                allowGuessing = false;
                guessed = [];
            }
        }
    }
}

// Reset everything and show the score
function gameover(){
    reset_squares();
    reset_hearts();
    document.getElementById("not_started").style.visibility = "visible";
    document.getElementById("game_started").style.visibility = "hidden";
    document.getElementById("title").innerHTML = "Score: "+score;
    document.getElementById("desc_1").innerHTML = "";
    document.getElementById("desc_2").innerHTML = "Click to play again.";
    score = 0;
    guessed = [];
    currWrongGuesses = 0;
    allowGuessing = false;
    game_started = false;
    currHeart = 0;
}

// Update board with more squares and reshape/realign old squares
function updateBoard(){
    let t = document.getElementById("table");
    t.style.top = "0%";
    let prev_num = numOfSquares;
    let currRow = Math.sqrt(prev_num);
    numOfSquares = (Math.sqrt(numOfSquares)+1)*(Math.sqrt(numOfSquares)+1);
    let rowAdded = false;
    let row;
    for(let x = 0; x < numOfSquares; x++){
        if(document.getElementById("square_"+x) == undefined){
            if(currRow == 0){
                if(!rowAdded){
                    row = t.insertRow(Math.sqrt(prev_num));
                    row.id = "row_" + Math.sqrt(numOfSquares);
                    rowAdded = true;
                }
                row.innerHTML += '<td><div id="square_'+ x +'" class="square" onclick="guess('+x+')"></div></td>';
            }else{
                document.getElementById("row_"+currRow).innerHTML += 
                '<td><div id="square_'+ x +'" class="square" onclick="guess('+x+')"></div></td>';
                currRow--;
            }
        }
    }
    let width = $(".square").width() - 20;
    $(".square").css({
        width: width,
        height: width,
        borderRadius: borderRadius
    });
    levelsPerRound *= levelMultiplier;
    levelMultiplier++;
    levelsUntilUpgrade = levelsPerRound;
    currTop--;
    borderRadius - 2;
}

// Reset all the squares to their original color
function reset_squares(){
    for(let x = 0; x < numOfSquares; x++){
        document.getElementById("square_"+x).style.backgroundColor = "rgb(91, 178, 236)";
    }
}

// Reset all the hearts to red
function reset_hearts(){
    for(let x = 1; x < 4; x++){
        document.getElementById("heart_"+x).style.color = "red";
    }
}