var benjeben;
var dices;
var reroll_number;
var yahtzee_counter;
var game_number;
var total_score;
var amoungus;


$(document).ready(function($) {
    dices = [];
    resetDicesArray();
    reroll_number = 5;
    yahtzee_counter = 0;
    game_number = 0;
    total_score = 0;
    benjeben = true;
    amoungus = true;

    $("#information").text("Start het ronde zodra je er klaar voor bent.")

    $("#dice-launch").on("click", "span", function () {

        if(reroll_number !== 0) {
            var dice_index = parseInt($(this).attr('id').split("e")[1]);

            var rand_dice = rollADice();

            dices[rand_dice] += 1;

            var alt = parseInt($("#dice" + dice_index).find("img").attr("alt"));
            dices[alt] -= 1;

            $("#dice" + dice_index).empty();

            var image = '<img alt="' + rand_dice + '" style="width: 50px; margin: 5px;" src="img/dobbelsteen' + rand_dice + '.png"/>';
            $("#dice" + dice_index).append(image);

            updateDicesResults();
            updateComboResults();

            reroll_number --;
            if(reroll_number === 0){
                $("#information").text("Je hebt zo vaak mogelijk opnieuw gegooid, klik op \"Beëindig Beurt\" om je beurt te beëindigen.");
            }else{
                $("#information").text("Je kunt sommige dobbelstenen nog steeds opnieuw gooien door erop te klikken.  (" + reroll_number +" resterend)");
            }

        }
    });



    $("#start-stop").click(function(){

        if(game_number < 2) {

            $("#dice-launch").empty();
            for (var i = 1; i <= 5; ++i) {
   
                var rand_dice = rollADice();

              
                dices[rand_dice] += 1;

              
                var image = '<span id="dice' + i +'" ><img  alt="' + rand_dice + '" style="width: 50px; margin: 5px;" src="img/dobbelsteen' + rand_dice + '.png"/></span>';
                $("#dice-launch").append(image);
            }

            game_number ++;
            if(game_number === 1){
                if($("#yahtzee").text() !== "0")
                    yahtzee_counter ++;
                $(this).attr("value", "Beëindig Beurt");
            }else {
                total_score += getScore();
                $(this).attr("value", "Beëindig het ronde");
            }

            $("#information").text("Je kunt nu enkele dobbelstenen opnieuw gooien door erop te klikken. (" + reroll_number +" resterend)");

            $("#score-total").text(total_score.toString());
            updateDicesResults();
            updateComboResults();
        }else if(game_number === 2){
            if($("#yahtzee").text() !== "0")
                yahtzee_counter ++;

            total_score += getScore();

            $("#history").find("table").append("<tr><td>" + "Tijd : " + (new Date()).toLocaleTimeString() + ", score : " + total_score.toString() + "</td></tr>");

            dices = [];
            resetDicesArray();
            reroll_number = 5;
            total_score = 0;
            yahtzee_counter = 0;
            game_number = 0;

            $("#brelan").text("0");
            $("#carre").text("0");
            $("#full").text("0");
            $("#yahtzee").text("0");
            $("#petite-suite").text("0");
            $("#grande-suite").text("0");
            $("#chance").text("0");
            $("#total").text("0");
            for(var i = 1 ; i < dices.length ; ++ i){
                $("#diceres" + i).text("0");
            }

            $("#dice-launch").empty();
            $(this).attr("value", "Start ronde");
            $("#information").text("Démarrez la partie dès que vous êtes prêts.")
        }
    });
});

function rollADice(){
    return 1 + Math.floor(Math.random() * 6);
}

function updateDicesResults(){
    var total = 0;
    for(var i = 1 ; i < dices.length ; ++ i){
        var score = dices[i] * i;
        total += score

        if(dices[i] !== 0)
            $("#diceres" + i).text(score.toString());
        else
            $("#diceres" + i).text("0");
    }
    $("#total").text(total);
}

function getScore(){
    var bonus = parseInt($("#total")) > 63 ? 35 : 0;
    bonus += yahtzee_counter === 2 ? 100 : 0;
    if($("#full").text() !== "0") return parseInt($("#full").text()) + bonus;
    if($("#brelan").text() !== "0") return parseInt($("#brelan").text()) + bonus;
    if($("#carre").text() !== "0") return parseInt($("#carre").text()) + bonus;
    if($("#yahtzee").text() !== "0") return parseInt($("#yahtzee").text()) + bonus;
    if($("#petite-suite").text() !== "0") return parseInt($("#petite-suite").text()) + bonus;
    if($("#grande-suite").text() !== "0") return parseInt($("#grande-suite").text()) + bonus;
    if($("#chance").text() !== "0") return parseInt($("#chance").text()) + bonus;
    return -1;
}

function updateComboResults(){

    var brelan = getBrelanScore();
    var carre = getCarreScore();
    var full = getFullScore();
    var yahtzee = getYahtzeeScore();
    var petite_suite = getStraightScore(4);
    var grande_suite = getStraightScore(5);

    if(full === 0)
        $("#brelan").text(brelan.toString());
    else
        $("#brelan").text("0");

    $("#carre").text(carre.toString());
    $("#full").text(full.toString());
    $("#yahtzee").text(yahtzee.toString());

    $("#petite-suite").text(petite_suite.toString());
    $("#grande-suite").text(grande_suite.toString());

    if(brelan === 0 && carre === 0 && full === 0 && yahtzee === 0 && petite_suite === 0 && grande_suite === 0)
        $("#chance").text(getChanceScore());
    else
        $("#chance").text("0");
}

function numberOfSameDices(except, number){
    var dice = -1;
    for (var i = 1; i < dices.length; ++i) {
        if (dices[i] === number && i !== except)
            dice = i;
    }
    return dice;
}

function getBrelanScore(){
    var dice = numberOfSameDices(-1, 3);
    if(dice === -1) return 0;
    return dices[dice] * dice;
}

function getCarreScore(){
    var dice = numberOfSameDices(-1, 4);
    if(dice === -1) return 0;
    return dices[dice] * dice;
}

function getFullScore(){
    var dice1 = numberOfSameDices(-1, 3);
    if(dice1 === -1) return 0;

    var dice2 = numberOfSameDices(dice1, 2);
    if(dice2 === -1) return 0;

    return 25;
}

function getYahtzeeScore(){
    var dice = numberOfSameDices(-1, 5);
    if(dice === -1) return 0;
    return 50;
}


function getStraightScore(aimed_straight_length){

    var index = 1;
    var max_straight_length = 0;
    var straight_length = 0;

    for(var index = 1 ; index < dices.length ; ++ index){
        if(dices[index] !== 0){
            straight_length ++;
        }else{
            straight_length = 0;
        }

        if(straight_length > max_straight_length){
            max_straight_length = straight_length;
        }
    }
    if(max_straight_length !== aimed_straight_length) return 0;
    return 40;
}

function resetDicesArray(){
    for(var i = 0 ; i <= 6 ; ++ i)
        dices.push(0);
}

function getChanceScore(){
    var score = 0;
    for(var i = 1 ; i < dices.length ; ++ i){
        score += dices[i] * i;
    }
    return score;
}
