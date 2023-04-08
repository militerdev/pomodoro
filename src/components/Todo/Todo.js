import { createElement } from '../../createElement';
import { Stats } from '../Stats/Stats';
import { Timer } from '../Timer/Timer';

export const Todo = {
    storageNameDefault: 'pomodoro',
    todoDefault:        {
        id:       'default',
        title:    'Все Задачи Выполнены!',
        pomodoro: 0,
    },

    get active(){
        const pomodoro = this._active.pomodoro;
        const works = pomodoro * Timer.work;
        const breaks =
            Math.floor(pomodoro - pomodoro / Timer.count) * Timer.break;
        const relaxes =
            (Math.floor(pomodoro / Timer.count) - (!pomodoro || pomodoro % Timer.count ? 0 : 1)) * Timer.relax;

        this._active.work = this.formatTime(works);
        this._active.relax = this.formatTime(breaks + relaxes);
        this._active.total = this.formatTime(works + breaks + relaxes);

        return this._active;
    },

    set active(todo){
        this._active = Object.assign({}, todo);
    },

    init(options) {
        this.storageName = options?.storageName ?? this.storageNameDefault;
        this.list = this.getList();
        this.active = this.list[0] ?? this.todoDefault;
        this.createTodoItemAdd();
    },

    renderInit(parent) {
        this.$todoTitle = createElement('h2', {
            className: 'todo-title',
        }, {
            parent
        });

        this.$todo = createElement('div', {
            className: 'todo'
        }, {
            parent,
            append: createElement('h3', {
                className:   'todo__title',
                textContent: 'Задачи',
            })
        });

        this.$todoList = createElement('ol', {
            className: 'todo__list'
        }, {
            parent: this.$todo
        });
    },

    renderList(){
        this.$todoList.textContent = '';
        this.$todoList.append(...this.list.map(this.createListItem.bind(this)));
        this.$todoList.append(this.$listItemAdd);
    },

    renderTodo(){
        this.$todoTitle.textContent = this.active.title;
        Stats.render();
    },

    createListItem(todo){
        const $item = createElement('li', {
            className: 'todo__item',
        });

        const $activateBtn = createElement('button', {
            className:   'todo__activate',
            textContent: todo?.title,
            ariaLabel:   'Активировать',
        }, {
            onclick: this.activateHandler.bind(this, todo, $item)
        });

        const $editBtn = createElement('button', {
            className: 'todo__edit',
            title:     'Редактировать',
            ariaLabel: 'Редактировать',
        }, {
            onclick: this.editHandler.bind(this, todo, $item)
        });

        const $deleteBtn = createElement('button', {
            className: 'todo__del',
            title:     'Удалить',
            ariaLabel: 'Удалить',
        }, {
            onclick: this.deleteHandler.bind(this, todo, $item)
        });

        $item.append($activateBtn, $editBtn, $deleteBtn);

        return $item;
    },

    createTodoItemAdd(){
        this.$listItemAdd = createElement('li', {
            className: 'todo__item'
        });

        this.$todoAddBtn = createElement('button', {
            className:   'todo__add',
            textContent: 'Добавить новую задачу',
        }, {
            parent:  this.$listItemAdd,
            onclick: this.addHandler.bind(this),
        });
    },


    getList() {
        const list = localStorage.getItem(this.storageName);
        return list ? JSON.parse(list) : [];
    },

    setList() {
        localStorage.setItem(this.storageName, JSON.stringify(this.list));
        return this.list;
    },

    removeList() {
        localStorage.removeItem(this.storageName);
    },

    get(id) {
        return this.list.find(item => item.id === id);
    },

    // add(todo) {
    //     this.list.push(todo);
    //     this.setList();
    //     return todo;
    // },

    update(todo) {
        const target = this.get(todo.id);
        const updatedTodo = Object.assign(target, todo);
        this.setList();
        return updatedTodo;
    },

    delete(todo) {
        this.list = this.list.filter(item => item.id !== todo.id);
        this.active = this.list[0] ?? this.todoDefault;
        this.setList();
    },

    create() {
        const todo = {};
        todo.id = Math.random().toString(16).substring(2, 12);
        todo.title = `Задача ${todo.id}`;
        todo.pomodoro = 0;
        // this.add(todo);
        this.list.push(todo);
        this.setList();
        return todo;
    },

    edit(todo, $item) {
        // let title = prompt('Введите новое имя задачи', todo.title); // eslint-disable-line no-alert
        // if (!title) return todo;
        // todo.title = this.htmlEntities(title);

        const $btn = $item.querySelector('.todo__activate');
        const title = $btn.textContent;
        $btn.contentEditable = true;
        $btn.focus();

        $btn.addEventListener('blur', event => {
            const newTitle = $btn.textContent;
            todo.title = this.htmlEntities(newTitle) ?? title;
            $btn.textContent = todo.title;
            $btn.contentEditable = false;
            this.update(todo);
        }, {
            capture: false,
            once:    true,
        });
    },


    commonHandler() {
        this.renderTodo();
        Timer.setStatus('work');
        Timer.stopHandler();
    },

    activateHandler(todo, $item) {
        const $btn = $item.querySelector('.todo__activate');
        if ($btn.isContentEditable) return;
        this.active = todo;
        this.commonHandler();

    },

    editHandler(todo, $item) {
        this.edit(todo, $item);
    },

    deleteHandler(todo) {
        this.delete(todo);
        this.renderList();
        this.commonHandler();
    },

    addHandler() {
        const todo = this.create();
        this.active = todo;
        const $item = this.createListItem(todo);
        this.$listItemAdd.before($item);
        this.edit(todo, $item);

        this.commonHandler();
    },

    increasePomodoro(){
        this.update({
            id:       this.active.id,
            pomodoro: ++this.active.pomodoro,
        });
        return this.active;
    },

    formatTime(min) {
        const hour = Math.floor(min / 60);
        min = this.leadingZero(Math.floor(min % 60));
        return hour ? `${hour} ч ${min} мин` : `${min} мин`;
    },

    htmlEntities: str => String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;'),

    leadingZero: num => num < 10 ? `0${num}` : num,
};

