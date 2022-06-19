let tie = 0
let round1end = 0
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector("#displayText").style.display = "flex"
    if (player.health === enemy.health) {
        round1end = 1
        tie = 1
        document.querySelector("#displayText").innerHTML = "Tie"
    } else if (player.health > enemy.health) {
        round1end = 1
        enemy.health = 0
        document.querySelector("#displayText").innerHTML = "Player 1 Wins"
        gsap.to("#enemyHealth", {
            width: enemy.health + "%"
        })
    } else if (enemy.health > player.health) {
        round1end = 1
        document.querySelector("#displayText").innerHTML = "Player 2 Wins"
        player.health = 0
        gsap.to("#playerHealth", {
            width: player.health + "%"
        })
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}