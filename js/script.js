
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

        if (task.completed) {
            taskItem.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Выполнение задачи: ' + task.title);

        checkbox.addEventListener('change', function() {
            toggleTask(task.id);
        });

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.textContent = task.title;

        const taskDate = document.createElement('time');
        taskDate.className = 'task-date';
        taskDate.dateTime = task.date;
        taskDate.textContent = new Date(task.date + 'T00:00:00')
            .toLocaleDateString('ru-RU');

        taskDetails.append(taskName, taskDate);

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'edit-button';
        editButton.textContent = 'Изменить';

        editButton.addEventListener('click', function() {
            editTask(task, taskItem);
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Удалить';

        deleteButton.addEventListener('click', function() {
            deleteTask(task.id);
        });

        taskItem.append(checkbox, taskDetails, editButton, deleteButton);
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

function toggleTask(id) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function editTask(task, taskItem) {
    const editForm = document.createElement('form');
    editForm.className = 'edit-form';

    const titleField = document.createElement('input');
    titleField.type = 'text';
    titleField.value = task.title;
    titleField.required = true;
    titleField.setAttribute('aria-label', 'Название задачи');

    const dateField = document.createElement('input');
    dateField.type = 'date';
    dateField.value = task.date;
    dateField.required = true;
    dateField.setAttribute('aria-label', 'Дата выполнения');

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Сохранить';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Отмена';

    editForm.append(titleField, dateField, saveButton, cancelButton);
    taskItem.replaceChildren(editForm);

    editForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newTitle = titleField.value.trim();

        if (!newTitle) {
            titleField.value = '';
            titleField.reportValidity();
            return;
        }

        task.title = newTitle;
        task.date = dateField.value;

        renderTasks();
    });

    cancelButton.addEventListener('click', function() {
        renderTasks();
    });

    titleField.focus();
}

taskForm.addEventListener('submit', addTask);

renderTasks();
