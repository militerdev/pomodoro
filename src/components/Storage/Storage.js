export default class Storage {
    static #NAME = 'pomodoro';

    constructor(name) {
        this.name = name ?? Storage.#NAME;
        this.list = this.#getList();
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

    #getItem(id) {
        return this.list.find(item => item.id === id);
    }

    #addItem(item) {
        this.list.push(item);
        this.setList(this.list);
        return item;
    }

    #updateItem(source) {
        const target = this.getItem(source.id);
        const updatedItem = Object.assign(target, source);
        this.setList(this.list);
        return updatedItem;
    }

    #removeItem(id) {
        this.list = this.list.filter(item => item.id !== id);
        this.setList(this.list);
    }
}
