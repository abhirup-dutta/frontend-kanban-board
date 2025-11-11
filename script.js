const SEPARATOR = " ";

const taskInput = document.getElementById("taskInput");
const isPriority = document.getElementById("isPriority");
const taskForm = document.getElementById("taskForm");
const columnList = document.getElementById("kanbanColumns").children;

let draggedTask = null;

/*
 * Create Task
 */

function createTaskElement(text, isPriorityChecked, id = Date.now().toString()) {
    const taskDOMElement = document.createElement("div");
    taskDOMElement.id = id;
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

    add_Text_To_Task(text, taskDOMElement);
    add_Delete_To_Task(taskDOMElement);

    console.log(taskDOMElement);
    return taskDOMElement;
}

/*
 * DELETE FROM LOCAL STORAGE
 */

function deleteTask_From_LocalStorage(taskId) {
    console.log('deleting ' + taskId);
    let savedTasks = JSON.parse(localStorage.getItem("tasks_in_localStorage"));
    let tasksAfterDelete = savedTasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks_in_localStorage", JSON.stringify(tasksAfterDelete));
}

function delete_Done_From_LocalStorage() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks_in_localStorage"));
    let tasksAfterDelete = savedTasks.filter(task => task.columnId !== "doneColumn");
    localStorage.setItem("tasks_in_localStorage", JSON.stringify(tasksAfterDelete));
}

function delete_All_from_LocalStorage() {
    localStorage.removeItem("tasks_in_localStorage");
}

/*
 * CREATE TEXT & DELETE MARKS
 */

function createTaskText(text, taskId) {
    let deleteDOMElement = document.createElement("span");
    deleteDOMElement.id = "text" + taskId;
    deleteDOMElement.className = "task-text";
    deleteDOMElement.textContent = text + SEPARATOR;
    return deleteDOMElement;
}

function createDeleteMark(taskId) {
    let deleteDOMElement = document.createElement("span");
    deleteDOMElement.id = "delete" + taskId;
    deleteDOMElement.className = "delete-mark";
    deleteDOMElement.textContent = "(X)";
    deleteDOMElement.addEventListener("click", (e) => {
        document.getElementById(taskId).remove();
        deleteTask_From_LocalStorage(taskId);
    });
    return deleteDOMElement;
}

function createDeleteDoneMark() {
    let deleteDOMElement = document.createElement("span");
    deleteDOMElement.id = "deleteDone";
    deleteDOMElement.className = "delete-mark";
    deleteDOMElement.textContent = "(X)";
    deleteDOMElement.addEventListener("click", (e) => {

        let tasksDone = document.getElementById("doneColumn").children;
        Array.from(tasksDone).filter(task => task.className !== "column-title-done")
            .forEach((task) => { task.remove(); });

        delete_Done_From_LocalStorage();

        alert("Cleared all tasks done.");
    });
    return deleteDOMElement;
}

function createDeleteAllMark() {
    let deleteDOMElement = document.createElement("span");
    deleteDOMElement.id = "deleteAll";
    deleteDOMElement.className = "delete-mark";
    deleteDOMElement.textContent = "(X)";
    deleteDOMElement.addEventListener("click", (e) => {
        let isDeleteConfirmed = confirm("Are you sure you want to delete all tasks on all boards?");
        if (isDeleteConfirmed) {
            let tasksOnPage = document.querySelectorAll(".kanban-card");
            tasksOnPage.forEach(task => { task.remove(); });
            tasksOnPage = document.querySelectorAll(".kanban-card-priority");
            tasksOnPage.forEach(task => { task.remove(); });

            delete_All_from_LocalStorage();
        }
    });
    return deleteDOMElement;
}

/*
 * ADD TEXT & DELETE MARKS
 */

function add_Text_To_Task(text, taskDOMElement) {
    let taskText = createTaskText(text, taskDOMElement.id);
    taskDOMElement.appendChild(taskText);
}

function add_Delete_To_Task(taskDOMElement) {
    let deleteMark = createDeleteMark(taskDOMElement.id);
    taskDOMElement.appendChild(deleteMark);
}

function add_DeleteDone_To_DoneColumn() {
    let doneDOMElement = document.getElementById("doneColumnTitle");
    let deleteDoneMark = createDeleteDoneMark();
    doneDOMElement.textContent = doneDOMElement.textContent + SEPARATOR;
    doneDOMElement.appendChild(deleteDoneMark);
}

function add_DeleteAll_To_BoardTitle() {
    let boardTitleDOMElement = document.getElementById("boardTitle");
    let deleteAllMark = createDeleteAllMark();
    boardTitleDOMElement.textContent = boardTitleDOMElement.textContent + SEPARATOR;
    boardTitleDOMElement.appendChild(deleteAllMark);
}

/*
 * SAVE TO AND LOAD TASKS FROM LOCAL STORAGE
 */

function saveTasks_To_LocalStorage() {
    let taskList = [];

    document.querySelectorAll(".kanban-card").forEach(task => {
        taskList.push({
            id: task.id,
            className: task.className,
            text: task.children[0].textContent,
            columnId: task.parentElement.id
        });
    });
    document.querySelectorAll(".kanban-card-priority").forEach(task => {
        taskList.push({
            id: task.id,
            className: task.className,
            text: task.children[0].textContent,
            columnId: task.parentElement.id
        });
    });

    localStorage.setItem("tasks_in_localStorage", JSON.stringify(taskList));
}

function loadTasks_From_LocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks_in_localStorage"));

    if (savedTasks) {

        savedTasks.forEach(({id, className, text, columnId}) => {
           let isPriorityChecked = (className === "kanban-card-priority");
           const taskDOMElement = createTaskElement(text, isPriorityChecked, id);
           document.getElementById(columnId).appendChild(taskDOMElement);
        });

    }
}

function startProgram() {

    loadTasks_From_LocalStorage();
    add_DeleteAll_To_BoardTitle();
    add_DeleteDone_To_DoneColumn();

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

