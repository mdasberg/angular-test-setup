'use strict';

var path = require('path'),
    basePath = path.resolve('.'),
    ngApimock = require(basePath + '/.tmp/mocking/protractor.mock');


describe('Unhappy flow', function () {
    var TodoPO = require('../po/todo.po');
    var todoPo;
    beforeAll(function () {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'oops');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-post.json'), 'oops');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-put.json'), 'oops');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-delete.json'), 'oops');
        ngApimock.addMockModule();
        browser.get('/');
        todoPo = new TodoPO(by.id('todo'));
    });

    it('should not show any todos when the backend returns anything other than a status 200', function () {
        expect(todoPo.count()).toBe('0');
    });

    it('should not show any remaining todos when the backend returns anything other than a status 200', function () {
        expect(todoPo.remaining()).toBe('0');
    });

    it('should not add a todo when the backend returns anything other than a status 200', function () {
        expect(todoPo.count()).toBe('0');

        todoPo.add('another todo').then(function () {
            ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'oops');
        });

        expect(todoPo.count()).toBe('0');
    });

    it('should not complete a todo when the backend returns anything other than a status 200', function () {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        todoPo.refresh();
        expect(todoPo.count()).toBe('3');

        todoPo.check('do something else');

        expect(todoPo.count()).toBe('3');
    });

    it('should not archive a todo when the backend returns anything other than a status 200', function () {
        expect(todoPo.count()).toBe('3');

        todoPo.archive();

        expect(todoPo.count()).toBe('3');
    });
});