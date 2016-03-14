module.exports = function () {
    var path = require('path'),
        basePath = path.resolve('.'),
        TodoPage = require('../../po/todoPage.po'),
        page,
        configuration = {
            afterAdd: 'afterAdd',
            afterArchive: 'afterArchive',
            afterCheck: 'afterCheck'
        };

    this.setDefaultTimeout(60 * 1000);

    var mockData = {
        todos: require(basePath + '/test/mocks/api-todos-all.json'),
        addTodo: require(basePath + '/test/mocks/api-todos-post.json'),
        updateTodo: require(basePath + '/test/mocks/api-todos-put.json'),
        deleteTodo: require(basePath + '/test/mocks/api-todos-delete.json')
    };

    this.Given(/^I have todos$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'initial');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.Given(/^I have new todo$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'initial');
        ngApimock.selectScenario(mockData.addTodo, 'success');
        ngApimock.addMockModule();

        browser.get('/');
        callback();
    });

    this.Given(/^I have completed todos that has not been archived yet$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'afterAdd');
        ngApimock.selectScenario(mockData.deleteTodo, 'success');
        ngApimock.addMockModule();

        browser.get('/');
        callback();
    });

    this.Given(/^I have completed a todo$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'afterArchive');
        ngApimock.selectScenario(mockData.updateTodo, 'success');
        ngApimock.addMockModule();

        browser.get('/');
        callback();
    });

    this.Given(/^an error occurred while fetching the todos$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'oops');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.Given(/^an error occurred while adding a todo$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'initial');
        ngApimock.selectScenario(mockData.addTodo, 'oops');
        ngApimock.addMockModule();

        configuration.afterAdd = 'initial';

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.Given(/^an error occurred while archiving a todo$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'initial');
        ngApimock.selectScenario(mockData.deleteTodo, 'oops');
        ngApimock.addMockModule();

        configuration.afterArchive = 'initial';

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.Given(/^an error occurred while completing a todo$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, 'initial');
        ngApimock.selectScenario(mockData.updateTodo, 'oops');
        ngApimock.addMockModule();

        configuration.afterCheck = 'initial';

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.When(/^I add the todo$/, function (callback) {

        ngApimock.selectScenario(mockData.todos, configuration.afterAdd);
        page.actions.add('another todo').then(function () {
            callback();
        });
    });

    this.When(/^I archive the todos$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, configuration.afterArchive);
        page.actions.archive().then(function () {
            callback();
        });
    });

    this.When(/^I check the todo as completed$/, function (callback) {
        ngApimock.selectScenario(mockData.todos, configuration.afterCheck);
        page.todos.get(2).check().then(function () {
            callback();
        });
    });

    this.Then(/^the total number of todos is (.*)$/, function (numberOfTodos, callback) {
        expect(page.information.total).to.eventually.equal(numberOfTodos).and.notify(callback);
    });

    this.Then(/^the total number of remaining uncompleted todos is (.*)$/, function (numberOfUncompletedTodos, callback) {
        expect(page.information.remaining).to.eventually.equal(numberOfUncompletedTodos).and.notify(callback);
    });

    this.Then(/^the total number of completed but unarchived todos is (\d+)$/, function (numberOfUnarchivedTodos, callback) {
        page.information.total.then(function (total) {
            page.information.remaining.then(function (remaining) {
                expect((total - remaining)).to.equal(parseInt(numberOfUnarchivedTodos));
                callback();
            });
        });
    });

    this.Then(/^todo (.*) with description (.*) should be present$/, function (index, description, callback) {
        expect(page.todos.get(index).description).to.eventually.equal(description).and.notify(callback);
    });

    this.Then(/^todo (.*) should be marked as completed (.*)$/, function (index, completed, callback) {
        expect(page.todos.get(index).isChecked()).to.eventually.be.equal(completed === 'true').and.notify(callback);
    });
};