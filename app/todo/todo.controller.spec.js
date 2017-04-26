(function () {
    'use strict';

    describe('TodoController', function () {
        var scope, controller, todoServiceMock;
        var testData = [
            {
                "description": "do something",
                "completed": false
            },
            {
                "description": "do something else",
                "completed": true
            },
            {
                "description": "do something different",
                "completed": true
            },
            {
                "description": "another todo",
                "completed": false
            }
        ];


        beforeEach(function () {
            module('todo');

            todoServiceMock = {
                get: jasmine.createSpy('get'),
                add: jasmine.createSpy('add'),
                complete: jasmine.createSpy('complete'),
                archive: jasmine.createSpy('archive')
            };

            inject(function ($componentController, $rootScope) {
                scope = $rootScope.$new();
                controller = $componentController('todo', {$scope: scope, todoService: todoServiceMock}, null);

            });
        });

        describe('$onInit', function () {
            describe('fetches the available todos from the todoService', function () {
                it('call the todoService', function () {
                    controller.$onInit();

                    expect(todoServiceMock.get).toHaveBeenCalled();
                });

                describe('when the todoService errors', function () {
                    beforeEach(function () {
                        todoServiceMock.get.and.callFake(function (parameters, success, error) {
                            return error();
                        });
                        controller.$onInit();
                    });

                    it('sets the todos to []', function () {
                        expect(controller.todos).toEqual([]);
                    });

                    it('sets the error', function () {
                        expect(controller.error).toBe('An error occurred when fetching available todos');
                    });
                });

                describe('when the todoService returns the available todos', function () {
                    beforeEach(function () {
                        todoServiceMock.get.and.callFake(function (parameters, success) {
                            return success(testData);
                        });
                        controller.$onInit();
                    });

                    it('sets the todos to the available todos', function () {
                        expect(controller.todos).toEqual(testData);
                    });

                    it('fail on purpose', function () {
                        expect(controller2.todos).toEqual(testData);
                    });

                    it('sets the error to undefined', function () {
                        expect(controller.error).toBeUndefined();
                    });
                });
            });
        });

        describe('add', function () {
            describe('registers a new todo with the todoService', function () {
                beforeEach(function () {
                    controller.description = 'todo';
                });

                it('call the todoService', function () {
                    controller.add();
                    expect(todoServiceMock.add).toHaveBeenCalledWith({description: 'todo'}, jasmine.any(Function), jasmine.any(Function));
                });

                describe('when the todoService errors', function () {
                    beforeEach(function () {
                        todoServiceMock.add.and.callFake(function (parameters, success, error) {
                            return error();
                        });
                        controller.add();
                    });

                    it('sets the description to empty', function () {
                        expect(controller.description).toBe('');
                    });

                    it('sets the error', function () {
                        expect(controller.error).toBe('An error occurred when adding a todo');
                    });
                });

                describe('when the todoService adds a todo', function () {
                    beforeEach(function () {
                        todoServiceMock.add.and.callFake(function (parameters, success) {
                            return success();
                        });
                        controller.add();
                    });

                    it('sets the description to empty', function () {
                        expect(controller.description).toBe('');
                    });

                    it('fetches the available todos', function () {
                        expect(todoServiceMock.get).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('complete', function () {
            describe('updates the complete state of a todo with the todoService', function () {
                it('call the todoService', function () {
                    controller.complete(testData[0]);
                    expect(todoServiceMock.complete).toHaveBeenCalledWith(testData[0], jasmine.any(Function), jasmine.any(Function));
                });

                describe('when the todoService errors', function () {
                    beforeEach(function () {
                        todoServiceMock.complete.and.callFake(function (parameters, success, error) {
                            return error();
                        });
                        controller.complete(testData[0]);
                    });

                    it('sets the error', function () {
                        expect(controller.error).toBe('An error occurred when completing a todo');
                    });
                });

                describe('when the todoService completes a todo', function () {
                    beforeEach(function () {
                        todoServiceMock.complete.and.callFake(function (parameters, success) {
                            return success();
                        });
                        controller.complete(testData[0]);
                    });

                    it('fetches the available todos', function () {
                        expect(todoServiceMock.get).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('archive', function () {
            describe('archive the completed todos with the todoService', function () {
                beforeEach(function () {
                    controller.todos = testData;
                });
                it('call the todoService', function () {
                    controller.archive();
                    expect(todoServiceMock.archive.calls.count()).toBe(2);
                    expect(todoServiceMock.archive).toHaveBeenCalledWith(testData[1], jasmine.any(Function), jasmine.any(Function));
                    expect(todoServiceMock.archive).toHaveBeenCalledWith(testData[2], jasmine.any(Function), jasmine.any(Function));
                });

                describe('when the todoService errors', function () {
                    beforeEach(function () {
                        todoServiceMock.archive.and.callFake(function (parameters, success, error) {
                            return error();
                        });
                        controller.archive();
                        scope.$apply(); // resolve the promise
                    });

                    it('sets the error', function () {
                        expect(controller.error).toBe('An error occurred when archiving completed todos');
                    });
                });

                describe('when the todoService archives the completed todos', function () {
                    beforeEach(function () {
                        todoServiceMock.archive.and.callFake(function (parameters, success) {
                            return success();
                        });
                        controller.archive();
                        scope.$apply(); // resolve the promise
                    });

                    it('fetches the available todos', function () {
                        expect(todoServiceMock.get).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('uncompleted', function () {
            beforeEach(function () {
                controller.todos = testData;
            });
            it('returns the uncompleted todos', function () {
                var uncompleted = controller.uncompleted();
                expect(uncompleted.length).toBe(2);
            });
        });

    });
})();