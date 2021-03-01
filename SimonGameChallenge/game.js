var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var userClickIndex = 0;
var level = 0;

function nextSequence(){

    level++;
    $("h1").text("Level " + level);

    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    
    var i = 0;
    /* Apply time interval */
    myInterval = setInterval(function () {
        $("#" + gamePattern[i]).fadeOut(100).fadeIn(100);
        playSound(gamePattern[i]);
        i++;
        if (i === level){
            clearInterval(myInterval);
        }
    }, 700);
    
    
}

/* Press a key to start */

$(document).keypress( function (){
    if (level === 0){
        nextSequence();
        
    }
});

function playSound(name){
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

/* USER BUTTON CLICKS */

$(".btn").click(function () {
    if (level > 0){
        var userChosenColour = this.id; 
        userClickedPattern.push(userChosenColour);

        $("." + userChosenColour).addClass("pressed"); 
        setTimeout(function () {
            $("." + userChosenColour).removeClass("pressed");
        }, 100);

        playSound(userChosenColour);

        userClickIndex++;
        checkAnswer(userClickIndex-1);

        console.log(userClickedPattern, this);
    }
});


function checkAnswer(currentLevel){
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]){
        console.log("Doing good!");

        /* SUCCESS */

        if (userClickIndex === level){
            userClickIndex = 0;
            userClickedPattern = [];
            console.log("Success!");

            nextSequence();
        }
       
    }
    else {
        playSound("wrong");

        /* GAME OVER */
        $("body").addClass("game-over");
        setTimeout(function (){
            $("body").removeClass("game-over");
        }, 200);

        $(document).ready(function (){
            $("#level-title").text("Game Over, Press Any Key to Restart"); /* It`s not working here, 
            but it`s working in the console -> Had to verify if the document was ready! */
        });

        startOver();

        console.log("Wrong!");
    }
}

function startOver(){

    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    userClickIndex = 0;

}