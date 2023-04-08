import './index.scss';

// import Pomodoro from './modules/Pomodoro.js';
import { App } from './app/App';

// document.querySelector('#app');

// const pomodoroDefault = new Pomodoro();

App.init({
    name:        'Pomodoro',
    storageName: 'pomodoro',
    timer:       {
        work:  25,
        break: 5,
        relax: 20,
        count: 4,
    }
});
