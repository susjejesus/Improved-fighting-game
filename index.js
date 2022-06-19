/*
TO DO
    restart (once a player loses they go on to round 2, best of 2)
    add all sprites so, player can turn and play (death, jump and fall animation remaining)
    add special attack
    add health boost
    long range attack
    block attack
    more maps?
done
    Fixed health bar so, it is 0 is someone dies
    Fixed game over (if both player die, it's a tie not one player wining)
    Fixed player diex if health reaches 0 (sometimes it didn't)
    add pause button
    add a controls and stats button in html
    better attack boxes
*/


const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const element = document.getElementById("button")
let pause = 0

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/background.png"
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 30,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            framesMax: 8
        },
        idleleft: {
            imageSrc: "./img/samuraiMack/Idle-left.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            framesMax: 8
        },
        runleft: {
            imageSrc: "./img/samuraiMack/Run-left.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            framesMax: 6
        },
        attack1Left: {
            imageSrc: "./img/samuraiMack/Attack1 left.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/Take hit - white silhouette.png",
            framesMax: 4
        },
        takeHitleft: {
            imageSrc: "./img/samuraiMack/Take hit - white silhouette left.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 200,
            y: 50
        },
        height: 50,
        width: -500
    },
    jumping: 0
})


const enemy = new Fighter({
    position: {
        x: 937,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: "./img/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesMax: 4
        },
        idleright: {
            imageSrc: "./img/kenji/Idle-right.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            framesMax: 8
        },
        runright: {
            imageSrc: "./img/kenji/Run-right.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            framesMax: 4
        },
        attack1Right: {
            imageSrc: "./img/kenji/Attack1 right.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./img/kenji/Take hit.png",
            framesMax: 3
        },
        takeHitright: {
            imageSrc: "./img/kenji/Take hit right.png",
            framesMax: 3
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -180,
            y: 50
        },
        height:
            50,
        width: 610
    },
    jumping: 0
})

// console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.attackBox.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

if (pause != 1) decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = "rgba(255, 255, 255, 0.15)"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    if (pause === 1) {
        c.fillStyle = "rgba(108, 122, 137, 0.3)"
        c.fillRect(0, 0, canvas.width, canvas.height)
        document.querySelector("#displayText").style.display = "flex"
        document.querySelector("#displayText").innerHTML = "Game Paused"
        document.querySelector("#button").style.display = "inline-block"
        const element = document.getElementById("button")
        element.addEventListener("click", () => {
            document.querySelector("#controls").style.display = "flex"     
        });
    } else {
        document.querySelector("#button").style.display = "none"
        document.querySelector("#displayText").style.display = "flex"
        document.querySelector("#displayText").innerHTML = ""
        document.querySelector("#controls").style.display = "none"
    }


    player.velocity.x = 0
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5
        player.switchSprite("runleft")
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
        player.switchSprite("run")
    } else {
        if (player.position.x > enemy.position.x) player.switchSprite("idleleft")
        if (player.position.x < enemy.position.x) player.switchSprite("idle")
    }
    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite("Jump")
    } else if (player.velocity.y > 0) {
        player.switchSprite("Fall")
    }
    if (player.position.x >= 960) {
        player.velocity.x = -10
    } else if (player.position.x <= 24) {
        player.velocity.x = 10
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
        enemy.switchSprite("run")
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
        enemy.switchSprite("runright")
    } else {
        if (enemy.position.x > player.position.x) enemy.switchSprite("idle")
        if (enemy.position.x < player.position.x) enemy.switchSprite("idleright")
    }
    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("Jump")
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("Fall")
    }
    if (enemy.position.x >= 960) {
        enemy.velocity.x = -10
    } else if (enemy.position.x <= 3) {
        enemy.velocity.x = 10
    }

    // decet for collision & hit animation
    //enemy gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.isHit = true
        enemy.takeHit()
        player.isAttacking = false
        gsap.to("#enemyHealth", {
            width: enemy.health + "%"
        })
    }

    if (player.health <= 0) {
        player.health = 0
    } else if (enemy.health <= 0) {
        enemy.health = 0
    } else {
        player.health = player.health
        enemy.health = enemy.health
    }
    console.log(player.health)

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // layer gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.isHit = true
        player.takeHit()
        enemy.isAttacking = false
        gsap.to("#playerHealth", {
            width: player.health + "%"
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health.
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }

    // flips the player if the enemy is behind player

}

window.addEventListener("keydown", (event) => {
    if (pause === 1) {
        switch (event.key) {
            case "p":
                pause = 0
                break
        }
        return
    }
    switch (event.key) {
        case "p":
            pause = 1
            break
    }
    if (tie === 1) return
    if (!player.dead) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true
                player.lastKey = "d"
                break
            case "a":
                keys.a.pressed = true
                player.lastKey = "a"
                break
            case "w":
                player.jump()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true
                enemy.lastKey = "ArrowRight"
                break
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true
                enemy.lastKey = "ArrowLeft"
                break
            case "ArrowUp":
                enemy.jump()
                break
        }
    }
    if (enemy.died || player.died) {
        return
    }
    switch (event.key) {
        case "ArrowDown":
            enemy.attack()
            break
        case "s":
            player.attack();
            break
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false
            break
        case "a":
            keys.a.pressed = false
            break
    }

    // enemy keys
    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break
    }
})

animate()
