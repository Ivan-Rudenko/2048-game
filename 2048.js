const grid = document.querySelector('.grid');
const size = 4;
let board = Array(size).fill().map(() => Array(size).fill(0));
let score = 0;

// Создаем пустую сетку
function createGrid() {
    grid.innerHTML = '';
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.value = board[row][col];
            cell.textContent = board[row][col] === 0 ? '' : board[row][col];
            grid.appendChild(cell);
        }
    }
    document.getElementById('ScoreNumber').textContent = score;
}

// Добавляем новую плитку
function addNewTile() {
    const emptyCells = [];
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 0) emptyCells.push({ row, col });
        }
    }
    if (emptyCells.length === 0) return;

    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
    createGrid();
}

// Движение плиток
function slide(row) {
    const filteredRow = row.filter(val => val !== 0);
    const empty = Array(size - filteredRow.length).fill(0);
    return [...filteredRow, ...empty];
}

function combine(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}

function moveLeft() {
    for (let row = 0; row < size; row++) {
        board[row] = slide(combine(slide(board[row])));
    }
}

function moveRight() {
    for (let row = 0; row < size; row++) {
        board[row] = slide(combine(slide(board[row].reverse()))).reverse();
    }
}

function moveUp() {
    for (let col = 0; col < size; col++) {
        let column = board.map(row => row[col]);
        column = slide(combine(slide(column)));
        for (let row = 0; row < size; row++) {
            board[row][col] = column[row];
        }
    }
}

function moveDown() {
    for (let col = 0; col < size; col++) {
        let column = board.map(row => row[col]);
        column = slide(combine(slide(column.reverse()))).reverse();
        for (let row = 0; row < size; row++) {
            board[row][col] = column[row];
        }
    }
}

function checkGameOver() {
    return board.flat().every(cell => cell !== 0);
}

window.addEventListener('keydown', (event) => {
    if (checkGameOver()) return;

    switch (event.key) {
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        default: return;
    }

    addNewTile();
    createGrid();
});

document.getElementById('newGameButton').addEventListener('click', () => {
    board = Array(size).fill().map(() => Array(size).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
    createGrid();
});

addNewTile();
addNewTile();
createGrid();
