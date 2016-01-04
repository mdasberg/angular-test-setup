'use strict';

/**
 * PageObject is an API for the Todo.
 * @param locator The locator of the todo
 * @constructor
 */
var TodoPO = function () {
};

TodoPO.prototype = Object.create({}, {
    refresh: {
        value: function () {
            return element(by.linkText('refresh')).click();
        }
    },
    remaining: {
        value: function () {
            return element(by.binding('vm.remaining()')).getText();
        }
    },
    count: {
        value: function () {
            return element(by.binding('vm.todos.length')).getText();
        }
    },
    check: {
        value: function (description) {
            return element(by.id(description)).click();
        }
    },
    add: {
        value: function (description) {
            return element(by.model('vm.description')).clear().sendKeys(description).then(function() {
                return element(by.buttonText('add')).click();
            });
        }
    },
    archive: {
        value: function () {
            return element(by.linkText('archive')).click();
        }
    }
});

module.exports = TodoPO;