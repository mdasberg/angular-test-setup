'use strict';

/**
 * PageObject is an API for the Todo.
 * @constructor
 */
var TodoPage = function () {
    this.el = element(by.tagName('todo'));
    this.available = function() {
        return this.el.element(by.binding('$ctrl.todos.length')).getText();
    };
    this.uncompleted = function() {
        return this.el.element(by.binding('$ctrl.uncompleted()')).getText();
    };
    this.todos = function() {
        return this.el.all(by.repeater('todo in $ctrl.todos'));
    };
    this.todo = function (index) {
        return new Todo(this.todos().get(index));
    };
    this.error = function() {
        return this.el.element(by.binding('$ctrl.error')).getText();
    };

    // actions
    this.add = function (description) {
        return this.el.element(by.model('$ctrl.description')).clear().sendKeys(description, protractor.Key.ENTER);
    };
    this.archive = function() {
        return this.el.element(by.css('[ng-click="$ctrl.archive()"]')).click();
    };
};

function Todo(todo) {
    this.todo = todo;
    this.isCompleted = function () {
        return this.todo.element(by.model('todo.completed')).isSelected();
    };
    this.description = function() {
        return this.todo.element(by.binding('::todo.description')).getText();
    };

    // actions
    this.complete = function() {
        return this.todo.element(by.model('todo.completed')).click();
    }
}


module.exports = TodoPage;