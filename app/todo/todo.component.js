(function() {
    'use strict';

    angular
        .module('todo')
        .component('todo', {
            controller: 'TodoController',
            templateUrl: 'todo/todo.tpl.html'
        });
})();