const spentIcon = "https://raw.githubusercontent.com/Yantchili/Control-de-Gasto/1dd3c4882de924a49d9a9c8ab2bc209811509671/bag-shopping-solid.svg"
const incomeIcon = "credit-card-regular.svg"
const closeIcon = "close-icon.svg"
const form = document.querySelector("#form")
const itemlist = document.querySelector("#listaHistorial")
let itemId = 1
let listOfItems = []
getStorage()
let spent = parseFloat(document.querySelector("#numGasto").innerText)
let income = parseFloat(document.querySelector("#numIngreso").innerText)
let total = parseFloat(document.querySelector("#numTotal").innerText)
form.addEventListener("submit",
    addNew
)

async function addNew(event) {
    event.preventDefault()
    const qty = parseFloat(document.querySelector("#cantidad").value)
    if (isNaN(qty)) {
        window.alert("Tiene que ser un número")
    }
    else {
        playSound01()
        const date = getTime()
        const concept = document.querySelector("#concept").value
        const item = document.createElement("li")
        item.setAttribute("id", itemId)
        item.setAttribute("value", qty)
        const itemList = [concept, qty, item.id, date]
        listOfItems.push(itemList)
        itemId += 1
        if (qty < 0) {
            item.innerHTML = `
        <div id="div01">
            <span id="icon"><img src="${spentIcon}" style="color:#8a8aeb"></span>
            <div>
            <p>${concept} </p>
            <span id="date">${date}</span>
            </div>
        </div>
        <div id="div02">
        <P>${qty} </P>
        <button onclick="deleteItem(${item.id})"><img src="${closeIcon}"></i></button>
        </div>
        `
        }
        else {
            item.innerHTML = `
            <div id="div01">
            <span id="icon"><img src="${incomeIcon}" style="color:#8a8aeb"></span>
            <div>
            <p>${concept} </p>
            <span id="date">${date}</span>
            </div>
            </div>
            <div id="div02">
            <P>${qty} </P>
            <button onclick="deleteItem(${item.id})"><img src="${closeIcon}"></button>
            </div>
        `
        }

        itemlist.prepend(item)
        if (qty > 0) {
            addIncome(qty)
        }
        else { addSpent(qty) }
        calculate()
        document.querySelector("#concept").value = ""
        document.querySelector("#cantidad").value = ""
        store()

    }
}




async function deleteItem(id) {
    const itemToEliminate = document.getElementById(`${id}`)
    const qty = itemToEliminate.value
    if (qty > 0) { addIncome(-qty) }
    else { addSpent(-qty) }
    calculate(income, spent)

    deleteFromList(id)
    itemToEliminate.remove()
    playSound02()
    store()
}

function deleteFromList(id) {

    for (let item of listOfItems) {
        if (item != null) {
            if (item[2] == id) {
                const index = listOfItems.indexOf(item)
                listOfItems[index] = null

            }
        }
    }

}


async function calculate() {
    total = income + spent
    document.querySelector("#numTotal").innerText = `${total.toFixed(2)}`
}

function addIncome(qty) {
    income += qty
    document.querySelector("#numIngreso").innerText = `${income.toFixed(2)}`

}
function addSpent(qty) {
    spent += qty
    document.querySelector("#numGasto").innerText = `${spent.toFixed(2)}`
}

function store() {
    let storeditems = {
        "total": total,
        "spent": spent,
        "income": income,
        "items": listOfItems,
        "itemId": itemId,
    }
    localStorage.setItem("key", JSON.stringify(storeditems))
}

function getTime() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let currentDate = `${month}-${day}-${year} ${hour}:${minute}`;
    return currentDate
}

function getStorage() {
    const info = JSON.parse(localStorage.getItem("key"))
    if (info !== null) {
        if (info.total !== null) { document.querySelector("#numTotal").innerText = info.total.toFixed(2) }
        else {
            document.querySelector("#numTotal").innerText = 0
        }
        if (info.spent !== null) { document.querySelector("#numGasto").innerText = info.spent.toFixed(2) }
        else {
            document.querySelector("#numGasto").innerText = 0
        }
        if (info.income !== null) { document.querySelector("#numIngreso").innerText = info.income.toFixed(2) }
        else {
            document.querySelector("#numIngreso").innerText = 0
        }
        if (info.itemId !== null) {
            itemId = info.itemId
        }
        if (info.items !== null) {
            listOfItems = info.items
            printItems(listOfItems)
        }
    }
}


function printItems(listOfItems) {
    itemlist.innerHTML = ""
    for (let i of listOfItems) {
        if (i != null) {
            const concept = i[0]
            const qty = i[1]
            const id = i[2]
            const date = i[3]
            const oldItem = document.createElement("li")
            oldItem.setAttribute("id", id)
            oldItem.setAttribute("value", qty)
            if (qty < 0) {
                oldItem.innerHTML =
                    `
                    <div id="div01">
                    <span id="icon"><img src="${spentIcon}" style="color:#8a8aeb"></span>
                    <div>
                    <p>${concept} </p>
                    <span id="date">${date}</span>
                   
                    </div>
                    </div>
                    <div id="div02">
                    <P>${qty} </P>
                    <button onclick="deleteItem(${oldItem.id})"><img src="${closeIcon}"></button>
                    </div>
`
            }
            else {
                oldItem.innerHTML =
                    `<div id="div01">
                    <span id="icon"><img src="${incomeIcon}" style="color:#8a8aeb"></span>
                    <div>
                    <p>${concept} </p>
                    <span id="date">${date}</span>
                    </div>
                    </div>
                    <div id="div02">
                    <P>${qty} </P>
                    <button onclick="deleteItem(${oldItem.id})"><img src="${closeIcon}"></i></button>
                    </div>
`
            }
            itemlist.appendChild(oldItem)
        }
    }

}

function playSound01() {
    const sound = document.getElementById("audio01")
    sound.playbackRate = 2
    sound.play();
}
function playSound02() {
    const sound = document.getElementById("audio02")
    sound.playbackRate = 1.5
    sound.play();
}
getStorage()
