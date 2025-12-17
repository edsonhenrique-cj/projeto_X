const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 20;
    }

    update(keys) {
        // Steering
        if (keys.ArrowLeft || keys.KeyA) this.angle -= 0.05;
        if (keys.ArrowRight || keys.KeyD) this.angle += 0.05;

        // Forward acceleration
        if (keys.ArrowUp || keys.KeyW) {
            this.vx += Math.cos(this.angle) * 0.1;
            this.vy += Math.sin(this.angle) * 0.1;
        }

        // Reverse acceleration
        if (keys.ArrowDown || keys.KeyS) {
            this.vx -= Math.cos(this.angle) * 0.1;
            this.vy -= Math.sin(this.angle) * 0.1;
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Friction
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Speed limit
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 5) {
            this.vx = (this.vx / speed) * 5;
            this.vy = (this.vy / speed) * 5;
        }

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'green';
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        // Front indicator
        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(this.size/2, -this.size/4, 4, this.size/2);
        ctx.restore();
    }
}

class Projectile {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * 5;
        this.vy = Math.sin(angle) * 5;
        this.size = 5;
        this.life = 100; // frames
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Wrap
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}

class Enemy {
    constructor(size = 30) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * (30 / size); // Larger enemies move slower
        this.vy = (Math.random() - 0.5) * (30 / size);
        this.angle = 0;
        this.size = size;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += 0.05;

        // Wrap
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'red';
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

class Game {
    constructor() {
        this.tank = new Tank(canvas.width/2, canvas.height/2);
        this.projectiles = [];
        this.enemies = [];
        this.keys = {};
        this.score = 0;
        this.gameOver = false;
        this.init();
    }

    init() {
        for (let i = 0; i < 5; i++) {
            this.enemies.push(new Enemy());
        }
        this.setupInput();
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.shoot();
            }
            if (e.code === 'KeyR' && this.gameOver) {
                this.restart();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    shoot() {
        if (this.gameOver) return;
        this.projectiles.push(new Projectile(this.tank.x, this.tank.y, this.tank.angle));
    }

    update() {
        if (this.gameOver) return;
        this.tank.update(this.keys);
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => p.life > 0);
        this.enemies.forEach(e => e.update());
        this.checkCollisions();
    }

    checkCollisions() {
        this.projectiles.forEach((p, pi) => {
            this.enemies.forEach((e, ei) => {
                if (this.collide(p, e)) {
                    this.projectiles.splice(pi, 1);
                    this.enemies.splice(ei, 1);
                    this.score += Math.floor(50 / e.size) * 3; // Smaller enemies give more points, 3x multiplier
                    if (e.size > 10) {
                        for (let i = 0; i < 2; i++) {
                            let newSize = e.size / 2;
                            let newEnemy = new Enemy(newSize);
                            newEnemy.x = e.x + (Math.random() - 0.5) * 20;
                            newEnemy.y = e.y + (Math.random() - 0.5) * 20;
                            newEnemy.vx = (Math.random() - 0.5) * 4;
                            newEnemy.vy = (Math.random() - 0.5) * 4;
                            this.enemies.push(newEnemy);
                        }
                    }
                }
            });
        });

        this.enemies.forEach(e => {
            if (this.collide(this.tank, e)) {
                this.gameOver = true;
                document.getElementById('gameOver').style.display = 'block';
            }
        });
    }

    collide(a, b) {
        return Math.abs(a.x - b.x) < (a.size + b.size)/2 && Math.abs(a.y - b.y) < (a.size + b.size)/2;
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.tank.draw();
        this.projectiles.forEach(p => p.draw());
        this.enemies.forEach(e => e.draw());
        document.getElementById('score').textContent = 'Score: ' + this.score;
    }

    restart() {
        this.tank = new Tank(canvas.width/2, canvas.height/2);
        this.projectiles = [];
        this.enemies = [];
        this.score = 0;
        this.gameOver = false;
        document.getElementById('gameOver').style.display = 'none';
        this.init();
    }
}

const game = new Game();

function gameLoop() {
    game.update();
    game.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
