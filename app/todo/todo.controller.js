(function () {
    'use strict';

    angular
        .module('todo')
        .controller('TodoController', TodoController);

    function TodoController(service, $q) {
        var vm = this;
        vm.$onInit = onInit;
        vm.add = add;
        vm.complete = complete;
        vm.archive = archive;
        vm.uncompleted = uncompleted;

        /** Initialize. */
        function onInit() {
            _fetch();
        }

        /**
         * Fetch the todo's
         * @private
         */
        function _fetch() {
            vm.error = undefined;
            service.get({}, function (todos) {
                vm.todos = todos;
            }, function () {
                vm.todos = [];
                vm.error = 'An error occurred when fetching available todos';
            });
        }

        /**
         * Add the given todo.
         * @param todo The todo
         */
        function add() {
            vm.error = undefined;
            service.add({
                description: vm.description
            }, function() {
                _fetch();
            }, function() {
                vm.error = 'An error occurred when adding a todo';
            });
            vm.description = '';
        }

        /**
         * Complete the given todo.
         * @param todo The todo
         */
        function complete(todo) {
            vm.error = undefined;
            service.complete(todo, function() {
                _fetch();
            }, function() {
                vm.error = 'An error occurred when completing a todo';
            });
        }

        /** Archive the completed todo's.*/
        function archive() {
            vm.error = undefined;
            var promises = [];
            vm.todos.filter(function (todo) {
                return todo.completed;
            }).forEach(function (todo) {
                promises.push(_archive(todo));
            });

            $q.all(promises).then(function () {
                _fetch();
            }).catch(function () {
                vm.error = 'An error occurred when archiving completed todos';
            });
        }

        /**
         * Get the remaining non completed todo's count.
         * @return {number}
         */
        function uncompleted() {
            return vm.todos.filter(function (todo) {
                return !todo.completed;
            });
        }

        /**
         * Archive the given todo.
         * @param todo The todo.
         * @private
         */
        function _archive(todo) {
            var deferred = $q.defer();
            service.archive(todo, function () {
                return deferred.resolve();
            }, function () {
                return deferred.reject();
            });
            return deferred.promise;
        }
    }

    TodoController.$inject = ['todoService', '$q'];

})();