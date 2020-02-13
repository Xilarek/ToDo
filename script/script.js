'use strict';
let form = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo'),
    completedList = document.getElementById('completed');
//Создаем объект 
let data = {
    todo: [],
    completed: []
};

//Проверка localStоrage на наличие данных
if (localStorage.getItem('localdata')) {
    data = JSON.parse(localStorage.getItem('localdata'));
}
//Рендер функции даты, если они есть в Stоrage 
const renderItemsForUpdate = function () {
    if (!data.todo.length && !data.completed.length) {
        return;
    }

    for (let i = 0; i < data.todo.length; i++) {
        renderItem(data.todo[i]);
    }

    for (let i = 0; i < data.completed.length; i++) {
        renderItem(data.completed[i], true);
    }

};
//Добавление данных в Stоrage 
const dataUpdateToLocalS = function () {
    localStorage.setItem('localdata', JSON.stringify(data));
};
//Добавление элементов на страницу 
const addItem = function (text) {
    renderItem(text);
    headerInput.value = '';
    data.todo.push(text);

    dataUpdateToLocalS();
};
//функция удаления элемнта 
const itemRemove = function (elem) {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const id = itemParent.id;
    const text = item.textContent;

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(text), 1);
    } else {
        data.completed.splice(data.completed.indexOf(text), 1);
    }
    itemParent.removeChild(item);
    dataUpdateToLocalS();
};
//Переносит элемент 
const itemComplete = function (elem) {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const id = itemParent.id;
    const text = item.textContent;

    let target;

    if (id === 'todo') {
        target = completedList;
    } else {
        target = todoList;
    }

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(text), 1);
        data.completed.push(text);
        
    } else {
        data.completed.splice(data.completed.indexOf(text), 1);
        data.todo.push(text);
    }
    itemParent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);

    dataUpdateToLocalS();
};

//Функция рендеринга одного элемнта 
const renderItem = function (text, completed = false) {
    const item = document.createElement('li');
    const btnBlock = document.createElement('div');
    const btnRemove = document.createElement('button');
    const btnComplete = document.createElement('button');
    let list = todoList;
    if (completed) {
        list = completedList;
    } else {
        list = todoList;
    }

    item.classList.add('todo-item');
    btnBlock.classList.add('todo-buttons');
    btnRemove.classList.add('todo-remove');
    btnComplete.classList.add('todo-complete');

    btnRemove.addEventListener('click', function (event) {
        itemRemove(event.target);
    });
    btnComplete.addEventListener('click', function (event) {
        itemComplete(event.target);
    });

    item.textContent = text;
    btnBlock.appendChild(btnRemove);
    btnBlock.appendChild(btnComplete);
    item.appendChild(btnBlock);

    list.insertBefore(item, list.childNodes[0]);
};
//Обработчик сабмита
form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (headerInput.value !== '') {
        addItem(headerInput.value.trim());
    }
});

//вызов функции, которая при наличии данных в storage 
renderItemsForUpdate();