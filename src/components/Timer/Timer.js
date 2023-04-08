import { createElement } from '../../createElement';
import { Control } from '../Control/Control';
import { Navigation } from '../Navigation/Navigation';
import { Stats } from '../Stats/Stats';
import { Todo } from '../Todo/Todo';

export const Timer = {
    _timerDefault: {
        work:  25,
        break: 5,
        relax: 20,
        count: 4,
    },

    _audioDefault: {
        work:  '/src/audio/work.mp3',
        break: '/src/audio/break.mp3',
        relax: '/src/audio/relax.mp3',
    },

    init(options = {}) {
        this.work = options?.timer?.work ?? this._timerDefault.work;
        this.break = options?.timer?.break ?? this._timerDefault.break;
        this.relax = options?.timer?.relax ?? this._timerDefault.relax;
        this.count = options?.timer?.count ?? this._timerDefault.count;

        this.status = 'work';
        this.left = this.work * 60;

        this.audio = {};
        this.audio.work = options?.audio?.work ? new Audio(options.audio.work) : new Audio(this._audioDefault.work);
        this.audio.break = options?.audio?.break ? new Audio(options.audio.break) : new Audio(this._audioDefault.break);
        this.audio.relax = options?.audio?.relax ? new Audio(options.audio.relax) : new Audio(this._audioDefault.relax);
    },

    renderInit(parent) {
        this.$timer = createElement('div', {
            className: 'timer',
            innerHTML: '<span>:</span>',
        }, {
            parent
        });

        this.$minutes = createElement('p', {
            className: 'timer__minutes',
        });

        this.$seconds = createElement('p', {
            className: 'timer__seconds',
        });

        this.$timer.prepend(this.$minutes);
        this.$timer.append(this.$seconds);

        this.render();
    },

    render() {
        const { min, sec } = this.formatTime(this.left);
        this.$minutes.textContent = min;
        this.$seconds.textContent = sec;
        document.title = `${this.status.toUpperCase()} ${min}:${sec}`;
    },


    setStatus(status) {
        this.status = status;
        clearInterval(this.intervalId);
        this.reset();
        Navigation.changeActiveBtn(this.status);

        if (this.isActive) {
            this.start();
        } else {
            Control.renderStart('Старт');
        }
    },

    changeStatus() {
        if (this.status === 'work') {
            Todo.increasePomodoro();
            Stats.render();
            if (Todo.active.pomodoro % this.count) {
                this.setStatus('break');
            } else {
                this.setStatus('relax');
            }
        } else {
            this.setStatus('work');
        }
    },

    alarm() {
        this.audio[this.status].play();
    },

    start(){
        this.isActive = true;
        const countdown = new Date().getTime() + this.left * 1000;
        this.intervalId = setInterval(() => {
            this.left--;
            this.timeSync(countdown);
            this.render();

            if (this.left > 0) return;

            // this.alarm(); // Сигнал статуса по окончании периода статуса
            this.changeStatus();
            this.alarm(); // Сигнал статуса в начале периода статуса
        }, 1000);
    },

    pause(){
        this.isActive = false;
        clearInterval(this.intervalId);
    },

    reset(){
        this.left = this[this.status] * 60;
        this.render();
    },

    startHandler() {
        if (this.isActive) { // pause
            this.pause();
            Control.renderStart('Продолжить');
        } else { // continue
            this.start();
            Control.renderStart('Пауза');
        }
    },

    stopHandler() {
        this.pause();
        this.reset();
        Control.renderStart('Старт');
    },

    timeSync(countdown) {
        if (this.left % 5) return;
        const now = new Date().getTime();
        this.left = Math.floor((countdown - now) / 1000);
    },

    formatTime(time) {
        const min = this.leadingZero(Math.floor(time / 60));
        const sec = this.leadingZero(time % 60);
        return { min, sec };
    },

    leadingZero: num => num < 10 ? `0${num}` : num,
};


export default class Timer2 {
    static #WORK = 25;
    static #BREAK = 5;
    static #RELAX = 20;
    static #COUNT = 4;

    static #AUDIO = {
        work:  new Audio('/src/audio/work.mp3'),
        break: new Audio('/src/audio/break.mp3'),
        relax: new Audio('/src/audio/relax.mp3'),
    };

    #status = {
        work:  'Работа',
        break: 'Перерыв',
        relax: 'Отдых',
    };

    #left;

    audio = {};

    constructor(options) {
        this.status = 'work';

        this.work = options.work ?? Timer.#WORK;
        this.break = options.break ?? Timer.#BREAK;
        this.relax = options.relax ?? Timer.#RELAX;
        this.count = options.count ?? Timer.#COUNT;
        this.left = this.work;

        this.todo = options.todo;
        this.dom = options.dom;
        this.control = options.control;

        this.audio.work = options.audio?.work ? new Audio(options.audio.work) : Timer.#AUDIO.work;
        this.audio.break = options.audio?.break ? new Audio(options.audio.break) : Timer.#AUDIO.break;
        this.audio.relax = options.audio?.relax ? new Audio(options.audio.relax) : Timer.#AUDIO.relax;

        document.addEventListener('start', this.start.bind(this), false);
        document.addEventListener('stop', this.stop.bind(this), false);

        document.addEventListener('work', this.statusHandler.bind(this), false);
        document.addEventListener('break', this.statusHandler.bind(this), false);
        document.addEventListener('relax', this.statusHandler.bind(this), false);
    }

    get left(){
        return this.#left;
    }

    set left(time) {
        this.#left = time * 60;
    }

    #timeSync(countdown) {
        if (this.left % 5) return;
        const now = new Date().getTime();
        this.#left = Math.floor((countdown - now) / 1000);
    }

    #decrease(){
        this.#left--;
    }

    #reset(){
        this.left = this[this.status];
        this.dom.renderTimer(this.left);
        this.dom.renderPageTitle(this.#status[this.status], this.left);
    }

    setStatus(status) {
        this.status = status;
        clearInterval(this.intervalId);
        this.#reset();
        this.control.changeActiveBtn(this.status);

        if (this.isActive) {
            this.#start();
        } else {
            this.dom.renderStart('Старт');
        }
    }

    statusHandler({ type }) {
        this.setStatus(type);
    }

    changeStatus() {
        if (this.status === 'work') {
            this.todo.increasePomodoro();
            this.dom.renderStats(this.todo.active);
            if (this.todo.active.pomodoro % this.count) {
                this.setStatus('break');
            } else {
                this.setStatus('relax');
            }
        } else {
            this.setStatus('work');
        }
    }

    #start(){
        this.isActive = true;
        const countdown = new Date().getTime() + this.left * 1000;
        this.intervalId = setInterval(() => {
            this.#decrease();
            this.#timeSync(countdown);
            this.dom.renderTimer(this.left);
            this.dom.renderPageTitle(this.#status[this.status], this.left);

            if (this.left > 0) return;

            // this.#alarm(); // Сигнал статуса по окончании периода статуса
            this.changeStatus();
            this.#alarm(); // Сигнал статуса в начале периода статуса
        }, 1000);
    }

    #stop(){
        this.isActive = false;
        clearInterval(this.intervalId);
        this.dom.renderStart('Старт');
    }

    start() {
        if (this.isActive) { // pause
            this.#stop();
            this.dom.renderStart('Продолжить');
        } else { // continue
            this.#start();
            this.dom.renderStart('Пауза');
        }
    }

    stop() {
        this.#stop();
        this.#reset();
    }

    #alarm() {
        this.audio[this.status].play();
    }

}
