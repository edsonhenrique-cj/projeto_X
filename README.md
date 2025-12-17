# Tank Shooting Game
# A volta do bug @Litch.
A browser-based tank shooting game inspired by Asteroids, featuring car-like tank controls and progressive enemy fragmentation.

## How to Play

1. Open `index.html` in your web browser
2. Use keyboard controls to drive the tank and shoot enemies
3. Avoid colliding with red enemy squares
4. Destroy enemies by shooting them - larger enemies split into smaller ones
5. Earn points for each enemy destroyed

## Controls

- **Arrow Keys or WASD**: Control the tank
  - Left/Right: Steer (turn)
  - Up: Accelerate forward
  - Down: Accelerate backward (reverse)
- **Spacebar**: Shoot projectiles
- **R**: Restart game when game over

## Game Features

- **Car-like Physics**: Tank has momentum, friction, and realistic driving mechanics
- **Enemy Fragmentation**: Large enemies (red squares) split into smaller enemies when destroyed
- **Screen Wrapping**: All objects wrap around screen edges like classic Asteroids
- **Progressive Difficulty**: Smaller enemies move faster and give more points
- **Scoring System**: Points awarded based on enemy size (smaller = more points)

## Technical Details

- Built with HTML5 Canvas and vanilla JavaScript
- No external dependencies required
- Runs entirely in the browser

## Files

- `index.html`: Main HTML page
- `style.css`: Styling for the game
- `game.js`: Game logic and rendering
- `README.md`: This file

Enjoy the game!
