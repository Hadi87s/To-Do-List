let myTextinput = document.querySelector(".text-input");
let mySubmitBtn = document.querySelector(".add");
let resultsWindow = document.querySelector(".tasks")
let clearBtn = document.querySelector(".clear");
let countIndex;
let elementsIn = 0;

window.onload = () => {
    loadFromStorage();
    countIndex = parseInt(window.localStorage.getItem("counter"), 10) || 0;
};

function addToAll(text) {
    const sanitizedText = addToTasks(text);
    addToStorage(countIndex, sanitizedText);
}

function createTaskElement(text) {
    const newDiv = document.createElement("div");
    const newDeleteBtn = document.createElement("button");

    newDiv.classList.add("createdContainer");
    newDiv.textContent = text;

    newDeleteBtn.textContent = "Delete";
    newDeleteBtn.classList.add("createdBtn");
    newDeleteBtn.addEventListener("click", () => {
        resultsWindow.removeChild(newDiv);
        removeFromStorage(text);
        const currentHeight = parseInt(window.getComputedStyle(resultsWindow).height, 10);
        if (elementsIn === 0) {
            resultsWindow.style.height = `3em`;
        } else
            resultsWindow.style.height = `${currentHeight - 41}%`;
    });

    newDiv.appendChild(newDeleteBtn);
    return newDiv;
}

function addToTasks(text) {

    const newTask = createTaskElement(text);
    resultsWindow.appendChild(newTask);
    elementsIn++;
    const currentHeight = parseInt(window.getComputedStyle(resultsWindow).height, 10);
    resultsWindow.style.height = `${currentHeight + 41}%`;

    return text;
}

function addToStorage(key, text) {
    const task = { id: key, text };
    window.localStorage.setItem(key, JSON.stringify(task));
    countIndex++;
    window.localStorage.setItem("counter", countIndex);
}

function loadFromStorage() {
    const counter = parseInt(window.localStorage.getItem("counter"), 10) || 0;
    for (let i = 0; i < counter; i++) {
        const taskData = window.localStorage.getItem(i);
        if (taskData) {
            const task = JSON.parse(taskData);
            addToTasks(task.text);
        }
    }
}

function removeFromStorage(val) {

    const counter = parseInt(window.localStorage.getItem("counter"), 10);
    for (let i = 0; i < counter; i++) {
        const taskData = window.localStorage.getItem(i);
        if (taskData) {
            const task = JSON.parse(taskData);
            if (task.text === val) {
                window.localStorage.removeItem(i);
                elementsIn--;
                for (let j = i; j < counter - 1; j++) {
                    const nextTaskData = window.localStorage.getItem(j + 1);
                    window.localStorage.setItem(j, nextTaskData);
                }
                window.localStorage.removeItem(counter - 1);
                window.localStorage.setItem("counter", counter - 1);
                break;
            }
        }
    }
}

mySubmitBtn.onclick = () => {
    const taskValue = myTextinput.value.trim();
    if (taskValue) {
        addToAll(taskValue);
        myTextinput.value = "";
    } else {
        alert("Task cannot be empty!");
    }
};

clearBtn.onclick = (event) => {
    resultsWindow.innerHTML = "";
    window.localStorage.clear();
    resultsWindow.style.height = "3em";
    countIndex = 0;
};

