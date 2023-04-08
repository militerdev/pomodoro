import Control from './Control.js';
import DOM from '../Dom/DOM.js';
import Timer from './Timer.js';
import Todo from './Todo.js';

export default class Pomodoro {
    static #NAME = 'New Pomodoro';
    static get NAME() {
        return this.#NAME;
    }

    constructor(options = {}){
        this.name = options?.name ?? Pomodoro.NAME;

        this.todo = new Todo({
            storageName: options.storageName,
            timer:       {
                work:  options.work,
                break: options.break,
                relax: options.relax,
                count: options.count,
            },
        });

        this.dom = new DOM();

        this.control = new Control({
            $navigation: this.dom.$navigation,
        });

        this.timer = new Timer({
            work:    options.work,
            break:   options.break,
            relax:   options.relax,
            count:   options.count,
            todo:    this.todo,
            dom:     this.dom,
            control: this.control,
        });

        this.renderInit();

        document.addEventListener('todoadd', this.addTodo.bind(this), false);
        document.addEventListener('todoactivate', this.activateTodo.bind(this), false);
        document.addEventListener('todoedit', this.editTodo.bind(this), false);
        document.addEventListener('tododelete', this.deleteTodo.bind(this), false);
    }


    renderInit() {
        this.dom.renderHeaderTitle(this.name);
        this.dom.renderTodoList(this.todo.list);
        this.dom.renderTimer(this.timer.left);
        this.dom.renderTodo(this.todo.active);
    }

    addTodo() {
        const todo = this.todo.create();
        if (!todo) return;
        this.timer.setStatus('work');
        this.timer.stop();
        this.dom.renderTodo(this.todo.active);
        this.dom.renderTodoList(this.todo.list);
    }

    activateTodo({ detail }) {
        const todo = detail;
        this.todo.active = todo;
        this.timer.setStatus('work');
        this.timer.stop();
        this.dom.renderTodo(this.todo.active);
    }

    editTodo({ detail }) {
        let todo = detail;
        todo = this.todo.edit(todo);
        if (!todo) return;
        this.todo.active = todo;
        this.timer.setStatus('work');
        this.timer.stop();
        this.dom.renderTodo(this.todo.active);
        this.dom.renderTodoList(this.todo.list);
    }

    deleteTodo({ detail }) {
        const todo = detail;
        this.todo.delete(todo);
        this.timer.setStatus('work');
        this.timer.stop();
        this.dom.renderTodo(this.todo.active);
        this.dom.renderTodoList(this.todo.list);
    }
}
