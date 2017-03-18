module.exports = function () {
    var TodoPage = require('./todo.component.po');
    var po;

    this.Given(/^there are todos in my todo list$/, function (next) {
        ngApimock.setAllScenariosToDefault().then(function () {
            browser.get('/').then(function () {
                po = new TodoPage();
                next();
            });
        });
    });

    this.Then(/^the number of available todos is (\d+)$/, function (numberOfTodos) {
        return expect(po.available()).to.eventually.equal(numberOfTodos);
    });

    this.Then(/^the number of uncompleted todos is (\d+)$/, function (uncompletedTodos) {
        return expect(po.uncompleted()).to.eventually.equal(uncompletedTodos);
    });

    this.Then(/^the following todos are available:$/, function (table) {
        var promises = [];
        table.hashes().forEach(function (row) {
            promises.push(expect(po.todo(row.index).isCompleted()).to.eventually.equal(JSON.parse(row.completed)));
            promises.push(expect(po.todo(row.index).description()).to.eventually.equal(row.description));
        });

        return protractor.promise.all(promises);
    });
    this.Then(/^the error '(.*)' is shown$/, function (errorMessage) {
        return expect(po.error()).to.eventually.equal(errorMessage);
    });


    this.When(/^a todo is added$/, function () {
        return ngApimock.selectScenario('Get all todos', 'afterAdd').then(function () {
            return po.add('another todo');
        });
    });

    this.When(/^the completed todos are archived$/, function () {
        return ngApimock.selectScenario('Get all todos', 'afterArchive').then(function () {
            return po.archive();
        });
    });

    this.When(/^a todo is completed$/, function () {
        return ngApimock.selectScenario('Get all todos', 'afterCompleted').then(function () {
            return po.todo(2).complete();
        });
    });

    this.Given(/^the todo service throws an error while fetching the available todos$/, function (next) {
        ngApimock.selectScenario('Get all todos', 'oops').then(function () {
            browser.get('/').then(function () {
                po = new TodoPage();
                next();
            });
        });
    });
    this.Given(/^a todo is added the todo service throws an error$/, function () {
        return ngApimock.selectScenario('Add todo', 'oops').then(function () {
            return po.add('another todo');
        });
    });

    this.When(/^the completed todos are archived the todo service throws an error$/, function () {
        return ngApimock.selectScenario('Delete todo', 'oops').then(function () {
            return po.archive();
        });
    });

    this.When(/^a todo is completed the todo service throws an error$/, function () {
        return ngApimock.selectScenario('Update todo', 'oops').then(function () {
            return po.todo(2).complete();
        });
    });
};