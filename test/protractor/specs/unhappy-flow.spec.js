'use strict';

var path = require('path'),
    basePath = path.resolve('.');

describe('Unhappy flow', function () {
    var TodoPage = require('../po/todoPage.po');
    var page;
    beforeAll(function () {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'oops');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-post.json'), 'oops');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-put.json'), 'oops');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-delete.json'), 'oops');
        ngApimock.addMockModule();
        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
    });

    describe('when the backend returns anything other than a status 200', function() {
        it('should not show any todo', function () {
            expect(page.todos.count()).toBe(0);
        });

        it('should show the total number of todos', function() {
            expect(page.information.total).toBe('0');
        });

        it('should show the total number of remaining uncompleted todos', function () {
            expect(page.information.remaining).toBe('0');
        });

        it('should not add a todo', function () {
            expect(page.todos.count()).toBe(0);
            ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'oops');

            page.actions.add('another todo');
            expect(page.todos.count()).toBe(0);
        });

        it('should not archive completed todo', function () {
            ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
            page.actions.refresh();

            expect(page.todos.count()).toBe(3);

            page.actions.archive();

            expect(page.todos.count()).toBe(3);
        });

        it('should not mark a todo as completed', function () {

            expect(page.information.remaining).toBe('2');

            page.todos.get(2).check();

            expect(page.information.remaining).toBe('2');
        });
    });
});