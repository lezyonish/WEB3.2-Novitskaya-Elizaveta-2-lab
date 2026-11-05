
const main = document.createElement('main');
main.className = 'app';

const header = document.createElement('header');
header.className = 'app-header';

const title = document.createElement('h1');
title.className = 'app-title';
title.style.display = 'flex';
title.style.alignItems = 'center';
title.style.justifyContent = 'center';
title.style.gap = 'clamp(7px, 1.8vw, 16px)';

const firstWord = document.createElement('span');
firstWord.textContent = 'ToDo';

const catsImage = document.createElement('img');
catsImage.className = 'cats-image';
catsImage.src = 'images/fish.png';
catsImage.alt = '';
catsImage.style.width = 'clamp(50px, 8vw, 82px)';

const secondWord = document.createElement('span');
secondWord.textContent = 'List';

title.append(firstWord, catsImage, secondWord);
header.append(title);

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

const searchLabel = document.createElement('label');
searchLabel.textContent = 'Поиск по названию';
searchLabel.htmlFor = 'task-search';

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.id = 'task-search';
searchInput.className = 'task-search';
searchInput.placeholder = 'Найти задачу...';

const filterButtons = document.createElement('div');
filterButtons.className = 'filter-buttons';
filterButtons.setAttribute('role', 'group');
filterButtons.setAttribute('aria-label', 'Фильтр задач по статусу');

const filters = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'completed', label: 'Выполненные' }
];

const filterButtonElements = [];

filters.forEach(function(filter) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = filter.label;

    button.addEventListener('click', function() {
        currentFilter = filter.value;
        renderTasks();
    });

    filterButtons.append(button);
    filterButtonElements.push({
        element: button,
        value: filter.value
    });
});

const taskControls = document.createElement('div');
taskControls.className = 'task-controls';

const dateFilterGroup = document.createElement('div');
dateFilterGroup.className = 'control-group';

const dateFilterLabel = document.createElement('label');
dateFilterLabel.textContent = 'Поиск по дате';
dateFilterLabel.htmlFor = 'date-filter';

const dateFilterRow = document.createElement('div');
dateFilterRow.className = 'date-filter-row';

const dateFilterInput = document.createElement('input');
dateFilterInput.type = 'date';
dateFilterInput.id = 'date-filter';

const resetDateButton = document.createElement('button');
resetDateButton.type = 'button';
resetDateButton.textContent = 'Сбросить дату';

dateFilterRow.append(dateFilterInput, resetDateButton);
dateFilterGroup.append(dateFilterLabel, dateFilterRow);

const sortGroup = document.createElement('div');
sortGroup.className = 'control-group';

const sortLabel = document.createElement('label');
sortLabel.textContent = 'Сортировка';
sortLabel.htmlFor = 'task-sort';

const sortSelect = document.createElement('select');
sortSelect.id = 'task-sort';

const sortOptions = [
    { value: 'default', label: 'Мой порядок' },
    { value: 'date-asc', label: 'Сначала ближайшие' },
    { value: 'date-desc', label: 'Сначала поздние' }
];

sortOptions.forEach(function(option) {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    sortSelect.append(optionElement);
});

sortGroup.append(sortLabel, sortSelect);
taskControls.append(dateFilterGroup, sortGroup);

const taskList = document.createElement('ul');
taskList.className = 'task-list';

const emptyMessage = document.createElement('p');
emptyMessage.className = 'empty-message';
emptyMessage.textContent = 'Задач пока нет';

tasksSection.append(
    tasksHeading,
    searchLabel,
    searchInput,
    filterButtons,
    taskControls,
    taskList,
    emptyMessage
);

const swansImage = document.createElement('img');
swansImage.className = 'swans-image';
swansImage.src = 'images/swans.png';
swansImage.alt = 'Два лебедя';

main.append(header, taskForm, tasksSection, swansImage);
document.body.append(main);

let tasks = [];
let currentFilter = 'all';
let draggedTaskId = null;

