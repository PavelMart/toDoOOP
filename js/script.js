'use strict';

class Todo {
    constructor(form, input, container, list, completed) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.container = document.querySelector(container);
        this.list = document.querySelector(list);
        this.completed = document.querySelector(completed);

        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    generateKey() {
        return Math.random().toString(36).substr(2,15);
    }

    render() {
        this.list.innerHTML = '';
        this.completed.innerHTML = '';

        this.todoData.forEach(this.createTodo, this);
    }

    addToLocaleStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    createTodo(item) {
        const li = document.createElement('li');

        li.classList.add('todo-item');
        li.setAttribute('key', `${item.key}`);

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${item.value}</span>
        <div class="todo-buttons">
            <button class="todo-edit"></button>
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
        `);

        if (item.completed) {
            this.completed.append(li);
        } else {
            this.list.append(li);
        }
    }

    deleteTodo( li ) {
        const key = li.getAttribute('key');

        this.todoData.forEach( item => {
            if (item.key === key) {
                this.todoData.delete(`${key}`);
            }
        } );

        this.addToLocaleStorage();
        this.render();
    }

    completedTodo( li ) {
        const key = li.getAttribute('key');

        this.todoData.forEach( item => {
            if (item.key === key) {
                item.completed = !item.completed;
            }
        } );

        this.addToLocaleStorage();
        this.render();
    }

    editTodo( li ) {
        const textTodo = li.querySelector('.text-todo');

        const key = li.getAttribute('key');
    }

    addTodo(e) {

        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: true,
                key: this.generateKey(),
            };

            this.todoData.set(newTodo.key, newTodo);
            this.render();

            this.input.value = '';

            this.addToLocaleStorage();
        }

    }

    handler() {
        this.container.addEventListener('click', e => {
            e.preventDefault();

            const target = e.target;
            const targetLi = target.closest('.todo-item');

            if (target.matches('.todo-complete')) {
                this.completedTodo(targetLi);
            } else if (target.matches('.todo-remove')) {
                this.deleteTodo(targetLi);
            } else if (target.matches('.todo-edit')) {
                this.editTodo(targetLi);
            }

        });
    }

    init() {
        this.render();
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-container', '.todo-list', '.todo-completed');

todo.init();

