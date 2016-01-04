'use strict';

var path = require('path'),
    basePath = path.resolve('.'),
    ngApimock = require(basePath + '/.tmp/mocking/protractor.mock');


describe('Happy flow', function () {
    var TodoPO = require('../po/todo.po');
    var todoPo;
    beforeAll(function () {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-post.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-delete.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-put.json'), 'success');
        ngApimock.addMockModule();
        browser.get('/');
        todoPo = new TodoPO(by.id('todo'));
    });

    it('should show all todos', function () {
        expect(todoPo.count()).toBe('3');
    });

    it('should show remaining', function () {
        expect(todoPo.remaining()).toBe('2');
    });

    it('should add a todo', function () {
        expect(todoPo.count()).toBe('3');

        todoPo.add('another todo').then(function () {
            ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterAdd');
        });

        expect(todoPo.count()).toBe('4');
    });

    it('should archive completed todo', function () {
        expect(todoPo.count()).toBe('4');

        todoPo.archive().then(function () {
            ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterArchive');
        });
        expect(todoPo.count()).toBe('3');
    });

    it('should mark a todo as completed', function () {
        expect(todoPo.remaining()).toBe('3');

        todoPo.check('another todo').then(function () {
            ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterCheck');
        });
        expect(todoPo.remaining()).toBe('2');
    });
});