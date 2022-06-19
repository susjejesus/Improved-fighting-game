const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

c.fillRect(0,0,canvas.width,canvas.height)

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
        x: 0,
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
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
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
        takeHit: {
            imageSrc: "./img/samuraiMack/Take hit - white silhouette.png",
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
        width: -450
    },
    jumping: 0
})


const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y:0
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
        run: {
            imageSrc: "./img/kenji/Run.png",
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
        takeHit: {
            imageSrc: "./img/kenji/Take hit.png",
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
        width: 550
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

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle = "rgba(255, 255, 255, 0.15)"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    player.velocity.x = 0
    enemy.velocity.x = 0;

    // player movement
    if(keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5
        player.switchSprite("run")
    } else if(keys.d.pressed && player.lastKey === "d"){
        player.velocity.x = 5
        player.switchSprite("run")
    } else {
        player.switchSprite("idle")
    }
    // jumping
    if(player.velocity.y < 0){
        player.switchSprite("jump")
    } else if (player.velocity.y > 0){
        player.switchSprite("fall")
    }

    // enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
        enemy.switchSprite("run")
    } else if(keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight"){
        enemy.velocity.x = 5
        enemy.switchSprite("run")
    } else {
        enemy.switchSprite("idle")
    }
    // jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite("jump")
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite("fall")
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
            enemy.takeHit()
            player.isAttacking = false
            gsap.to("#enemyHealth", {
                width: enemy.health + "%"
            })
        }

    // if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    // layer gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
        ){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to("#playerHealth", {
            width: player.health + "%"
        })
    }

    // if enemy misses
   if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
   }

    // end game based on health.
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

    // flips the player if the enemy is behind player

}

window.addEventListener("keydown", (event) =>{
    if(!player.dead){
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
            case "s":
                player.attack();
                break
        }
    }

    if(!enemy.dead){
        switch(event.key) {
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
            case "ArrowDown":
                enemy.attack()
                break
        }
    }
})

window.addEventListener("keyup", (event) =>{
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