export default class Todo2 {
    static #STORAGE_NAME = 'pomodoro';
    static #TODO = {
        id:       'default',
        title:    'Все Задачи Выполнены!',
        pomodoro: 0,
    };

    #active;
    #list;
    #timer;

    constructor(options) {
        this.name = options.storageName ?? Todo.#STORAGE_NAME;
        this.#timer = options.timer;
        this.list = this.#getList();
        this.active = this.list[0] ?? Todo.#TODO;
    }

    static get default(){
        return this.#TODO;
    }

    get active(){
        const pomodoro = this.#active.pomodoro;

        let works = pomodoro;
        works *= this.#timer.work;

        let breaks = Math.floor(pomodoro - pomodoro / this.#timer.count);
        breaks *= this.#timer.break;

        let relaxes = Math.floor(pomodoro / this.#timer.count) - (!pomodoro || pomodoro % this.#timer.count ? 0 : 1);
        relaxes *= this.#timer.relax;

        this.#active.work = this.#formatTime(works);
        this.#active.relax = this.#formatTime(breaks + relaxes);
        this.#active.total = this.#formatTime(works + breaks + relaxes);

        return this.#active;
    }
    set active(todo){
        this.#active = Object.assign({}, todo);
    }

    get list(){
        return this.#list;
    }
    set list(list){
        this.#list = list;
    }


    #getList() {
        const list = localStorage.getItem(this.name);
        return list ? JSON.parse(list) : [];
    }

    #setList(list) {
        localStorage.setItem(this.name, JSON.stringify(list));
        return list;
    }

    #removeList() {
        localStorage.removeItem(this.name);
    }

    #get(id) {
        return this.list.find(item => item.id === id);
    }

    #add(todo) {
        this.list.push(todo);
        this.#setList(this.list);
        return todo;
    }

    #update(todo) {
        const target = this.#get(todo.id);
        const updatedTodo = Object.assign(target, todo);
        this.#setList(this.list);
        return updatedTodo;
    }

    #delete(id) {
        this.list = this.list.filter(item => item.id !== id);
        this.#setList(this.list);
    }

    create() {
        const todo = {};
        const title = prompt('Введите имя задачи', 'Новая задача'); // eslint-disable-line no-alert
        if (!title) return;
        todo.title = this.#htmlEntities(title);
        todo.id = Math.random().toString(16).substring(2, 12);
        todo.pomodoro = 0;
        this.active = todo;
        this.#add(todo);
        return todo;
    }

    edit(todo) {
        let title = prompt('Введите новое имя задачи', todo.title); // eslint-disable-line no-alert
        if (!title) return;
        todo.title = this.#htmlEntities(title);
        this.#update(todo);
        return todo;
    }

    delete(todo){
        this.#delete(todo.id);
        this.active = this.list[0] ?? Todo.#TODO;
    }

    increasePomodoro(){
        this.active.pomodoro++;
        this.#update({
            id:       this.active.id,
            pomodoro: this.active.pomodoro,
        });
        return this.active;
    }

    #htmlEntities = str => String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    #leadingZero = num => num < 10 ? `0${num}` : num;

    #formatTime = min => {
        const hour = Math.floor(min / 60);
        min = this.#leadingZero(Math.floor(min % 60));
        return hour ? `${hour} ч ${min} мин` : `${min} мин`;
    };
}
