'use strict';

var path = require('path'),
    basePath = path.resolve('.');

describe('Happy flow', function () {
    var TodoPage = require('../po/todoPage.po');
    var page;
    beforeAll(function () {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-post.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-delete.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-put.json'), 'success');
        ngApimock.addMockModule();
        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
    });

    it('should show all todos', function () {
        expect(page.todos.count()).toBe(3);
        expect(page.todos.get(0).description).toBe('do something');
        expect(page.todos.get(1).description).toBe('do something else');
        expect(page.todos.get(2).description).toBe('do something different')
    });

    it('should show the total number of todos', function() {
        expect(page.information.total).toBe('3');
    });

    it('should show the total number of remaining uncompleted todos', function () {
        expect(page.information.remaining).toBe('2');
    });

    it('should add a todo', function () {
        expect(page.todos.count()).toBe(3);
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterAdd');

        page.actions.add('another todo');
        expect(page.todos.count()).toBe(4);


    });

    it('should archive completed todo', function () {
        expect(page.todos.count()).toBe(4);
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterArchive');

        page.actions.archive();
        expect(page.todos.count()).toBe(3);
    });

    it('should mark a todo as completed', function () {
        expect(page.information.remaining).toBe('3');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterCheck');

        page.todos.get(2).check();
        expect(page.information.remaining).toBe('2');
    });
});