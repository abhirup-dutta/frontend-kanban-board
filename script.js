
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
    });

    return taskDOMElement;
}

function startProgram() {

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskElement = createTaskElement(taskText, isPriority.checked);
            document.getElementById("toDoColumn").appendChild(taskElement);
            taskInput.value = "";
        }
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
        });

    });


}

startProgram();

