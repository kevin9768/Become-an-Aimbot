const menuControl = () => {
    const menu = document.getElementById('main-menu');
    const classical = document.getElementById('classical');
    const reaction = document.getElementById('reaction');
    const leaderboard = document.getElementById('leaderboard');
    
    // menu button control
    [...document.querySelectorAll('.game-mode')].forEach((item)=>{
        item.addEventListener('click', ()=>{
            menu.style.display = 'none';

            switch(item.innerHTML){
                case "Reaction Time":
                    reaction.style.display = 'block';
                    break
                case "Classical":
                    classical.style.display = 'block';
                    break
            }
        })
    });
    document.getElementById('leaderboard-btn').addEventListener('click', ()=>{
        menu.style.display = 'none';
        leaderboard.style.display = 'block';
    });
    
    // return to menu
    [...document.querySelectorAll('.back-to-menu')].forEach((item)=>{
        item.addEventListener('click', ()=>{
            menu.style.display = 'flex';
            reaction.style.display = 'none';
            classical.style.display = 'none';
            leaderboard.style.display = 'none';
        })
    });
}

// classical

const difficultyMode = {
    easy: {size: 45, time: 3000},
    normal: {size: 35, time: 2000},
    hard: {size: 25, time: 1000}
}

let classicalStarted = false;
let cheatMode = false;
const classicalControl = () => {
    const classical = document.getElementById('classical');
    const classicalStart = document.getElementById('classical-start');
    const classicalMenu = document.getElementById('classical-menu');
    const classicalCountdown = document.getElementById('classical-countdown');
    const backToClassicalMenu = document.getElementById('back-to-classical');
    const target = document.getElementById('target');
    const score = document.getElementById('score');
    const errorClick = document.getElementById('error-clicks');
    const cheating = document.getElementById('cheating');

    // count score
    target.addEventListener('click', ()=>{
        score.innerText = parseInt(score.innerText) + 1;
        target.style.display = 'none';
        errorClick.innerText = parseInt(errorClick.innerText) - 1;
    });

    // listen to page click to collect error clicks
    classical.addEventListener('click', () => {
        if(classicalStarted)
            errorClick.innerText = parseInt(errorClick.innerText) + 1;
    })

    classicalStart.addEventListener('click', () => {
        const difficultyRadio = document.getElementsByName('difficulty');
        let difficulty;
        for(let i = 0; i < difficultyRadio.length; i++)
            if(difficultyRadio[i].checked)
                difficulty = difficultyRadio[i].value;
        
        // turn the ui to the game
        classicalMenu.style.display = 'none';
        classicalCountdown.style.display = 'block';
        document.getElementById('classical-header').style.display = 'grid';

        let countdown = setInterval(()=>{
            if(parseInt(classicalCountdown.innerText) === 0){
                // start the game and hide the countdown
                classicalCountdown.style.display = 'none';

                // set difficulty
                mutateDifficulty(difficulty);
                classicalGame(difficulty);
                clearInterval(countdown);
            }
            classicalCountdown.innerText = parseInt(classicalCountdown.innerText) - 1;
        }, 1000);

    })

    // return to difficulty menu
    backToClassicalMenu.addEventListener('click', () => {
        classicalReset();
        document.getElementById('classical-header').style.display = 'none';
    });

    cheating.addEventListener('input', (e) => {
        cheatMode = e.target.checked ? true : false;
    });

}

const classicalGame = (difficulty) => {
    const endScore = document.getElementById('classical-score');
    const endError = document.getElementById('classical-error-clicks');
    const remaining = document.getElementById('remaining');
    const target = document.getElementById('target');
    const classicalTitle = document.getElementById('classical-title');
    const classicalEnd = document.getElementById('classical-end');

    classicalStarted = true;
    let gameStart = setInterval(()=>{
        target.style.display = 'none';
        target.style.animation = '';
        if(parseInt(remaining.innerText) <= 0){
            classicalTitle.innerHTML = 'Game Over';

            // erase the target
            target.style.display = 'none';
            
            // show the end screen
            endScore.innerText = document.getElementById('score').innerText;
            endError.innerText = document.getElementById('error-clicks').innerText;
            classicalEnd.style.display = 'flex';
            
            // update the local storage if needed
            if(localStorage.getItem(difficulty+'-score') === null){
                localStorage.setItem(difficulty+'-score', endScore.innerText);
                localStorage.setItem(difficulty+'-error', endError.innerText);
            } else {
                if(parseInt(localStorage.getItem(difficulty+'-score')) < parseInt(endScore.innerText)){
                    localStorage.setItem(difficulty+'-score', endScore.innerText);
                    localStorage.setItem(difficulty+'-error', endError.innerText);
                }
                if(parseInt(localStorage.getItem(difficulty+'-score')) === parseInt(endScore.innerText)){
                    if(parseInt(localStorage.getItem(difficulty+'-error')) > parseInt(endError.innerText)){
                        localStorage.setItem(difficulty+'-error', endError.innerText);
                    }
                }
            }
            updateLeaderboard();

            // prevent error click from counting
            classicalStarted = false;
            clearInterval(gameStart);
        }
        if(parseInt(remaining.innerText) > 0){
            remaining.innerText = parseInt(remaining.innerText) - 1;
            targetRandomPos(difficultyMode[difficulty].time);
        }
    }, difficultyMode[difficulty].time);
}
const targetRandomPos = (time) => {
    let scoreBounding = document.getElementById('score').getBoundingClientRect();
    let target = document.getElementById('target');

    target.style.backgroundColor = '#bbb';
    let w = window.innerWidth;
    let h = window.innerHeight;
    // prevent the target from being placed on the score or out of the screen
    let newTop = Math.random() * (h-50-scoreBounding.bottom);
    let newLeft = Math.random() * (w-50);

    target.style.top = (scoreBounding.bottom + newTop) + 'px';
    target.style.left = newLeft + 'px';
    if(cheatMode){
        target.style.top = '50%';
        target.style.left = '50%';
        target.style.transform = 'translate(-50%, -50%)';
    }
    else {
        target.style.transform = "";
        document.documentElement.style.setProperty('--dx', Math.random() * (w-50) - newLeft+'px');
        document.documentElement.style.setProperty('--dy', Math.random() * (h-50-scoreBounding.bottom) - newTop+'px');
        target.style.animation = 'move ' + time/1000 + 's linear forwards';
    }
    target.style.display = 'block';
}

