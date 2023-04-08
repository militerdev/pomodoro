import { createElement } from '../../createElement';
import { Timer } from '../Timer/Timer';

export const Navigation = {
    init(){

    },

    renderInit(parent) {
        // function changeActiveBtn(target){
        //     this.$navigation.querySelector('.navigation__btn_active')
        //         ?.classList.remove('navigation__btn_active');
        //     target?.classList.add('navigation__btn_active');
        // }

        function changeActiveBtn(status){
            this.changeActiveBtn(status);
        }

        const createEvent = (type, target) => {
            target.dispatchEvent(new Event(
                type,
                { bubbles: true }
            ));
        };

        const statusHandler = {
            work({ currentTarget }) {
                // changeActiveBtn(currentTarget);
                changeActiveBtn('work');
                Timer.setStatus('work');
                // createEvent('work', currentTarget);
            },

            break({ currentTarget }) {
                // changeActiveBtn(currentTarget);
                changeActiveBtn('break');
                Timer.setStatus('break');
                // createEvent('break', currentTarget);
            },

            relax({ currentTarget }) {
                // changeActiveBtn(currentTarget);
                changeActiveBtn('relax');
                Timer.setStatus('relax');
                // createEvent('relax', currentTarget);
            },
        };

        this.$navigation = createElement('div', {
            className: 'navigation',
        }, {
            parent
        });

        const createButton = (title, status, active = false) => {
            createElement('button', {
                className:   `navigation__btn${active ? ' navigation__btn_active' : ''}`,
                textContent: title,
            }, {
                parent:  this.$navigation,
                cb:      $btn => $btn.dataset.status = status,
                onclick: this[status].bind(this),
            });
        };

        createButton('Работа', 'work', true);
        createButton('Перерыв', 'break');
        createButton('Отдых', 'relax');
    },

    work() {
        this.changeActiveBtn('work');
        Timer.setStatus('work');
    },

    break() {
        this.changeActiveBtn('break');
        Timer.setStatus('break');
    },

    relax() {
        this.changeActiveBtn('relax');
        Timer.setStatus('relax');
    },

    changeActiveBtn(status) {
        this.$navigation.querySelector('.navigation__btn_active')
            ?.classList.remove('navigation__btn_active');
        this.$navigation.querySelector(`.navigation__btn[data-status=${status}]`)
            ?.classList.add('navigation__btn_active');
    },
};
