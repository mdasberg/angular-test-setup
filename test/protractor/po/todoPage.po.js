'use strict';

/**
 * PageObject is an API for the Todo.
 * @constructor
 */
var TodoPage = function () {
    this.el = element(by.id('todo'));
};

TodoPage.prototype = Object.create({}, {
    information: {
        get: function () {
            return new Information(this.el);
        }
    },
    todos: {
        get: function () {
            return new Todos(this.el.all(by.repeater('todo in vm.todos')));
        }
    },
    actions: {
        get: function() {
            return new Actions(this.el);
        }
    }
});

var Information = function (el) {
    this.el = el;
};

Information.prototype = Object.create({}, {
    total: {
        get: function () {
            return this.el.element(by.binding('vm.todos.length')).getText();
        }
    },
    remaining: {
        get: function () {
            return this.el.element(by.binding('vm.remaining()')).getText();
        }
    }
});

var Actions = function (el) {
    this.el = el;
};

Actions.prototype = Object.create({}, {
    add: {
        value: function (description) {
            return this.el.element(by.model('vm.description')).clear().sendKeys(description,  protractor.Key.ENTER);
        }
    },
    archive: {
        value: function () {
            return this.el.element(by.linkText('Clear completed')).click();
        }
    },
    refresh: {
        value: function () {
            return this.el.element(by.linkText('Refresh')).click();
        }
    },
});

var Todos = function (el) {
    this.el = el;
};

Todos.prototype = Object.create({}, {
    count: {
        value: function () {
            return this.el.count();
        }
    },
    get: {
        value: function (index) {
            return new Todo(this.el.get(index));
        }
    }
});

var Todo = function (el) {
    this.el = el;
};

Todo.prototype = Object.create({}, {
    description: {
        get: function () {
            return this.el.element(by.binding('todo.description')).getText();
        }
    },
    isChecked: {
        value: function () {
            return this.el.element(by.model('todo.completed')).isSelected();
        }
    },
    check: {
        value: function (description) {
            return this.el.element(by.model('todo.completed')).click();
        }
    }
});

module.exports = TodoPage;