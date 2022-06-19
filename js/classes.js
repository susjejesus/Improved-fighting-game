class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = "red",
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        jumping = 0
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.died = false
        this.jumping = jumping
        this.isHit = false
        this.attacking = 0

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw the attack box
        // c.fillRect(
        //     this.attackBox.position.x, 
        //     this.attackBox.position.y, 
        //     this.attackBox.width, 
        //     this.attackBox.height
        // )

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
            this.jumping = 0
        } else this.velocity.y += gravity

    }

    attack() {
        this.isAttacking = true
        if (enemy.isAttacking) {
            if (player.position.x < enemy.position.x) {
                this.switchSprite("attack1")
            }
            if (player.position.x > enemy.position.x) {
                this.switchSprite("attack1right")
            }
        }
        if (player.isAttacking) {
            if (player.position.x < enemy.position.x) {
                this.switchSprite("attack1")
            }
            if (player.position.x > enemy.position.x) {
                this.switchSprite("attack1left")
            }
        }
    }

    jump() {
        if (this.jumping === 0) {
            this.velocity.y = -20
            this.jumping = 1
        }
    }

    takeHit() {
        if (enemy.isHit) {
            this.health -= 23
            enemy.isHit = false
            if (this.health > 0) {
                if (player.position.x > enemy.position.x) this.switchSprite("takeHitright")
                if (player.position.x < enemy.position.x) this.switchSprite("takeHit")
            }
        } else if (player.isHit) {
            this.health -= 15
            player.isHit = false
            if (this.health > 0) {
                if (player.position.x > enemy.position.x) this.switchSprite("takeHitleft")
                if (player.position.x < enemy.position.x) this.switchSprite("takeHit")
            }
        }
        if (this.health <= 0) {
            this.switchSprite("death")
        }
    }
    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            this.died = true
            if (this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true
                this.died = false
            }
            return
        }
        // overriding all other animations with attack animation
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) {
            return
        }
        if (enemy.image === enemy.sprites.attack1Right.image && enemy.framesCurrent < enemy.sprites.attack1Right.framesMax - 1) {
            return
        }
        if (player.image === player.sprites.attack1Left.image && player.framesCurrent < player.sprites.attack1Left.framesMax - 1) {
            return
        }

        // override wen fighter gets hit
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return


        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case "idleright":
                if (this.image !== this.sprites.idleright.image) {
                    this.image = this.sprites.idleright.image
                    this.framesMax = this.sprites.idleright.framesMax
                    this.framesCurrent = 0
                }
                break
            case "idleleft":
                if (this.image !== this.sprites.idleleft.image) {
                    this.image = this.sprites.idleleft.image
                    this.framesMax = this.sprites.idleleft.framesMax
                    this.framesCurrent = 0
                }
                break
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case "runright":
                if (this.image !== this.sprites.runright.image) {
                    this.image = this.sprites.runright.image
                    this.framesMax = this.sprites.runright.framesMax
                    this.framesCurrent = 0
                }
                break
            case "runleft":
                if (this.image !== this.sprites.runleft.image) {
                    this.image = this.sprites.runleft.image
                    this.framesMax = this.sprites.runleft.framesMax
                    this.framesCurrent = 0
                }
                break
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case "attack1":
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            case "attack1right":
                if (this.image !== this.sprites.attack1Right.image) {
                    this.image = this.sprites.attack1Right.image
                    this.framesMax = this.sprites.attack1Right.framesMax
                    this.framesCurrent = 0
                }
                break
            case "attack1left":
                if (this.image !== this.sprites.attack1Left.image) {
                    this.image = this.sprites.attack1Left.image
                    this.framesMax = this.sprites.attack1Left.framesMax
                    this.framesCurrent = 0
                }
                break
            case "takeHit":
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break
            case "takeHitright":
                if (this.image !== this.sprites.takeHitright.image) {
                    this.image = this.sprites.takeHitright.image
                    this.framesMax = this.sprites.takeHitright.framesMax
                    this.framesCurrent = 0
                }
                break
            case "takeHitleft":
                if (this.image !== this.sprites.takeHitleft.image) {
                    this.image = this.sprites.takeHitleft.image
                    this.framesMax = this.sprites.takeHitleft.framesMax
                    this.framesCurrent = 0
                }
                break
            case "death":
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}
