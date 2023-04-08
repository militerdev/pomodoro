import { createElement } from '../../createElement';
import { Navigation } from '../Navigation/Navigation';
import { Timer } from '../Timer/Timer';

export const Control = {
    init(){
        // document.addEventListener('work', this.statusHandler.bind(this), false);
        // document.addEventListener('break', this.statusHandler.bind(this), false);
        // document.addEventListener('relax', this.statusHandler.bind(this), false);
    },

    renderInit(parent){
        this.$control = createElement('div', {
            className: 'control',
        }, {
            parent
        });

        this.$start = createElement('button', {
            className:   'control__btn control__btn_start',
            textContent: 'Старт'
        }, {
            parent:  this.$control,
            onclick: this.start.bind(this),
        });

        this.$stop = createElement('button', {
            className:   'control__btn control__btn_stop',
            textContent: 'Cтоп'
        }, {
            parent:  this.$control,
            onclick: this.stop.bind(this),
        });
    },

    renderStart(title) {
        this.$start.textContent = title;
    },

    statusHandler({ target }){
        Navigation.$navigation.querySelector('.navigation__btn_active')
            ?.classList.remove('navigation__btn_active');
        target?.classList.add('navigation__btn_active');
    },

    start(event) {
        // event.currentTarget.dispatchEvent(new Event('start', { bubbles: true }));
        Timer.startHandler();
    },

    stop(event) {
        // event.currentTarget.dispatchEvent(new Event('stop', { bubbles: true }));
        Timer.stopHandler();
    },
};

export default class Control2 {
    constructor(options) {
        this.$navigation = options.$navigation;

        document.addEventListener('work', this.statusHandler.bind(this), false);
        document.addEventListener('break', this.statusHandler.bind(this), false);
        document.addEventListener('relax', this.statusHandler.bind(this), false);
    }

    statusHandler({ target }){
        this.$navigation.querySelector('.navigation__btn_active')
            ?.classList.remove('navigation__btn_active');
        target?.classList.add('navigation__btn_active');
    }

    changeActiveBtn(status) {
        this.$navigation.querySelector('.navigation__btn_active')
            ?.classList.remove('navigation__btn_active');
        this.$navigation.querySelector(`.navigation__btn[data-status=${status}]`)
            ?.classList.add('navigation__btn_active');
    }

}
