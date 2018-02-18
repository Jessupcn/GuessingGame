function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr){
    var m = arr.length, t, i;
    while(m){
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        
        // And swap it with the current element.
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    if(this.playersGuess < this.winningNumber){return true}
    return false;
}

Game.prototype.playersGuessSubmission = function(num){
    if(num < 1 || num > 100 || isNaN(num)){
        $('#title').text('That is not a valid number.');
        throw "That is an invalid guess."
    }
    else{this.playersGuess = num}
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    $('#headers').removeClass('hint');
    if(this.playersGuess === this.winningNumber){
        $('#hint, #submit').prop('disabled', true);
        $('#subtitle').text('Hit reset and play again!');
        $('#headers').addClass('winner');
        return "You Win!";
    }
    if(this.pastGuesses.indexOf(this.playersGuess) !== -1){return "You have already guessed that number."}
    else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    }
    if(this.pastGuesses.length === 5){
        $('#hint, #submit').prop('disabled', true);
        $('#headers').addClass('loser');
        $('#subtitle').text('Hit reset and try again!');
        return 'You Lose.';
    }
    if(this.difference() < 10){return 'You\'re burning up!'}
    if(this.difference() < 25){return 'You\'re lukewarm.'}
    if(this.difference() < 50){return 'You\'re a bit chilly.'}
    if(this.difference() < 100){return 'You\'re ice cold!'}
}

function newGame(){
    return new Game()
}

Game.prototype.provideHint = function(){
    var returnArr = [];
    returnArr.push(this.winningNumber);
    for(var i = 0; i < 2; i++){
        returnArr.push(generateWinningNumber());
    }
    return shuffle(returnArr);
}

function makeGuess(game) {
    var storing = +$('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(storing);
    $('#title').text(output);
    if(game.isLower() && game.pastGuesses.length < 5){
        $('#subtitle').text('Try guessing higher!');
    } else if(!game.isLower() && storing !== game.winningNumber && game.pastGuesses.length < 5) {
        $('#subtitle').text('Try guessing lower!');
    }
}

$(document).ready(function() {
    
    var game = new Game();
    console.log(game.winningNumber);

    $('#submit').click(function() {
        makeGuess(game);
    });

    $('#player-input').keypress(function(e) {
        if(e.keyCode === 13) {
            makeGuess(game);
        }    
    });

    $('#reset').click(function() {
        $('#title').text("Let's play a game!");
        $('#subtitle').text('Guess a number between 1 and 100!');
        $('.guess').text('-');
        $('#headers').removeClass('winner');
        $('#headers').removeClass('loser');
        $('#headers').removeClass('hint');
        $('#hint, #submit').prop('disabled', false);
        game = new Game();
    });

    $('#hint').click(function() {
        //var hintArray = game.provideHint();
        //$('#title').text('The winning number is ' + hintArray[0] + ', ' + hintArray[1] + ', or ' + hintArray[2]);
        //$('#subtitle').text('Pick One!');
        function evenOrOdd(){
            if(game.winningNumber % 2 === 1){
                return 'odd';
            }
            return 'even';
        }
        function hintRange(){
            var lowEnd = game.winningNumber - 15;
            var highEnd = game.winningNumber + 15;
            if(lowEnd < 0){lowEnd = 0}
            if(highEnd > 100){highEnd = 100}
            return lowEnd.toString() + ' and ' + highEnd.toString();
        }
        $('#title').text('The winning number is an ' + evenOrOdd() + ' number between ' + hintRange());
        $('#subtitle').text('');
        $('#headers').addClass('hint');
        $('#hint').prop('disabled', true);
    });
});



