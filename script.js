
const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const columnList = document.getElementById("kanbanColumns").children;

let draggedTask = null;

function createTaskElement(text, id = Date.now().toString()) {
    const taskElement = document.createElement("div");
    taskElement.id = id;
    taskElement.textContent = text;
    taskElement.className = "kanban-card";
    taskElement.draggable = true;

    taskElement.addEventListener("dragstart", (e) => {
        draggedTask = taskElement;
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            taskElement.classList.add("hidden");
        }, 0);
    });

    taskElement.addEventListener("dragend", (e) => {
        draggedTask = null;
        taskElement.classList.remove("hidden");
    });

    return taskElement;
}

function startProgram() {

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        console.log(taskText);
        if (taskText) {
            const taskElement = createTaskElement(taskText);
            document.getElementById("toDoColumn").appendChild(taskElement);
            taskInput.value = "";
        }
    });


    Array.from(columnList).forEach((column) => {

        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
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

