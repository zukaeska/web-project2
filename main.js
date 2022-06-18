var countryCodeData;
var countryFlagData;
var quizQuestionsArray = [[]];
var CorrectAnswer = 0;
var IncorrectAnswer = 0;
var TimeSeconds = 0;
var FirstCountry;
var SecondCountry;
var ThirdCountry;
var FourthCountry;
var CorrectCountry;
var CurrentQuestion = 1;
var quizCountryCodes = [];
var timeInterval;
var player;


$(function () {
    $.get('https://flagcdn.com/en/codes.json', function (info) {
        countryCodeData = info;
        if (countryCodeData == null) {
            console.log("vaxme");
        }
        LoadSelectOptions();
    });

});


function ShowQuizForm() {
    var state = document.getElementsByClassName("QuizForm")[0].style.display;
    if (state == "none") {
        document.getElementsByClassName("QuizForm")[0].style.display = "block";
    }
    else if (state == "block") {
        document.getElementsByClassName("QuizForm")[0].style.display = "none";
    }
}

function ShowLeaderBoard() {
    document.getElementById("leaderBoard").style.display = "block";
    var leaderBoardArray = [];
    var storageInfo = allStorage();
    storageInfo.forEach(element => {
        leaderBoardArray.push(JSON.parse(element));
    });

    leaderBoardArray.sort((a, b) => {
        return a.score - b.score;
    });
    var indexer = 1;
    console.log(leaderBoardArray);
    for (let i = leaderBoardArray.length - 1; i >=0;i--) {
        document.getElementById("n"+indexer).innerHTML = leaderBoardArray[i].Nickname;
        document.getElementById("s"+indexer).innerHTML = leaderBoardArray[i].score;
        document.getElementById("t"+indexer).innerHTML = leaderBoardArray[i].time;
        indexer++;
    }
}


function StartQuiz() {
    var nickname = document.getElementById("nickName").value;
    var age = document.getElementById("age").value;
    var countrySelect = document.getElementById("countrySelect").value;



    if(nickname == "") {
        nickname = "TestNick"
    }

    player = nickname;

    var obj =  {Nickname: nickname, Age:age, country:countrySelect, score:"",time:""};

    localStorage.setItem(nickname, JSON.stringify(obj));
    ShowQuizForm();
   
    document.getElementById("fourCountries").style.display = "block";
    document.getElementById("quizForm").style.display = "none";

    document.getElementById("startQuizButton").style.display = "none";
    document.getElementById("cancelQuiz").style.display = "block";

    quizCountryCodes = Object.getOwnPropertyNames(countryCodeData);

    for (let i = 0; i < 20; i++) {
        var questionArray = [];
        for(let j = 0; j < 4; j++) {
            var countryIndex = Math.trunc(Math.random() * quizCountryCodes.length) + 1;
            questionArray.push(countryIndex);
        }
        quizQuestionsArray.push(questionArray);
    }
    var CorrectCountryIndex = quizQuestionsArray[CurrentQuestion][0];
    var CorrectCountryCode = quizCountryCodes[CorrectCountryIndex];
    CorrectCountry = countryCodeData[CorrectCountryCode];

    document.getElementById("quizImg").src = "https://flagcdn.com/256x192/"+ CorrectCountryCode +".png";

    document.getElementById("third").innerHTML = CorrectCountry;
    document.getElementById("first").innerHTML = countryCodeData[quizCountryCodes[quizQuestionsArray[CurrentQuestion][1]]];
    document.getElementById("second").innerHTML = countryCodeData[quizCountryCodes[quizQuestionsArray[CurrentQuestion][2]]];
    document.getElementById("fourth").innerHTML = countryCodeData[quizCountryCodes[quizQuestionsArray[CurrentQuestion][3]]];



    timeInterval = setInterval(function () {
        TimeSeconds++;
        var element = document.getElementById("quizTime");
        var minutes = Math.floor(TimeSeconds/60);
        var seconds = TimeSeconds % 60;
        element.innerHTML = "Time : " + minutes + ":" + seconds;
    }, 1000);
    CurrentQuestion++;
}

function NextQuestion() {

    var checkedRadioIndex;
    if($('#flexRadioDefault1').is(':checked')) {
        checkedRadioIndex = 1;
    }
    if($('#flexRadioDefault2').is(':checked')) {
        checkedRadioIndex = 2;
    }
    if($('#flexRadioDefault3').is(':checked')) {
        checkedRadioIndex = 3;
    }
    if($('#flexRadioDefault4').is(':checked')) {
        checkedRadioIndex = 4;
    }
    if(checkedRadioIndex == 3) {
        CorrectAnswer++;
    }else {
        IncorrectAnswer++;
    }

    if(CurrentQuestion == 21) {
        FinishQuiz();
        return;
    }

    document.getElementById("answerCount").innerHTML = "Correct/Incorrect" + CorrectAnswer + "/" + IncorrectAnswer;

    var CorrectCountryIndex = quizQuestionsArray[CurrentQuestion][0];
    var CorrectCountryCode = quizCountryCodes[CorrectCountryIndex];
    CorrectCountry = countryCodeData[CorrectCountryCode];

    document.getElementById("quizImg").src = "https://flagcdn.com/256x192/"+ CorrectCountryCode +".png";

    document.getElementById("third").innerHTML = CorrectCountry;
    document.getElementById("first").innerHTML = countryCodeData[quizCountryCodes[quizQuestionsArray[CurrentQuestion][1]]];
    document.getElementById("second").innerHTML = countryCodeData[quizCountryCodes[quizQuestionsArray[CurrentQuestion][2]]];
    document.getElementById("fourth").innerHTML = countryCodeData[quizCountryCodes[quizQuestionsArray[CurrentQuestion][3]]];

    CurrentQuestion++;
}

function CancelQuiz() {
    location.reload();
}

function LoadSelectOptions() {
    
    var countryCodes = Object.getOwnPropertyNames(countryCodeData);
    var x = document.getElementById("countrySelect");

    countryCodes.forEach(element => {
        var option = document.createElement("option");
        option.value = countryCodeData[element];
        option.text =countryCodeData[element];
        x.add(option);
    });
}

function FinishQuiz() {
    var element = document.getElementById("quizTime").innerHTML = "Time - 0:0";
    var minutes = Math.floor(TimeSeconds/60);
    var seconds = TimeSeconds % 60;

    var playerInfo = JSON.parse(localStorage.getItem(player));

    playerInfo.score = CorrectAnswer;
    playerInfo.time = minutes + ":" + seconds;

    localStorage.removeItem(player);
    localStorage.setItem(player, JSON.stringify(playerInfo));


    clearInterval(timeInterval);
    alert("your score is" + CorrectAnswer +"/" + IncorrectAnswer + "and Time : " + minutes + ":" + seconds);
    CancelQuiz();

}

function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
}
