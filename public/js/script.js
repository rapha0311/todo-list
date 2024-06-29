document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    document.getElementById('task-form').addEventListener('submit', addTask);
    document.getElementById('task-list').addEventListener('click', manageTasks);
});

async function loadTasks() {
    try {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        tasks.forEach(task => addTaskToDOM(task));
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

async function addTask(event) {
    event.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    if (title === '') return;

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        const newTask = await response.json();
        addTaskToDOM(newTask);
        document.getElementById('task-title').value = '';
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
}

async function manageTasks(event) {
    const target = event.target;
    const taskElement = target.closest('li');
    const taskId = taskElement.getAttribute('data-id');

    if (target.classList.contains('complete-btn')) {
        try {
            await fetch(`/tasks/complete/${taskId}`, { method: 'PUT' });
            taskElement.classList.toggle('completed');
            const confirmIcon = taskElement.querySelector('.confirm-icon');
            if (taskElement.classList.contains('completed')) {
                confirmIcon.style.display = 'inline';
                target.disabled = true;
                taskElement.querySelector('.edit-btn').disabled = true;
            } else {
                confirmIcon.style.display = 'none';
                target.disabled = false;
                taskElement.querySelector('.edit-btn').disabled = false;
            }
        } catch (error) {
            console.error('Erro ao completar tarefa:', error);
        }
    } else if (target.classList.contains('delete-btn')) {
        try {
            await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
            taskElement.remove();
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
        }
    } else if (target.classList.contains('edit-btn')) {
        const newTitle = prompt('Edit Task:', taskElement.querySelector('.task-title').textContent);
        if (newTitle) {
            try {
                await fetch(`/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });
                taskElement.querySelector('.task-title').textContent = newTitle;
            } catch (error) {
                console.error('Erro ao editar tarefa:', error);
            }
        }
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const taskElement = document.createElement('li');
    taskElement.setAttribute('data-id', task.id);
    taskElement.innerHTML = `
        <span class="task-title">${task.title}</span>
        <i class="confirm-icon" style="display: none;">✔</i>
        <div>
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    if (task.completed) {
        taskElement.classList.add('completed');
        taskElement.querySelector('.confirm-icon').style.display = 'inline';
        taskElement.querySelector('.complete-btn').disabled = true;
        taskElement.querySelector('.edit-btn').disabled = true;
    }
    taskList.appendChild(taskElement);
}
