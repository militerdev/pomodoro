import './index.scss';

import { App } from './app/App';

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