try {
    const savedTasks = JSON.parse(localStorage.getItem('todoTasks'));

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks;
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function moveTask(draggedId, targetId, insertAfter) {
    const draggedIndex = tasks.findIndex(function(task) {
        return task.id === draggedId;
    });

    const targetIndex = tasks.findIndex(function(task) {
        return task.id === targetId;
    });

    if (draggedIndex === -1 || targetIndex === -1 || draggedId === targetId) {
        return;
    }

    const movedTask = tasks.splice(draggedIndex, 1)[0];

    let newIndex = tasks.findIndex(function(task) {
        return task.id === targetId;
    });

    if (insertAfter) {
        newIndex++;
    }

    tasks.splice(newIndex, 0, movedTask);

    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();
    const selectedDate = dateFilterInput.value;

    const visibleTasks = tasks.filter(function(task) {
        const matchesSearch = task.title.toLowerCase().includes(searchText);
        const matchesDate = !selectedDate || task.date === selectedDate;

        let matchesStatus = true;

        if (currentFilter === 'active') {
            matchesStatus = !task.completed;
        } else if (currentFilter === 'completed') {
            matchesStatus = task.completed;
        }

        return matchesSearch && matchesDate && matchesStatus;
    });

    if (sortSelect.value === 'date-asc') {
        visibleTasks.sort(function(a, b) {
            return a.date.localeCompare(b.date);
        });
    } else if (sortSelect.value === 'date-desc') {
        visibleTasks.sort(function(a, b) {
            return b.date.localeCompare(a.date);
        });
    }

    const canDrag = sortSelect.value === 'default'
        && currentFilter === 'all'
        && !searchText
        && !selectedDate;

    filterButtonElements.forEach(function(button) {
        const isActive = button.value === currentFilter;

        button.element.classList.toggle('active', isActive);
        button.element.setAttribute('aria-pressed', String(isActive));
    });

    resetDateButton.disabled = !selectedDate;

    emptyMessage.hidden = visibleTasks.length > 0;

    if (tasks.length === 0) {
        emptyMessage.textContent = 'Задач пока нет';
    } else {
        emptyMessage.textContent = 'Подходящих задач не найдено';
    }

    visibleTasks.forEach(function(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        if (task.completed) {
            taskItem.classList.add('completed');
        }

        if (canDrag) {
            taskItem.draggable = true;

            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = '↕';
            dragHandle.title = 'Перетащить задачу';
            dragHandle.setAttribute('aria-hidden', 'true');

            taskItem.append(dragHandle);

            taskItem.addEventListener('dragstart', function(event) {
                draggedTaskId = task.id;
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(task.id));
                taskItem.classList.add('dragging');
            });

            taskItem.addEventListener('dragover', function(event) {
                if (draggedTaskId === null || draggedTaskId === task.id) {
                    return;
                }

                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';

                const middle = taskItem.getBoundingClientRect().top
                    + taskItem.offsetHeight / 2;

                taskList.querySelectorAll('.drop-before, .drop-after')
                    .forEach(function(item) {
                        item.classList.remove('drop-before', 'drop-after');
                    });

                if (event.clientY < middle) {
                    taskItem.classList.add('drop-before');
                } else {
                    taskItem.classList.add('drop-after');
                }
            });

            taskItem.addEventListener('drop', function(event) {
                event.preventDefault();

                if (draggedTaskId === null || draggedTaskId === task.id) {
                    return;
                }

                const middle = taskItem.getBoundingClientRect().top
                    + taskItem.offsetHeight / 2;

                const insertAfter = event.clientY >= middle;
                const movedId = draggedTaskId;

                draggedTaskId = null;
                moveTask(movedId, task.id, insertAfter);
            });

            taskItem.addEventListener('dragend', function() {
                draggedTaskId = null;
                taskItem.classList.remove('dragging');

                taskList.querySelectorAll('.drop-before, .drop-after')
                    .forEach(function(item) {
                        item.classList.remove('drop-before', 'drop-after');
                    });
            });
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
    saveTasks();

    searchInput.value = '';
    dateFilterInput.value = '';
    currentFilter = 'all';

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
        saveTasks();
        renderTasks();
    }
}

function toggleTask(id) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (task) {
        task.completed = !task.completed;
        saveTasks();
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

        saveTasks();
        renderTasks();
    });

    cancelButton.addEventListener('click', function() {
        renderTasks();
    });

    titleField.focus();
}

taskForm.addEventListener('submit', addTask);
searchInput.addEventListener('input', renderTasks);
dateFilterInput.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

resetDateButton.addEventListener('click', function() {
    dateFilterInput.value = '';
    renderTasks();
});

renderTasks();
