
const main = document.createElement('main');
main.className = 'app';

const title = document.createElement('h1');
title.textContent = 'ToDo List';

const taskForm = document.createElement('form');
taskForm.className = 'task-form';

const taskLabel = document.createElement('label');
taskLabel.textContent = 'Название задачи';
taskLabel.htmlFor = 'task-title';

const taskInput = document.createElement('input');
taskInput.type = 'text';
taskInput.id = 'task-title';
taskInput.placeholder = 'Что нужно сделать?';
taskInput.required = true;

const dateLabel = document.createElement('label');
dateLabel.textContent = 'Дата выполнения';
dateLabel.htmlFor = 'task-date';

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.id = 'task-date';
dateInput.required = true;

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.textContent = 'Добавить задачу';

taskForm.append(
    taskLabel,
    taskInput,
    dateLabel,
    dateInput,
    addButton
);

const tasksSection = document.createElement('section');
tasksSection.className = 'tasks-section';

const tasksHeading = document.createElement('h2');
tasksHeading.textContent = 'Список задач';

const taskList = document.createElement('ul');
taskList.className = 'task-list';

const emptyMessage = document.createElement('p');
emptyMessage.className = 'empty-message';
emptyMessage.textContent = 'Задач пока нет';

tasksSection.append(tasksHeading, taskList, emptyMessage);

main.append(title, taskForm, tasksSection);
document.body.append(main);

const tasks = [];

function renderTasks() {
    taskList.replaceChildren();

    emptyMessage.hidden = tasks.length > 0;

    tasks.forEach(function(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskName = document.createElement('span');
        taskName.textContent = task.title;

        const taskDate = document.createElement('time');
        taskDate.dateTime = task.date;
        taskDate.textContent = new Date(task.date + 'T00:00:00')
            .toLocaleDateString('ru-RU');

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Удалить';

        deleteButton.addEventListener('click', function() {
            deleteTask(task.id);
        });

        taskItem.append(taskName, taskDate, deleteButton);
        taskList.append(taskItem);
    });
}

function addTask(event) {
    event.preventDefault();

    const taskTitle = taskInput.value.trim();
    const taskDate = dateInput.value;

    if (!taskTitle) {
        taskInput.value = '';
        taskInput.reportValidity();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        date: taskDate,
        completed: false
    };

    tasks.push(newTask);

    renderTasks();
    taskForm.reset();
    taskInput.focus();
}

function deleteTask(id) {
    const taskIndex = tasks.findIndex(function(task) {
        return task.id === id;
    });

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        renderTasks();
    }
}

taskForm.addEventListener('submit', addTask);

renderTasks();
