document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('task-list').addEventListener('click', manageTasks);

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function addTask(event) {
    event.preventDefault();
    const title = document.getElementById('task-title').value;

    if (title === '') {
        alert('Por favor adicione um nome para a tarefa');
        return;
    }

    const task = {
        id: Date.now().toString(),
        title,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    document.getElementById('task-form').reset();
}

function manageTasks(event) {
    if (event.target.classList.contains('complete-task')) {
        const taskElement = event.target.parentElement.parentElement;
        toggleCompleteTask(taskElement.getAttribute('data-id'));
        taskElement.classList.add('completed');
        event.target.disabled = true;
    } else if (event.target.classList.contains('delete-task')) {
        deleteTask(event.target.parentElement.parentElement.getAttribute('data-id'));
        event.target.parentElement.parentElement.remove();
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.classList.toggle('completed', task.completed);
    li.innerHTML = `
        <span>${task.title}</span>
        <div>
            <button class="complete-task" ${task.completed ? 'disabled' : ''}>Complete</button>
            <button class="delete-task">Delete</button>
        </div>
    `;
    taskList.appendChild(li);
}

function getTasksFromLocalStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleCompleteTask(id) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function deleteTask(id) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}
