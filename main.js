let rowWidth = 0;
let cells = [];
let cellsValues = [];
let nextStepLoop = null;

const cellAliveNeighbors = (number) => {
    let aliveNeighbors = 0;

    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const cellIndex = number - rowWidth * i - j;
            const cell = cells[cellIndex];

            if (cell && cellIndex !== number) {
                const cellAlive = cell.classList.contains('alive');

                if (cellAlive) {
                    aliveNeighbors++;
                }
            }
        }
    }

    return aliveNeighbors;
}

const checkFirstRule = (number) => {
    if (cellAliveNeighbors(number) === 3) {
        cellsValues[number] = true;
    }
}

const checkSecondRule = (number) => {
    const aliveNeighbors = cellAliveNeighbors(number);
    if (aliveNeighbors !== 2 && aliveNeighbors !== 3) {
        cellsValues[number] = false;
    }
}

const nextStep = () => {
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const cellIsAlive = cell.classList.contains('alive');
        cellsValues.push(cellIsAlive);

        if (cellIsAlive) {
            checkSecondRule(i);
        } else {
            checkFirstRule(i);
        }
    }

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const cellWasAlive = cell.classList.contains('alive');
        const cellValue = cellsValues[i];

        if (!cellWasAlive && cellValue) {
            cell.classList.add('alive');
        } else if (cellWasAlive && !cellValue) {
            cell.classList.remove('alive');
        }
    }
}

const toggleCell = (number) => {
    const cell = document.getElementById(number);
    cell.classList.toggle('alive');
}

const buildCell = (number) => {
    let cell = document.createElement('div');
    cell.classList.add('grid__cell');
    cell.id = `cell_${number}`;
    cell.addEventListener('click', () => toggleCell(cell.id))

    return cell;
}

const buildRow = (cellsNumber, lastCellNumber) => {
    let row = document.createElement('div');
    row.classList.add('grid__row');

    for (let j = 0; j < cellsNumber; j++) {
        row.append(buildCell(lastCellNumber));
        lastCellNumber++;
    }

    return {
        element: row,
        lastCellNumber
    }
}

const buildGrid = () => {
    const rowsNumber = 25;
    let lastCellNumber = 0;

    for (let i = 0; i < rowsNumber; i++) {
        const row = buildRow(rowWidth, lastCellNumber);

        lastCellNumber = row.lastCellNumber;
        grid.append(row.element);
    }

    cells = document.querySelectorAll('.grid__cell');
}

window.addEventListener('DOMContentLoaded', () => {
    const cellWidthAndHeight = 16;
    rowWidth = Math.round(grid.offsetWidth / cellWidthAndHeight);

    buildGrid();

    clearButton.addEventListener('click', () => {
        clearInterval(nextStepLoop);
        cellsValues = [];
        startButton.hidden = false;
        breakButton.hidden = true;
        grid.innerHTML = '';
        buildGrid();
    });

    startButton.addEventListener('click', () => {
        startButton.hidden = true;
        breakButton.hidden = false;
        nextStepLoop = setInterval(() => {
            nextStep();
        }, 100);
    });

    breakButton.addEventListener('click', () => {
        startButton.hidden = false;
        breakButton.hidden = true;
        clearInterval(nextStepLoop);
    });
});