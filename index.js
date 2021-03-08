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
    document.getElementById("tapToPlay").addEventListener("click", removeInstructions);
}

function createStructure() {
    for (let i = 0; i < width * width; i++) {
        const div = document.createElement("div");
        div.id = i.toString();;
        div.className = "boxes";
        array.push(div);
        mainGrid.appendChild(div);
        div.addEventListener("click", () => {
            const begin = document.querySelectorAll(".highlight");
            begin.forEach((h) => { h.classList.remove("highlight"); });
            const lastClicked = document.querySelector(".highlight2");
            if (lastClicked != null) removeChoices(lastClicked);
            if (lastClicked == div) return;
            if (!div.classList.contains("safe") && !div.classList.contains("over")) { createChoices(div, i); };
        });
    };
    settingBombs();
    setNumber();
    setButton();
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
    div.classList.add("highlight2");
    const choices = document.createElement("div");
    choices.className = "choices";
    const flag = document.createElement("div");
    flag.id = "flag";
    flag.className = "flag";
    flag.innerHTML = "🚩";
    const close = document.createElement("div");
    close.id = "close";
    close.className = "close";
    close.innerHTML = "X";
    if (i % width === width - 1 || i % width === width - 2 || i % width === width - 3) {
        choices.style.right = "100px";
    }
    if (div.textContent == " 🚩 ") {
        choices.style.bottom = "60px";
        choices.style.justifyContent = "space-evenly";
    };
    choices.appendChild(flag);
    choices.appendChild(close);
    div.appendChild(choices);
    flag.addEventListener("click", (e) => {
        e.stopPropagation();
        removeChoices(div);
        updateFlagCount(div);
    });
    close.addEventListener("click", (e) => {
        e.stopPropagation();
        removeChoices(div);
    });
    const hammer = document.createElement("div");
    if (div.textContent == " 🚩 🚩X") return;
    hammer.id = "hammer";
    hammer.innerHTML = "🔨";
    choices.appendChild(hammer);
    hammer.addEventListener("click", (e) => {
        e.stopPropagation();
        removeChoices(div);
        if (div.classList.contains("bomb")) { gameOver(); } else { showNumber(i); };
    });
}

function removeChoices(div) {
    div.classList.remove("highlight2");
    div.removeChild(div.firstElementChild);
}

function updateFlagCount(tile) {
    if (!tile.classList.contains("safe") && !tile.classList.contains("over")) {
        if (tile.textContent == " 🚩 ") {
            tile.innerHTML = '';
            flagCount++;
        } else {
            tile.innerHTML = " 🚩 ";
            flagCount--;
        };
    }
    const flagsLeft = document.getElementById("flagCount");
    flagsLeft.innerHTML = `Flags left : ${flagCount}`;
    setTimeout(win(flagCount), 10);
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

function win(flagCount) {
    if (flagCount == 0 && bombArray.every((div) => { return div.textContent == " 🚩 " })) {
        const GM = document.getElementById("gameOver");
        GM.style.display = "inherit";
        GM.innerHTML = "WIN WIN";
    }
}

function gameOver() {
    bombArray.forEach(div => {
        div.innerHTML = ' 💣 ';
        div.classList.add("over");
    });
    const GM = document.getElementById("gameOver");
    GM.style.display = "inherit";
    GM.innerHTML = "💣GAME OVER💣";
}

function highlightEmptyTile() {
    const tile1 = zeroArray[0];
    tile1.classList.add("highlight");
    const tile2 = zeroArray[Math.round(zeroArray.length / 2)];
    tile2.classList.add("highlight");
}

function setButton() {
    const button = document.getElementById("refresh");
    button.style.display = "initial";
    button.addEventListener("click", refreshThePage);
}

function refreshThePage() {
    if (confirm("Do you really want to start a new game?")) {
        window.location.reload();
    }
}

function removeInstructions() {
    document.getElementById("instructions").style.display = "none";
    createStructure();
}