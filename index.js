document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initialise();
    };
    const mainGrid = document.getElementById("mainGrid");
});

var array = new Array,
    bombArray = new Array,
    zeroArray = [];

let width = 10;

function initialise() {
    createStructure();
}

function createStructure() {
    for (let i = 0; i < width * width; i++) {
        const div = document.createElement("div");
        div.id = i.toString();;
        div.className = "boxes";
        array.push(div);
        mainGrid.appendChild(div);
        div.addEventListener("click", () => {
            if (div.classList.contains("bomb")) {
                gameOver();
            } else {
                showNumber(i);
            };
        });
    };
    settingBombs();
    setNumber();
}

function settingBombs() {
    for (let i = 0; i < width * width / 5; i++) {
        const div = array[Math.round(Math.random() * 100)];
        bombArray.push(div);
        div.classList.add("bomb");
    };
}

function setNumber() {
    setTimeout(() => {
        for (let i = 0; i < width * width; i++) {
            let tile = array[i];
            // console.log(tile);
            if (!tile.classList.contains("bomb")) {
                let total = 0;
                let onLeftEdge = i % width === 0;
                let onRightEdge = i % width === width - 1;

                // UP LEFT
                if (i > 9 && !onLeftEdge && array[i - 1 - width].classList.contains("bomb")) total++;
                // UP
                if (i > 9 && array[i - width].classList.contains("bomb")) total++;
                // UP RIGHT
                if (i > 9 && !onRightEdge && array[i + 1 - width].classList.contains("bomb")) total++;
                // LEFT
                if (!onLeftEdge && array[i - 1].classList.contains("bomb")) total++;
                // RIGHT
                if (!onRightEdge && array[i + 1].classList.contains("bomb")) total++;
                // DOWN LEFT
                if (i < 90 && !onLeftEdge && array[i - 1 + width].classList.contains("bomb")) total++;
                // DOWN
                if (i < 90 && array[i + width].classList.contains("bomb")) total++;
                // DOWN RIGHT
                if (i < 90 && !onRightEdge && array[i + 1 + width].classList.contains("bomb")) total++;

                if (total) tile.setAttribute("data", total.toString());
                else zeroArray.push(tile);
            }
        };
        highlightEmptyTile();
    }, 10);
}

function highlightEmptyTile() {
    const tile1 = zeroArray[0];
    tile1.classList.add("highlight");
    tile1.addEventListener("click", () => {
        tile1.classList.remove("highlight");
        tile2.classList.remove("highlight");
    });
    const tile2 = zeroArray[zeroArray.length - 1];
    tile2.classList.add("highlight");
    tile2.addEventListener("click", () => {
        tile1.classList.remove("highlight");
        tile2.classList.remove("highlight");
    });
}

function gameOver() {
    bombArray.forEach(div => {
        div.innerHTML = ' 💣 ';
    });
    setTimeout(() => { alert("Game Over") }, 10);
}

function showNumber(i) {
    if (!array[i].classList.contains("bomb") && !array[i].textContent) {
        const tile = array[i];
        const data = tile.getAttribute("data");
        tile.classList.add("safe");
        if (data != null) {
            const total = parseInt(data);
            if (total == 1) tile.classList.add("one");
            if (total == 2) tile.classList.add("two");
            if (total == 3) tile.classList.add("three");
            if (total == 4) tile.classList.add("four");
            if (total == 5) tile.classList.add("five");
            if (total == 6) tile.classList.add("six");
            tile.innerHTML = total;
            console.log(total);
            return;
        } else { showSurroundingNumber(i); };
    };
}

function showSurroundingNumber(i) {
    const onLeftEdge = i % width === 0;
    const onRightEdge = i % width === width - 1;
    setTimeout(() => {

        // UP LEFT
        if (i > 9 && !onLeftEdge) showNumber(i - 1 - width);
        // UP
        if (i > 9) showNumber(i - width);
        // UP RIGHT
        if (i > 9 && !onRightEdge) showNumber(i + 1 - width);
        // LEFT
        if (!onLeftEdge) showNumber(i - 1);
        // RIGHT
        if (!onRightEdge) showNumber(i + 1);
        // DOWN LEFT
        if (i < 90 && !onLeftEdge) showNumber(i - 1 + width);
        // DOWN
        if (i < 90) showNumber(i + width);
        // DOWN RIGHT
        if (i < 90 && !onRightEdge) showNumber(i + 1 + width);
    }, 10);
}