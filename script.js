
const taskInput = document.getElementById("taskInput");
const isPriority = document.getElementById("isPriority");
const taskForm = document.getElementById("taskForm");
const columnList = document.getElementById("kanbanColumns").children;

let draggedTask = null;

function createTaskElement(text, isPriorityChecked, id = Date.now().toString()) {
    const taskDOMElement = document.createElement("div");
    taskDOMElement.id = id;
    taskDOMElement.textContent = text;
    taskDOMElement.className = isPriorityChecked ? "kanban-card-priority" : "kanban-card";
    taskDOMElement.draggable = true;

    taskDOMElement.addEventListener("dragstart", (e) => {
        draggedTask = taskDOMElement;
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            taskDOMElement.classList.add("hidden");
        }, 0);
    });

    taskDOMElement.addEventListener("dragend", (e) => {
        draggedTask = null;
        taskDOMElement.classList.remove("hidden");

        saveTasks_To_LocalStorage();
    });

    return taskDOMElement;
}

function saveTasks_To_LocalStorage() {
    const taskList = [];

    document.querySelectorAll(".kanban-card").forEach(task => {
        taskList.push({
            id: task.dataset.id,
            className: task.className,
            text: task.textContent,
            columnId: task.parentElement.id
        });
        console.log("saving " + task.textContent + " " + task.className);
    });
    document.querySelectorAll(".kanban-card-priority").forEach(task => {
        taskList.push({
            id: task.dataset.id,
            className: task.className,
            text: task.textContent,
            columnId: task.parentElement.id
        });
        console.log("saving " + task.textContent + " " + task.className);
    });

    localStorage.setItem("tasks_in_localStorage", JSON.stringify(taskList));
}

function loadTasks_From_LocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks_in_localStorage"));

    if (savedTasks) {

        savedTasks.forEach(({id, className, text, columnId}) => {
           console.log("loaded " + text + " " + className);
           let isPriorityChecked = (className === "kanban-card-priority");
           const taskDOMElement = createTaskElement(text, isPriorityChecked, id);
           document.getElementById(columnId).appendChild(taskDOMElement);
        });

    }
}

function startProgram() {

    // localStorage.clear();
    loadTasks_From_LocalStorage();

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskElement = createTaskElement(taskText, isPriority.checked);
            document.getElementById("toDoColumn").appendChild(taskElement);
            taskInput.value = "";
        }

        saveTasks_To_LocalStorage();
    });


    Array.from(columnList).forEach((column) => {


        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            //e.dataTransfer.dropEffect = "move";
        });


        column.addEventListener("drop", (e) => {
            e.preventDefault();

            if (draggedTask) {
                column.appendChild(draggedTask);
            }

            saveTasks_To_LocalStorage();
        });

    });


}

startProgram();

