import { createElement } from '../createElement';
import { Header } from '../components/Header/Header';
import { Navigation } from '../components/Navigation/Navigation';
import { Todo } from '../components/Todo/Todo';
import { Timer } from '../components/Timer/Timer';
import { Control } from '../components/Control/Control';
import { Stats } from '../components/Stats/Stats';


export const App = {
    nameDefault: 'Pomodoro',

    status: {
        work:  'Работа',
        break: 'Перерыв',
        relax: 'Отдых',
    },

    init(options = {}) {
        this.name = options?.name ?? this.nameDefault;

        Todo.init(options);
        Control.init();
        Timer.init(options);
        Stats.init(options);
        Navigation.init();
        Control.init();

        this.render();
    },

    render(){
        let $app = document.getElementById('app');
        if ($app instanceof HTMLElement === false) {
            $app = createElement('div', {
                className: 'app',
                id:        'app',
            });
            document.body.prepend($app);
        }

        this.$wrapper = createElement('div', {
            className: 'app__wrapper'
        }, {
            parent: $app
        });

        Header.renderInit(this.$wrapper);
        Header.renderTitle(this.name);
        Navigation.renderInit(this.$wrapper);
        Todo.renderInit(this.$wrapper);
        Timer.renderInit(this.$wrapper);
        Stats.renderInit(this.$wrapper);
        Control.renderInit(this.$wrapper);

        Todo.renderList();
        Todo.renderTodo();
    }
};


export default class App2 {
    static #NAME = 'New Pomodoro';
    static get NAME() {
        return this.#NAME;
    }

    constructor(options = {}){
        this.name = options?.name ?? App.NAME;

        this.todo = new Todo({
            storageName: options?.storageName,
            timer:       {
                work:  options?.work,
                break: options?.break,
                relax: options?.relax,
                count: options?.count,
            },
        });

        // this.dom = new DOM();

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


        // this.renderInit();
        this.render();


        document.addEventListener('todoadd', this.addTodo.bind(this), false);
        document.addEventListener('todoactivate', this.activateTodo.bind(this), false);
        document.addEventListener('todoedit', this.editTodo.bind(this), false);
        document.addEventListener('tododelete', this.deleteTodo.bind(this), false);
    }


    render() {
        const wrapper = new Wrapper();

        // this.dom.renderHeaderTitle(this.name);
        const header = new Header();
        header.render();

        // this.dom.renderTimer(this.timer.left);
        const timer = new Timer();
        timer.render();

        // this.dom.renderTodoList(this.todo.list);
        const todo = new Todo();
        todo.renderList();
        // this.dom.renderTodo(this.todo.active);
        todo.render();
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
