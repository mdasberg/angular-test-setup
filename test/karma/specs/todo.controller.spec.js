(function () {
    'use strict';

    describe('The todo controller', function () {
        var $scope, controller, $controller, $compile, $q, todoService;
        var completedTodo = {description: 'do something else', completed: true},
            testData = [
                {
                    "description": "do something",
                    "completed": false
                },
                completedTodo
            ];


        beforeEach(function () {
            module('todo');

            inject(function ($rootScope, _$controller_, _$compile_, _$q_, _todoService_) {
                $scope = $rootScope.$new();
                $controller = _$controller_;
                $compile = _$compile_;
                $q = _$q_;
                todoService = _todoService_;
            });
        });

        it('should make the todo array available by default when api response is ok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            // should fail
            controller2 = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            expect(todoService.get).toHaveBeenCalled();
            expect(todoService.get.calls.count()).toBe(1);
            expect(controller.todos).toBe(testData)
        });

        it('should make an empty todo array available by default when api response is nok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return error();
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            expect(todoService.get).toHaveBeenCalled();
            expect(todoService.get.calls.count()).toBe(1);
            expect(controller.todos).toEqual([])
        });

        it('should get remaining todos', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            expect(controller.remaining()).toBe(1);
            expect(todoService.get.calls.count()).toBe(1);
        });

        it('should add a todo and fetch todos when api response is ok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            spyOn(todoService, 'add').and.callFake(function (parameters, success, error) {
                return success();
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();
            controller.description = 'description';

            controller.addTodo($scope.description);

            expect(todoService.add).toHaveBeenCalledWith({description: 'description'}, jasmine.any(Function));
            expect(controller.description).toBe('');
            expect(todoService.get.calls.count()).toBe(2);
        });

        it('should update a todo and fetch todos when api response is ok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            spyOn(todoService, 'update').and.callFake(function (parameters, success, error) {
                return success();
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            controller.update({description: 'description', completed: true});

            expect(todoService.update).toHaveBeenCalledWith({description: 'description', completed: true},
                jasmine.any(Function), jasmine.any(Function));
            expect(todoService.get.calls.count()).toBe(2);
        });

        it('should update a todo and fetch todos when api response is nok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            spyOn(todoService, 'update').and.callFake(function (parameters, success, error) {
                return error();
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            controller.update(completedTodo);

            expect(todoService.update).toHaveBeenCalledWith(completedTodo,
                jasmine.any(Function), jasmine.any(Function));
            expect(todoService.get).toHaveBeenCalled();
            expect(todoService.get.calls.count()).toBe(2);
        });

        it('should archive a todo and fetch todos when api response is ok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            spyOn(todoService, 'archive').and.callFake(function (parameters, success, error) {
                return success();
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            controller.archive();

            $scope.$apply();

            expect(todoService.archive).toHaveBeenCalledWith(completedTodo, jasmine.any(Function), jasmine.any(Function));
            expect(todoService.archive.calls.count()).toBe(1);
            expect(todoService.get.calls.count()).toBe(2);
        });

        it('should archive a todo and fetch todos when api response is nok', function () {
            spyOn(todoService, 'get').and.callFake(function (parameters, success, error) {
                return success(testData);
            });

            spyOn(todoService, 'archive').and.callFake(function (parameters, success, error) {
                return error();
            });

            controller = $controller('TodoController', {
                $scope: $scope,
                todoService: todoService,
                $q: $q
            });
            $scope.$digest();

            controller.archive();

            $scope.$apply();

            expect(todoService.archive).toHaveBeenCalledWith(completedTodo, jasmine.any(Function), jasmine.any(Function));
            expect(todoService.archive.calls.count()).toBe(1);
            expect(todoService.get.calls.count()).toBe(2);
        });
    });
})();