// DOM elements and setting global stats
const baseCurr = document.getElementById("from-currency"),
    finalCurr = document.getElementById("to-currency"),
    baseAmt = document.getElementById("from-amount"),
    finalAmt = document.getElementById("to-amount"),
    swap = document.getElementById("swap"),
    compare = document.getElementById("compare"),
    sort = document.getElementById("sort");
let ratesObj = {},
    finalArr = [];

// checks for the latest rates as the api updates once in 24 hours
function checkToUpdate() {
    const last = localStorage.lastRates;
    if (!last) return true;
    if (Date.now() > JSON.parse(last)["nextUpdate"]) return true;
    return false;
}

// gets the rates from the exchangerate-api.com/docs/free (free & open access)
async function getRatesObj() {
    return fetch("https://open.er-api.com/v6/latest").then(r => r.json());
}

// fill <select> in HTML with the required options
function setDOM(rates) {
    rates.map((r) => {
        const opt = document.createElement("option");
        opt.innerText = r[0];
        opt.value = r[0];
        baseCurr.appendChild(opt);
    });
    rates.reverse().map((r) => {
        const opt = document.createElement("option");
        opt.innerText = r[0];
        opt.value = r[0];
        finalCurr.appendChild(opt);
    });
}

//display last time updated in HTML
function lastUpdated(t) {
    let time = new Date(t),
        p = document.getElementById("lastUpdated"),
        date = time.toDateString().substring(4),
        hrs = time.getHours(),
        min = time.getMinutes(),
        suffix = '';
    if (hrs <= 12) suffix = 'am';
    else {
        hrs -= 12;
        suffix = 'pm'
    }
    p.innerHTML += date + " at " + hrs + " : " + min + ' ' + suffix;
}

// fetching the rates from the api, if needed and setting HTML
async function setConversions() {

    // checkToUpdate is to check the local storage for latest rates   
    if (checkToUpdate()) {

        // if the condition comes true
        ratesObj = await getRatesObj();

        // save the rates till the next update
        const lastRates = {
            "lastUpdate": ratesObj.time_last_update_unix * 1000,
            "nextUpdate": ratesObj.time_next_update_unix * 1000,
            "rates": ratesObj.rates
        };
        localStorage.setItem("lastRates", JSON.stringify(lastRates));

        ratesObj["lastUpdate"] = ratesObj.time_last_update_unix * 1000;
    }

    // if the condition comes false and local storage has latest rates
    else ratesObj = JSON.parse(localStorage.lastRates);

    setDOM(Object.entries(ratesObj.rates));
    lastUpdated(ratesObj["lastUpdate"]);
}

// converting in the required currency, then writing the HTML
function convert() {
    const bc = ratesObj.rates[baseCurr.selectedOptions[0].innerText];;
    const fc = ratesObj.rates[finalCurr.selectedOptions[0].innerText];
    finalAmt.value = baseAmt.value * (fc / bc);
}

// swapping the currencies in the two <select> tags
function swapCurrency() {
    const length = baseCurr.childElementCount;
    const from = baseCurr.selectedIndex;
    const to = finalCurr.selectedIndex;
    baseCurr.selectedIndex = length - to - 1;
    finalCurr.selectedIndex = length - from - 1;
    convert();
}

// return an array containing all final amount in each currency
function getConvertedArray() {
    const baseC = baseCurr.selectedOptions[0].innerText;
    const baseA = baseAmt.value;
    let finalA = 0;
    let arr = [];
    for (let finalC in ratesObj.rates) {
        if (finalC == baseC) continue;
        finalA = baseA * (ratesObj.rates[finalC] / ratesObj.rates[baseC]);
        arr.push([finalC, finalA]);
    }
    return arr;
}

//clear HTML in .all>div container
function clearField(div) {
    div.innerHTML = '';
}

// create HTML
function showInHTML(arr) {
    const all = document.querySelector(".all"),
        div = all.getElementsByTagName("div")[0];
    clearField(div);
    const baseC = baseCurr.selectedOptions[0].innerText;
    const baseA = baseAmt.value;
    arr.forEach(a => {
        const p = document.createElement("p");
        p.innerHTML = baseA + ' ' + baseC + ' = ' + a[1] + ' ' + a[0];
        div.appendChild(p);
        if (a[0] == finalCurr.selectedOptions[0].innerText) p.id = "current";
    });
    all.classList.add("show");
}

// sorting finalArr by relevance
function sortByRelevance() {
    let check1 = finalCurr.selectedOptions[0].innerText.charAt(0),
        check2 = baseCurr.selectedOptions[0].innerText.charAt(0);
    showInHTML(finalArr.sort((a, b) => {
        let rv = 0,
            af = a[0].charAt(0),
            bf = b[0].charAt(0);
        if (af == check1 || af == check2) rv = -1;
        if (bf == check1 || bf == check2) rv += 1;
        return rv;
    }));
    sort.innerText = 'Sorted by Relevance';
}

//sorting finalArr by low to high
function sortByLowToHigh() {
    showInHTML(finalArr.sort((a, b) => a[1] - b[1]));
    sort.innerText = 'Sorted by Low to High';
}

//sorting finalArr by high to low
function sortByHighToLow() {
    showInHTML(finalArr.sort((a, b) => b[1] - a[1]));
    sort.innerText = 'Sorted by High to Low';
}

// convert the base amount in each currency
function convertInAll() {
    finalArr = getConvertedArray();
    sortByRelevance();
}

// sort the conversions on differnet basis
function sortBy() {
    let applied = sort.innerText.slice(10);
    switch (applied) {
        case "High to Low":
            sortByRelevance();
            break;
        case "Relevance":
            sortByLowToHigh();
            break;
        case "Low to High":
            sortByHighToLow();
            break;
    }
}

// setting the exchange rates with the latest data
setConversions();

// EVENT listeners
baseAmt.addEventListener("input", () => {
    convert();

    // displaying the compare button
    setTimeout(() => compare.style.visibility = "visible", 1000);
});
[baseCurr, finalCurr].forEach((s) => {
    s.addEventListener("input", () => { if (baseAmt.value) convert() })
});
swap.addEventListener("click", swapCurrency);
compare.addEventListener("click", convertInAll);
sort.addEventListener("click", sortBy);