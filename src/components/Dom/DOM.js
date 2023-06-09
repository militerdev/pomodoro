export default class DOM {
    #$app;
    #$wrapper;

    #$navigation;

    #$todoList;
    #$todoItemAdd;
    #$todoAddBtn;

    #$headerTitle;
    #$todoTitle;

    #$$timer = {};
    #$$stats = {};

    #$start;
    #$stop;

    constructor(options) {
        if (options?.app instanceof HTMLElement) {
            this.#$app = options.app;
        } else {
            if (typeof options?.app === 'string') {
                this.#$app = document.querySelector(options.app);
            } else {
                this.#$app = document.querySelector('.app');
            }
            if (this.#$app instanceof HTMLElement === false) {
                this.#$app = this.#createElement('section', {
                    className: 'app',
                    id:        'app',
                });
                document.body.prepend(this.#$app);
            }
        }

        this.#$todoItemAdd = this.#createTodoItemAdd();

        this.#renderWrapper();

        this.#renderHeader();
        this.#renderNavigation();
        this.#renderTodoTitle();
        this.#renderTodo();
        this.#renderTimer();
        this.#renderStats();
        this.#renderControl();
    }


    get $navigation() {
        return this.#$navigation;
    }


    #start(event) {
        event.currentTarget.dispatchEvent(new Event('start', { bubbles: true }));
    }
    #stop(event) {
        event.currentTarget.dispatchEvent(new Event('stop', { bubbles: true }));
    }

    #work(event) {
        event.currentTarget.dispatchEvent(new Event('work', { bubbles: true }));
    }
    #break(event) {
        event.currentTarget.dispatchEvent(new Event('break', { bubbles: true }));
    }
    #relax(event) {
        event.currentTarget.dispatchEvent(new Event('relax', { bubbles: true }));
    }

    #todoAdd() {
        document.dispatchEvent(new Event('todoadd', { bubbles: true }));
    }
    #todoActivate(item) {
        document.dispatchEvent(new CustomEvent(
            'todoactivate',
            {
                bubbles: true,
                detail:  item,
            }));
    }
    #todoEdit(item) {
        document.dispatchEvent(new CustomEvent(
            'todoedit',
            {
                bubbles: true,
                detail:  item,
            }));
    }
    #todoDelete(item) {
        document.dispatchEvent(new CustomEvent(
            'tododelete',
            {
                bubbles: true,
                detail:  item,
            }));
    }

    #renderWrapper(){
        this.#$wrapper = this.#createElement('div', {
            className: 'app__wrapper'
        }, {
            parent: this.#$app
        });

        return this.#$wrapper;
    }

    #renderHeader() {
        const $header = this.#createElement('header', {
            className: 'header',
        }, {
            parent: this.#$wrapper
        });

        this.#$headerTitle = this.#createElement('h1', {
            className: 'header__title',
        }, {
            parent: $header
        });
        this.#createElement('div', {
            className: 'header__logo',
            ariaLabel: 'Логотип',
            innerHTML: `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path
                        d="M31.47 11.2975C31.0175 9.81001 30.18 8.15501 29.1725 6.96001C27.305 4.74001 24.9725 3.03751 22.1725 2.27751C19.74 1.62001 16.3425 1.19001 13.88 1.72501C12.1775 2.09501 10.325 2.68501 8.78997 3.50001C8.45997 3.67501 8.13747 3.86251 7.81747 4.05751C3.19247 6.87501 0.304971 12.63 0.0549708 17.6225C-0.212529 23.01 3.11247 28.15 7.83747 29.695C9.34247 30.1875 11.0675 30.455 12.65 30.5025C17.4875 30.6525 22.6425 29.535 26.355 26.265C29.4525 23.535 31.8325 19.5925 31.9525 15.38C31.99 14.0625 31.855 12.5675 31.47 11.2975Z"
                        fill="#DB4437" />
                    <path
                        d="M19.9225 12.425C19.6875 12.5675 19.4875 12.7475 19.25 12.88C18.9525 13.0475 18.645 13.17 18.3075 13.24C17.315 13.445 16.2975 13.3225 15.2975 13.1825C14.205 13.0325 13.3125 12.4025 12.29 12.045C12.1425 11.99 11.895 12.0525 11.755 12.1C11.0375 12.33 10.55 13.2475 10.0175 13.74C9.41504 14.3 8.72754 14.75 7.96004 15.04C7.21754 15.3225 6.13254 15.6925 5.44004 15.11C5.55504 14.7725 6.14504 14.5325 6.39254 14.28C6.68254 13.98 6.90004 13.6325 7.08254 13.2625C7.46504 12.485 7.65254 11.6275 8.00004 10.8425C8.09504 10.625 8.56754 10.1275 8.26504 9.91749C8.11254 9.80999 7.84754 9.86249 7.67004 9.83999C7.42754 9.80999 7.18754 9.74749 6.95754 9.66499C6.49254 9.50249 6.04004 9.25999 5.66754 8.93999C5.44504 8.74749 4.94254 8.24999 5.03504 7.91499C5.11004 7.63999 5.49004 7.83499 5.68754 7.85749C5.95754 7.88749 6.19254 7.85749 6.41754 7.80249C6.78754 7.70999 7.12004 7.53499 7.53254 7.41749C8.23754 7.21749 8.91754 7.27499 9.63504 7.35249C10.22 7.41499 10.7025 7.33749 10.9275 6.72249C11.3125 5.66499 11.8925 4.41999 12.775 3.69749C13.085 3.44499 13.47 3.14749 13.8275 2.96499C13.985 2.88749 14.3625 2.65999 14.545 2.75499C14.7625 2.86499 14.455 3.95499 14.42 4.13499C14.3 4.74999 14.11 5.28499 14.385 5.87999C14.5825 6.29749 14.7825 6.34749 15.1825 6.07999C16.6675 5.09249 18.6075 5.60999 20.125 4.72249C20.26 4.64499 20.3775 4.49249 20.53 4.46999C20.6275 4.64249 20.5325 4.91749 20.505 5.10499C20.425 5.69499 20.1475 6.32249 19.7275 6.74499C19.11 7.37249 18.55 7.69499 17.78 8.08499C17.53 8.21249 16.2 8.74749 16.315 9.16999C16.3725 9.37999 16.5275 9.43999 16.71 9.50749C17.21 9.70249 17.61 10.185 17.94 10.6075C18.075 10.7775 18.195 10.935 18.37 11.0675C18.9925 11.545 19.66 11.61 20.3625 11.885C20.41 12.1275 20.09 12.3225 19.9225 12.425Z"
                        fill="#BDCF46" />
                    <path
                        d="M10.855 8.20499C10.2825 8.78249 10.23 9.51499 10.975 9.93249C11.95 10.48 14.345 9.39249 13.7825 8.08749C13.365 7.11999 11.4325 7.61999 10.855 8.20499ZM4.49747 25.045C4.85997 25.33 5.44997 25.39 5.76497 25.01C6.11497 24.575 5.85997 23.7375 5.46497 23.3975C5.12997 23.105 4.52747 23.2175 4.27497 23.5525C3.97997 23.94 4.07997 24.5625 4.36497 24.9225C4.40247 24.965 4.44497 25.0075 4.49747 25.045ZM2.56747 17.28C2.48997 17.5725 2.43997 17.8725 2.40497 18.14C2.23497 19.385 2.46747 20.54 3.07247 21.635C3.28997 22.0275 3.77497 22.54 4.27247 22.415C4.78497 22.285 4.92747 21.675 5.01747 21.225C5.15247 20.525 5.20747 19.8125 5.20997 19.1C5.21247 18.125 5.31247 16.7675 4.42997 16.105C4.00497 15.7875 3.52997 15.8375 3.14497 16.19C2.85497 16.4625 2.67747 16.865 2.56747 17.28Z"
                        fill="white" />
                </svg>
            `,
        }, {
            parent: $header
        });

        return $header;
    }
    renderHeaderTitle(title) {
        this.#$headerTitle.textContent = title;
    }

    #renderNavigation() {
        this.#$navigation = this.#createElement('div', {
            className: 'navigation',
        }, {
            parent: this.#$wrapper,
        });
        this.#createElement('button', {
            className:   'navigation__btn navigation__btn_active',
            textContent: 'Работа',
        }, {
            parent:  this.#$navigation,
            cb:      $btn => $btn.dataset.status = 'work',
            onclick: this.#work,
        });
        this.#createElement('button', {
            className:   'navigation__btn',
            textContent: 'Перерыв',
        }, {
            parent:  this.#$navigation,
            cb:      $btn => $btn.dataset.status = 'break',
            onclick: this.#break,
        });
        this.#createElement('button', {
            className:   'navigation__btn',
            textContent: 'Отдых',
        }, {
            parent:  this.#$navigation,
            cb:      $btn => $btn.dataset.status = 'relax',
            onclick: this.#relax,
        });

        return this.#$navigation;
    }

    #renderTodoTitle(){
        this.#$todoTitle = this.#createElement('h2', {
            className: 'title',
        }, {
            parent: this.#$wrapper,
        });

        return this.#$todoTitle;
    }
    renderTodoTitle(title) {
        this.#$todoTitle.textContent = title ?? 'Все задачи выполнены!';
    }

    #renderTodo(){
        const $todo = this.#createElement('div', {
            className: 'todo'
        }, {
            parent: this.#$wrapper,
            append: this.#createElement('h3', {
                className:   'todo__title',
                textContent: 'Задачи',
            })
        });

        this.#$todoList = this.#createElement('ol', {
            className: 'todo__list'
        }, {
            parent: $todo
        });

        return $todo;
    }
    #createTodoItemAdd(){
        const $todoItemAdd = this.#createElement('li', {
            className: 'todo__item'
        });
        this.#$todoAddBtn = this.#createElement('button', {
            className:   'todo__add',
            textContent: 'Добавить новую задачу',
        }, {
            parent:  $todoItemAdd,
            onclick: this.#todoAdd,
        });

        return $todoItemAdd;
    }
    #createTodoItem(item){
        const $todoItem = this.#createElement('li', {
            className: 'todo__item',
        });

        const $activateBtn = this.#createElement('button', {
            className:   'todo__activate',
            textContent: item.title,
            ariaLabel:   'Активировать',
        }, {
            onclick: () => this.#todoActivate(item)
        });
        const $editBtn = this.#createElement('button', {
            className: 'todo__edit',
            ariaLabel: 'Редактировать',
        }, {
            onclick: () => this.#todoEdit(item)
        });
        const $delBtn = this.#createElement('button', {
            className: 'todo__del',
            ariaLabel: 'Удалить',
        }, {
            onclick: () => this.#todoDelete(item)
        });

        $todoItem.append($activateBtn, $editBtn, $delBtn);

        return $todoItem;
    }
    renderTodoList(list){
        this.#$todoList.textContent = '';
        this.#$todoList.append(...list.map(this.#createTodoItem.bind(this)));
        this.#$todoList.append(this.#$todoItemAdd);
    }

    #renderTimer(){
        const $timer = this.#createElement('div', {
            className: 'timer',
            innerHTML: '<span>:</span>',
        }, {
            parent: this.#$wrapper,
        });
        this.#$$timer.$minutes = this.#createElement('p', {
            className: 'time__minutes',
        });
        this.#$$timer.$seconds = this.#createElement('p', {
            className: 'time__seconds',
        });
        $timer.prepend(this.#$$timer.$minutes);
        $timer.append(this.#$$timer.$seconds);

        return $timer;
    }
    renderTimer(time){
        const { min, sec } = this.#formatTime(time);
        this.#$$timer.$minutes.textContent = min;
        this.#$$timer.$seconds.textContent = sec;
    }

    #renderStats(){
        const $stats = this.#createElement('div', {
            className: 'stats',
        }, {
            parent: this.#$wrapper,
            append: this.#createElement('h3', {
                className:   'stats__title',
                textContent: 'Статистика',
            })
        });

        const $list = this.#createElement('ul', {
            className: 'stats__list',
        }, {
            parent: $stats,
        });

        this.#$$stats.$pomodoro = this.#createElement('li', {
            className: 'stats__item stats__pomodoro',
        }, {
            parent: $list,
        });

        this.#createElement('li', {
            className:   'stats__item stats__pomodoro-caption',
            textContent: 'Помодорки',
        }, {
            parent: $list,
        });

        const createStatsItem = (caption) => {
            return this.#createElement('li', {
                className: 'stats__item',
                innerHTML: `<span class="stats__caption">${caption}:</span>`,
            }, {
                parent: $list
            });
        };

        const createStatsValue = (value, parent) => {
            return this.#createElement('span', {
                className: `stats__${value}`
            }, {
                parent
            });
        };

        const $work = createStatsItem('Работа');
        this.#$$stats.$work = createStatsValue('work', $work);

        const $relax = createStatsItem('Отдых');
        this.#$$stats.$relax = createStatsValue('relax', $relax);

        const $total = createStatsItem('Всего');
        this.#$$stats.$total = createStatsValue('total', $total);

        return $stats;
    }
    renderStats({ pomodoro, work, relax, total } = {}){
        this.#$$stats.$pomodoro.textContent = pomodoro ?? 0;
        this.#$$stats.$work.textContent = work ?? 0;
        this.#$$stats.$relax.textContent = relax ?? 0;
        this.#$$stats.$total.textContent = total ?? 0;
    }

    #renderControl(){
        const $control = this.#createElement('div', {
            className: 'control',
        }, {
            parent: this.#$wrapper,
        });
        this.#$start = this.#createElement('button', {
            className:   'control__btn control__btn_start',
            textContent: 'Старт'
        }, {
            parent:  $control,
            onclick: this.#start,
        });
        this.#$stop = this.#createElement('button', {
            className:   'control__btn control__btn_stop',
            textContent: 'Cтоп'
        }, {
            parent:  $control,
            onclick: this.#stop,
        });

        return $control;
    }
    renderStart(title) {
        this.#$start.textContent = title;
    }

    renderPageTitle(status, time) {
        const { min, sec } = this.#formatTime(time);
        document.title = `${status} ${min}:${sec}`;
    }

    renderTodo(todo) {
        this.renderTodoTitle(todo.title);
        // this.renderCount(todo.pomodoro);
        this.renderStats(todo);
    }


    #leadingZero = num => num < 10 ? `0${num}` : num;

    #formatTime(time) {
        const min = this.#leadingZero(Math.floor(time / 60));
        const sec = this.#leadingZero(time % 60);
        return { min, sec };
    }

    /**
    *
    * @param {string} tagName
    * @param {Object.<string, (string | boolean)>} attr - Attributes
    * @param {Object} [options={}]
    * @param {HTMLElement} options.parent
    * @param {(HTMLElement | HTMLElement[] | NodeList | HTMLCollection)} options.append
    * @param {Function} options.cb
    */
    #createElement(tagName, attr, { parent, append, onclick, cb } = {}) {
        const element = document.createElement(tagName);
        if (attr) {
            Object.assign(element, attr);
        }

        if (append) {
            if (append instanceof HTMLElement) {
                element.append(append);
            } else if (Array.from(append)?.every(item => item instanceof HTMLElement)) {
                element.append(...append);
            }
        }

        if (parent && parent instanceof HTMLElement) {
            parent.append(element);
        }

        if (onclick && typeof onclick === 'function') {
            element.addEventListener('click', onclick, false);
        }

        if (cb && typeof cb === 'function') {
            cb(element);
        }

        return element;
    }
}
