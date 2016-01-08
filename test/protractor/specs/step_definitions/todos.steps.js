module.exports = function () {
    var path = require('path'),
        basePath = path.resolve('.'),
        TodoPage = require('../../po/todoPage.po'),
        page;

    this.setDefaultTimeout(60 * 1000);

    this.Given(/^I have todos$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.Then(/^They should be visible$/, function (callback) {
        expect(page.todos.count()).to.eventually.equal(3);
        expect(page.todos.get(0).description).to.eventually.equal('do something');
        expect(page.todos.get(1).description).to.eventually.equal('do something else');
        expect(page.todos.get(2).description).to.eventually.equal('do something different').and.notify(callback);
    });

    this.Then(/^the total number of todos is visible$/, function (callback) {
        expect(page.information.total).to.eventually.equal('3').and.notify(callback);
    });

    this.Then(/^the total number of remaining uncompleted todos is visible$/, function (callback) {
        expect(page.information.remaining).to.eventually.equal('2').and.notify(callback);
    });

    var data = {
        remaining: undefined,
        total: undefined
    };
    this.Given(/^I have new todo$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-post.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        ngApimock.addMockModule();

        browser.get('/');

        page.information.remaining.then(function (remaining) {
            data.remaining = remaining;

            page.information.total.then(function (total) {
                data.total = total;
                callback();
            });
        });
    });

    this.When(/^I add the todo$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterAdd');
        page.actions.add('another todo').then(function () {

            callback();
        });

    });

    this.Then(/^it should be added to the list$/, function (callback) {
        expect(page.todos.count()).to.eventually.equal(4).and.notify(callback);
    });

    this.Then(/^the total number of todos should be updated$/, function (callback) {
        expect(page.information.total).to.eventually.not.equal(data.total).and.notify(callback);
    });

    this.Then(/^the total number of remaining uncompleted todos should be updated$/, function (callback) {
        expect(page.information.remaining).to.eventually.not.equal(data.remaining).and.notify(callback);
    });

    this.Given(/^I have completed todos that has not been archived yet$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-delete.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterAdd');
        ngApimock.addMockModule();

        browser.get('/');

        page.information.remaining.then(function (remaining) {
            data.remaining = remaining;

            page.information.total.then(function (total) {
                data.total = total;
                callback();
            });
        });
    });

    this.When(/^I archive the todos$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterArchive');
        page.actions.archive().then(function () {
            callback();
        });

    });

    this.Then(/^they should be removed from the list$/, function (callback) {
        expect(page.todos.count()).to.eventually.equal(3);
        expect(page.todos.get(0).description).to.eventually.equal('do something');
        expect(page.todos.get(1).description).to.eventually.equal('do something different');
        expect(page.todos.get(2).description).to.eventually.equal('another todo').and.notify(callback);
    });

    this.Then(/^the total number of remaining uncompleted todos should be unchanged/, function (callback) {
        expect(page.information.remaining).to.eventually.equal(data.remaining).and.notify(callback);
    });

    this.Then(/^the total number of completed but unarchived todos should be updated$/, function (callback) {
        page.information.total.then(function (total) {
            page.information.remaining.then(function (remaining) {
                expect((total - remaining)).to.not.equal((data.total - data.remaining));
                callback();
            });
        });

    });

    this.Given(/^I have completed a todo$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-put.json'), 'success');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterArchive');
        ngApimock.addMockModule();

        browser.get('/');

        page.information.remaining.then(function (remaining) {
            data.remaining = remaining;

            page.information.total.then(function (total) {
                data.total = total;
                callback();
            });
        });
    });

    this.When(/^I check the todo as completed$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'afterCheck');
        page.todos.get(2).check().then(function () {
            callback();
        });

    });

    this.Then(/^it should be marked as completed$/, function (callback) {
        expect(page.todos.get(2).isChecked()).to.eventually.be.true.and.notify(callback);
    });

    this.Given(/^an error occurred while fetching the todos$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'oops');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));
        callback();
    });

    this.Then(/^the total number of todos should be (\d+)$/, function (arg1, callback) {
        expect(page.information.total).to.eventually.equal(arg1).and.notify(callback);
    });

    this.Then(/^the total number of remaining uncompleted todos should be (\d+)$/, function (arg1, callback) {
        expect(page.information.remaining).to.eventually.equal(arg1).and.notify(callback);
    });

    this.Then(/^the total number of completed but unarchived todos should be (\d+)$/, function (arg1, callback) {
        page.information.total.then(function (total) {
            page.information.remaining.then(function (remaining) {
                expect((total - remaining)).to.equal(parseInt(arg1));
                callback();
            });
        });

    });

    this.Given(/^an error occurred while adding a todo$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-post.json'), 'oops');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));

        page.actions.add('another todo').then(function () {
            callback();
        });
    });

    this.Given(/^an error occurred while archiving a todo$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-delete.json'), 'oops');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));

        page.information.remaining.then(function (remaining) {
            data.remaining = remaining;

            page.information.total.then(function (total) {
                data.total = total;
            });
        });

        page.actions.archive().then(function () {
            callback();
        });
    });

    this.Then(/^the total number of todos should not update$/, function (callback) {
        expect(page.information.total).to.eventually.equal(data.total).and.notify(callback);
    });

    this.Then(/^the total number of remaining uncompleted todos should not be updated$/, function (callback) {
        expect(page.information.remaining).to.eventually.equal(data.remaining).and.notify(callback);
    });

    this.Then(/^the total number of completed but unarchived todos should not be updated$/, function (callback) {
        page.information.total.then(function (total) {
            page.information.remaining.then(function (remaining) {
                expect((total - remaining)).to.equal((data.total - data.remaining));
                callback();
            });
        });
    });

    this.Given(/^an error occurred while completing a todo$/, function (callback) {
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-all.json'), 'initial');
        ngApimock.selectScenario(require(basePath + '/test/mocks/api-todos-put.json'), 'oops');
        ngApimock.addMockModule();

        browser.get('/');
        page = new TodoPage(element(by.id('todo')));

        page.information.remaining.then(function (remaining) {
            data.remaining = remaining;

            page.information.total.then(function (total) {
                data.total = total;
            });
        });

        page.todos.get(0).check().then(function () {
            callback();
        });
    });
};