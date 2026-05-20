let jugador: Sprite = null
let animales: Sprite[] = []
let enemigos: Sprite[] = []
let comida: Sprite[] = []
let puntos = 0
let nivel = 1
let vidas = 3
let tipoAnimal = 0
let nombresAnimales = ["LEON", "ELEFANTE", "AGUILA", "TIBURON", "SERPIENTE"]
let coloresAnimales = [2, 7, 4, 8, 5]

scene.setBackgroundColor(9)
function iniciarJuego() {
    puntos = 1
    nivel = 1
    vidas = 3
    tipoAnimal = 0

    animales = []
    enemigos = []
    comida = []

    crearJugador()
    spawnAnimales(3)
    spawnEnemigos(2)
    spawnComida(5)

    game.onUpdate(function () {
        actualizarJuego()
    })
}

function crearJugador() {
    let spriteJugador = sprites.create(crearLEON(), SpriteKind.Player)
    spriteJugador.setPosition(80, 60)
    spriteJugador.setStayInScreen(true)
    jugador = spriteJugador

    controller.moveSprite(jugador, 100, 100)
}

function spawnAnimales(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
        let tipo = Math.randomRange(0, 4)
        let sprite: Sprite

        if (tipo == 0) sprite = sprites.create(crearLeon(1), SpriteKind.Food)
        else if (tipo == 1) sprite = sprites.create(crearElefante(1), SpriteKind.Food)
        else if (tipo == 2) sprite = sprites.create(crearAguila(1), SpriteKind.Food)
        else if (tipo == 3) sprite = sprites.create(crearTiburon(1), SpriteKind.Food)
        else sprite = sprites.create(crearSerpiente(1, SpriteKind.Food)

        .setPosition(Math.randomRange(10, 150), Math.randomRange(10, 110))
        .setVelocity(Math.randomRange(-20, 20), Math.randomRange(-20, 20))
        .setBounceOnWall(true)
    .push(sprite)  
    }
}

function spawnEnemigos(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
        let enemigo = sprites.create(crearCazador(), SpriteKind.Enemy)
        enemigo.setPosition(Math.randomRange(10, 150), Math.randomRange(10, 110))
        enemigo.setVelocity(Math.randomRange(-30, 30), Math.randomRange(-30, 30))
        enemigo.setBounceOnWall(true)
        enemigos.push(enemigo)
    }
}

function spawnComida(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
        let tipoComida = Math.randomRange(0, 2)
        let sprite: Sprite

        if (tipoComida == 0) sprite = sprites.create(crearCarne(), SpriteKind.Food)
        else if (tipoComida == 1) sprite = sprites.create(crearPlanta(), SpriteKind.Food)
        else sprite = sprites.create(crearPez(), SpriteKind.Food)

        sprite.setPosition(Math.randomRange(10, 150), Math.randomRange(10, 110))
        comida.push(sprite)
    }
}

function actualizarJuego() {
    for (let enemigo of enemigos) {
        if (jugador.x < enemigo.x) enemigo.vx = -20 - nivel * 5
        else enemigo.vx = 20 + nivel * 5

        if (jugador.y < enemigo.y) enemigo.vy = -20 - nivel * 5
        else enemigo.vy = 20 + nivel * 5
    }

    for (let animal of animales) {
        if (Math.randomRange(0, 100) < 5) {
            animal.setVelocity(Math.randomRange(-30, 30), Math.randomRange(-30, 30))
        }
    }
}
info.setScore(0)
info.setLife(3)
iniciarJuego()
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tipoAnimal < 4) {
        tipoAnimal += 1
    } else {
        tipoAnimal = 0
    }

    jugador.destroy()

    if (tipoAnimal == 0) jugador = sprites.create(crearLeon(), SpriteKind.Player)
    else if (tipoAnimal == 1) jugador = sprites.create(crearElefante(), SpriteKind.Player)
    else if (tipoAnimal == 2) jugador = sprites.create(crearAguila(), SpriteKind.Player)
    else if (tipoAnimal == 3) jugador = sprites.create(crearTiburon(), SpriteKind.Player)
    else jugador = sprites.create(crearSerpiente(), SpriteKind.Player)

    jugador.setPosition(80, 60)
    jugador.setStayInScreen(true)
    controller.moveSprite(jugador, 100, 100)

    game.splash(nombresAnimales[tipoAnimal])
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    let proyectil = sprites.createProjectileFromSprite(crearFuego(), jugador, 0, -100)
    proyectil.setKind(SpriteKind.Projectile)
})

// ============================================
// PROYECTILES
// ============================================

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy()
    puntos += 50
    info.changeScoreBy(50)

    enemigos = enemigos.filter(function (value, index) {
        return value != otherSprite
    })

    if (enemigos.length == 0) {
        nivel += 1
        spawnEnemigos(2 + nivel)
        game.splash("NIVEL " + nivel)
    }
})