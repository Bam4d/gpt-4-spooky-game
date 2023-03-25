const gameContainer = document.getElementById('game-container');
const gridSize = 5;
const grid = [];

for (let row = 0; row < gridSize; row++) {
    const gridRow = [];
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        if (row === 0 && col === 0) {
            cell.classList.add('avatar');
        } else {
            cell.classList.add('ground');
        }
        cell.addEventListener('click', () => moveAvatar(row, col));
        gameContainer.appendChild(cell);
        gridRow.push(cell);
    }
    grid.push(gridRow);
}

gameContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

let avatarRow = 0;
let avatarCol = 0;

function moveAvatar(newRow, newCol) {
    if (Math.abs(avatarRow - newRow) + Math.abs(avatarCol - newCol) > 1) {
        return;
    }

    const newCell = grid[newRow][newCol];
    if (!newCell.classList.contains('ground')) {
        return;
    }

    const oldCell = grid[avatarRow][avatarCol];
    setTimeout(() => {
      oldCell.classList.remove('avatar');
      oldCell.classList.add('walked');

      newCell.classList.remove('ground');
      newCell.classList.add('avatar');
  }, 250); // Add a delay before changing the cell class

    avatarRow = newRow;
    avatarCol = newCol;

    playSpookySound(); // Play the spooky sound when the avatar moves
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSpookySound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 100; // Low-frequency sound
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}
