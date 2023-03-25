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
    const convolver = audioContext.createConvolver();

    // Create an impulse response for the reverb effect
    const reverbLength = 1;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(2, reverbLength * sampleRate, sampleRate);
    const channelData = [buffer.getChannelData(0), buffer.getChannelData(1)];

    for (let i = 0; i < sampleRate; i++) {
        const progress = i / sampleRate;
        const decay = Math.exp(-3 * progress);
        const value = Math.random() * 2 - 1;
        channelData[0][i] = value * decay;
        channelData[1][i] = value * decay;
    }

    convolver.buffer = buffer;

    oscillator.type = 'triangle'; // Use a triangle wave for a softer, more ghostly sound
    oscillator.frequency.value = 75; // Lower frequency for a more ghostly sound
    oscillator.connect(gainNode);
    gainNode.connect(convolver);
    convolver.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}
