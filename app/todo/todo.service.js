(function () {
    'use strict';

    /** Service which is responsible for communicating with the rest api.*/
    angular
        .module('todo')
        .factory('todoService', TodoService);

    function TodoService($resource) {
        return $resource('/api/todos', {}, {
            get: {
                method: 'GET',
                isArray: true
            },
            add: {
                method: 'POST'
            },
            complete: {
                method: 'PUT'
            },
            archive: {
                method: 'DELETE'
            }
        });
    }

    TodoService.$inject = ['$resource'];
})();