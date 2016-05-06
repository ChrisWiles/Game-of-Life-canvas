// Note: the universe is finite. Some patterns grow too much and hit the border, compromising future states.
// http://dotat.at/prog/life/life.html
// http://www.conwaylife.com/wiki/List_of_common_oscillators
// http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
// show diff color for old vs new cells
// removed grid, slows FPS alot
// function: on click add cells 
// add a step button
// drag and drop your own lifeforms
// add option for random seeding of cells
// Fix layout, Generation and Live cells are not level

// There are a few classic ways of speeding up the game of life.
// Use a change list, and only look at cells changed in the last generation and their neighbors.
// Use lookup tables mapping sets of cells to their result in the next generation
// Use bitwise instructions to calculate the results of several cells in parallel
// add neighbourCoords array to each cell

$(function() {
    "use strict";
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    let isPaused = false;
    let liveCells = 0;
    let cells = [];
    let cellSize = 7;
    let gridSizeX = width / cellSize;
    let gridSizeY = height / cellSize;
    let $generation = $('#left');
    let $lives = $('#right');
    let generation = 0;
    let totalCells = gridSizeX * gridSizeY;

    $('#ex1').slider({
        formatter: function(value) {

            reset();
            cellSize = value;
            gridSizeX = width / cellSize;
            gridSizeY = height / cellSize;


            return 'Cell Size: ' + value;
        }
    });

    function pause(selector) {
        if (isPaused) {
            $(selector).text('Pause');
            requestAnimationFrame(render);
            isPaused = false;
        } else {
            $(selector).text('Resume');
            isPaused = true;
        }
    }
    $('#pause').click(function() {
        let selector = $(this);
        pause(selector);
    });

    function reset() {
        createState();
        generation = 0;
        ctx.clearRect(0, 0, width, height);
    }

    $('#reset').click(function() {
        reset();
    });

    // create 2d array of random cells
    function createState() {
        for (var i = 0; i < gridSizeX; i++) {
            cells[i] = [];
            for (var j = 0; j < gridSizeY; j++) {
                // returns alive 1/3 of the time
                cells[i][j] = Math.round(Math.random()) ? Math.round(Math.random()) : 0;
            }
        }
    }
    createState();
    render();

    // Use a change list, and only look at cells changed in the last generation and their neighbors.
    function changeList() {
        // 
    }

    // returns the number of living neighbor cells
    function numNeighbors(x, y) {

        let neighbors = 0;


        // check if the cell exists, aka not outside the bounds
        // Cannot read property '-1' of undefined
        function isValid(x, y) {
            // if cells[x] returns unfined then cells[x][y] isnt checked
            // cells[x][y] would return "Cannot read property of undefined"
            // console.log(cells[x] && cells[x][y])
            return cells[x] && cells[x][y];
        }

        // if the sum of all nine fields is 3, the inner field state for the next generation will be life (no matter of its previous contents); if the all-field sum is 4, the inner field retains its current state and every other sum sets the inner field to death.

        // There are 8 cases to check
        // 1 2 3
        // 4 X 5
        // 6 7 8 

        // case 1
        if (isValid(x - 1, y + 1)) neighbors++;
        // case 2
        if (isValid(x, y + 1)) neighbors++;
        // case 3
        if (isValid(x + 1, y + 1)) neighbors++;
        // case 4
        if (isValid(x - 1, y)) neighbors++;
        // case 5
        if (isValid(x + 1, y)) neighbors++;
        // case 6
        if (isValid(x - 1, y - 1)) neighbors++;
        // case 7
        if (isValid(x, y - 1)) neighbors++;
        // case 8
        if (isValid(x + 1, y - 1)) neighbors++;

        return neighbors;
    }

    function isAlive() {
        liveCells = 0;
        const copy = [];
        for (var i = 0; i < gridSizeX; i++) {
            copy[i] = [];
            for (var j = 0; j < gridSizeY; j++) {

                let liveNeighbors = numNeighbors(i, j);

                if (cells[i][j] === 1) {
                    // Any live cell with fewer than two live neighbors dies, as if caused by under-population.
                    // Any live cell with more than three live neighbors dies, as if by over-population.
                    if (liveNeighbors < 2 || liveNeighbors > 3) {
                        copy[i][j] = 0;

                        // Any live cell with two or three live neighbors  lives on to the next generation.
                    } else {
                        liveCells++;
                        copy[i][j] = 1;
                    }
                    // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                } else {
                    if (liveNeighbors === 3) {
                        liveCells++;
                        copy[i][j] = 1;
                    } else {
                        copy[i][j] = 0;
                    }
                }
            }
        }
        cells = copy;
        generation++;
        totalCells = gridSizeX * gridSizeY;
        const livingPrecent = ((liveCells / totalCells) * 100).toFixed(1);
        $generation.text("Generation: " + generation);
        $lives.text(" Live cells: " + liveCells + ' ' + livingPrecent + '%: ');

        // update cells
        if (!isPaused) {
            var animate = requestAnimationFrame(render);
        } else {
            cancelAnimationFrame(animate);
        }
    }

    function render() {

        ctx.fillStyle = '#00FFFF';
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < gridSizeX; i++) {
            for (var j = 0; j < gridSizeY; j++) {
                ctx.beginPath();
                ctx.arc(i * cellSize, j * cellSize, cellSize / 2, 0, 2 * Math.PI);
                //ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize);

                if (cells[i][j] === 1) {
                    ctx.fill();
                    //ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
                }
            }
        }
        isAlive();
    }
});