(function () {
    'use strict';

    function TodoController(todoService, $q) {
        var vm = this;

        vm.fetchTodos = function() {
            todoService.get({}, function (todos) {
                vm.todos = todos;
            }, function() {
                vm.todos = [];
            });
        };

        vm.fetchTodos();

        vm.remaining = function () {
            var count = 0;
            angular.forEach(vm.todos, function (todo) {
                count += todo.completed ? 0 : 1;
            });
            return count;
        };


        vm.addTodo = function () {
            todoService.add({
                description: vm.description
            }, function() {
                vm.fetchTodos();
            });
            vm.description = '';
        };

        vm.update = function (todo) {
            todoService.update(todo, function () {
                vm.fetchTodos();
            }, function() {
                vm.fetchTodos();
            });
            vm.description = '';
        };

        vm.archive = function () {
            var oldTodos = vm.todos;
            var archived = [];
            angular.forEach(oldTodos, function (todo) {
                if (todo.completed) {
                    archived.push(archive(todo));
                }
            });
            $q.all(archived).then(function () {
                vm.fetchTodos();
            });
        };

        function archive(todo) {
            var deferred = $q.defer();
            todoService.archive(todo, function () {
                return deferred.resolve();
            }, function () {
                return deferred.reject();
            });
            return deferred.promise;
        }
    }

    TodoController.$inject = ['todoService', '$q']

    /** Todo controller. */
    angular
        .module('todo')
        .controller('TodoController', TodoController);
})();