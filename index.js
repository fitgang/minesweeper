document.addEventListener("readystatechange", (event) => {
    const mainGrid = document.getElementById("mainGrid");
    const flagsLeft = document.getElementById("flagCount");
    var flagCount = width * width / 5;
    flagsLeft.innerHTML = `Flags left : ${flagCount}`;
    if (event.target.readyState === "complete") {
        initialise();
    };
});
let width = 10;
var array = new Array,
    bombArray = new Array,
    zeroArray = new Array;


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
        div.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            updateFlagCount(div);
        });
        div.addEventListener("click", () => {
            if (div.textContent == " 🚩 ") return;
            if (div.classList.contains("bomb")) {
                gameOver();
            } else {
                showNumber(i);
            };
        });
        //  div.addEventListener("click", () => { createChoices(div, i); });
    };
    settingBombs();
    setNumber();
}

function settingBombs() {
    for (let i = 0; bombArray.length < width * width / 5; i++) {
        const div = array[Math.floor(Math.random() * 100)];
        if (!bombArray.includes(div)) {
            bombArray.push(div);
            div.classList.add("bomb");
        };
    };
    flagCount = bombArray.length;
}

function setNumber() {
    setTimeout(() => {
        for (let i = 0; i < width * width; i++) {
            let tile = array[i];
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

function createChoices(div, i) {
    const flag = document.createElement("div");
    flag.id = "flag";
    flag.innerHTML = "🚩";
    const close = document.createElement("div");
    close.id = "close";
    close.innerHTML = "X";
    const hammer = document.createElement("div");
    hammer.id = "hammer";
    hammer.innerHTML = "🔨";
    div.appendChild(flag);
    div.appendChild(close);
    div.appendChild(hammer);
    flag.addEventListener("click", () => {
        removeChoices(flag, close, hammer);
        updateFlagCount(div);
    });
    close.addEventListener("click", () => { removeChoices(flag, close, hammer); });
    hammer.addEventListener("click", () => {
        removeChoices(flag, close, hammer);
        if (div.classList.contains("bomb")) { gameOver(); } else { showNumber(i); };
    });
}

function removeChoices(flag, close, hammer) {
    flag.remove();
    close.remove();
    hammer.remove();
}

function updateFlagCount(tile) {
    if (!tile.classList.contains("safe") && !tile.classList.contains("over")) {
        if (tile.textContent == " 🚩 ") {
            tile.innerHTML = '';
            flagCount++;
        } else {
            tile.textContent = " 🚩 ";
            flagCount--;
        }
    }
    const flagsLeft = document.getElementById("flagCount");
    flagsLeft.innerHTML = `Flags left : ${flagCount}`;
    if (flagCount == 0 && bombArray.every((div) => { return div.textContent == " 🚩 " })) document.getElementById("gameOver").innerHTML = "WIN WIN";
}

function showNumber(i) {
    const tile = array[i];
    if (!tile.classList.contains("bomb") && !tile.classList.contains("safe")) {
        const data = tile.getAttribute("data");
        tile.classList.add("safe");
        if (data != null) {
            const total = parseInt(data);
            switch (total) {
                case 1:
                    tile.classList.add("one");
                    break;
                case 2:
                    tile.classList.add("two");
                    break;
                case 3:
                    tile.classList.add("three");
                    break;
                case 4:
                    tile.classList.add("four");
                    break;
                case 5:
                    tile.classList.add("five");
                    break;
                case 6:
                    tile.classList.add("six");
                    break;
            }
            tile.innerHTML = total;
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

function gameOver() {
    bombArray.forEach(div => {
        div.innerHTML = ' 💣 ';
        div.classList.add("over");
    });
    document.getElementById("gameOver").innerHTML = "!GAME OVER";
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