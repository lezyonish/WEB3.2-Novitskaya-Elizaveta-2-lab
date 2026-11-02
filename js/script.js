
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
