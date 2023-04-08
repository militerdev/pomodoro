import { createElement } from '../../createElement';
import { Todo } from '../Todo/Todo';

export const Stats = {
    init(options = {}){

    },

    renderInit(parent) {
        this.$stats = createElement('div', {
            className: 'stats',
        }, {
            parent,
            append: createElement('h3', {
                className:   'stats__title',
                textContent: 'Статистика',
            })
        });

        this.$list = createElement('ul', {
            className: 'stats__list',
        }, {
            parent: this.$stats
        });

        this.$pomodoro = createElement('li', {
            className: 'stats__item stats__pomodoro',
        }, {
            parent: this.$list
        });

        createElement('li', {
            className:   'stats__item stats__pomodoro-caption',
            textContent: 'Помодорки',
        }, {
            parent: this.$list,
        });

        const createStatsItem = (caption, value) => {
            const listItem = createElement('li', {
                className: 'stats__item',
                innerHTML: `<span class="stats__caption">${caption}:</span>`,
            }, {
                parent: this.$list,
            });

            return createElement('span', {
                className: `stats__${value}`
            }, {
                parent: listItem
            });
        };

        this.$work = createStatsItem('Работа', 'work');
        this.$relax = createStatsItem('Отдых', 'relax');
        this.$total = createStatsItem('Всего', 'total');
    },

    render() {
        const todo = Todo.active;
        this.$pomodoro.textContent = todo?.pomodoro ?? 0;
        this.$work.textContent = todo?.work ?? 0;
        this.$relax.textContent = todo?.relax ?? 0;
        this.$total.textContent = todo?.total ?? 0;
    },
};