const mutateDifficulty = (diff) => {
    let target = document.getElementById('target');
    target.style.width = difficultyMode[diff].size +'px';
    target.style.height = difficultyMode[diff].size+'px';
    if(cheatMode){
        target.style.width = '600px';
        target.style.height = '600px';
    }

}

const classicalReset = () => {
    let classicalCountdown = document.getElementById('classical-countdown');
    classicalCountdown.style.display = 'none';
    classicalCountdown.innerText = 3;
    document.getElementById('classical-title').innerText = 'Try to click on every target.';
    document.getElementById('score').innerText = 0;
    document.getElementById('error-clicks').innerText = 0;
    document.getElementById('remaining').innerText = 20;
    document.getElementById('classical-menu').style.display = 'flex';
    document.getElementById('classical-end').style.display = 'none';
}

let reactionStarted = false;
let reactionStartTime;
const reactionControl = () => {
    const reactionStart = document.getElementById('reaction-start');
    const reactionMenu = document.getElementById('reaction-menu');
    const reactionHeader = document.getElementById('reaction-header');
    const reactionCountdown = document.getElementById('reaction-countdown');
    const backToReactionMenu = document.getElementById('back-to-reaction');

    reaction.addEventListener('click', () => {
        if(reactionStarted){
            document.getElementById('reaction').style.backgroundColor = '#F1FAF4';
            let reactionTime = Date.now() - reactionStartTime;
            document.getElementById('reaction-time').innerText = reactionTime;
            if(localStorage.getItem('fastest-reaction-time') === null || parseInt(localStorage.getItem('fastest-reaction-time')) > reactionTime){
                localStorage.setItem('fastest-reaction-time', reactionTime);
                updateLeaderboard();
            }
            document.getElementById('reaction-end').style.display = 'flex';
            reactionStarted = false;
        }
    });

    reactionStart.addEventListener('click', () => {
        reactionMenu.style.display = 'none';
        reactionCountdown.style.display = 'block';
        reactionHeader.style.display = 'block';
        let countdown = setInterval(()=>{
            if(parseInt(reactionCountdown.innerText) === 0){
                // start the game and hide the countdown
                reactionCountdown.style.display = 'none';
                reactionGame();
                reactionStarted = true;
                clearInterval(countdown);
            }
            reactionCountdown.innerText = parseInt(reactionCountdown.innerText) - 1;
        }, 1000);
    })

    backToReactionMenu.addEventListener('click', () => {
        reactionReset();
        reactionHeader.style.display = 'none';
    })
}

const reactionGame = () => {
    const randomCountdown = Math.random() * 4000 + 1000;

    setTimeout(()=>{
        document.getElementById('reaction').style.backgroundColor = '#04AA6D';
        reactionStartTime = Date.now();
    }, randomCountdown);
}

const reactionReset = () => {
    const reactionCountdown = document.getElementById('reaction-countdown');
    reactionCountdown.innerText = 3;
    reactionCountdown.style.display = 'none';
    document.getElementById('reaction-menu').style.display = 'flex';
    document.getElementById('reaction-end').style.display = 'none';

}

const updateLeaderboard = () => {
    for(let i=0; i<localStorage.length; i++)
        document.getElementById(localStorage.key(i)).innerText = localStorage.getItem(localStorage.key(i));
}


window.onload = () => {
    menuControl();
    classicalControl();
    reactionControl();

    //leaderboard data
    for(let i=0; i<localStorage.length; i++)
        document.getElementById(localStorage.key(i)).innerText = localStorage.getItem(localStorage.key(i));
}
