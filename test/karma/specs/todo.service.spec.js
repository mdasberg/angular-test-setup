(function () {
    'use strict';

    describe('The todo service', function () {
        var $httpBackend, todoService,
            stubs = [
                {description: 'x', completed: false},
                {description: 'y', completed: false}
            ];

        beforeEach(function () {
            module('todo');

            inject(function (_$httpBackend_, _todoService_) {
                $httpBackend = _$httpBackend_;
                todoService = _todoService_;
            });
        });

        it('should get todos', function() {
            $httpBackend.expectGET('/api/todos').respond(stubs);

            todoService.get({});

            $httpBackend.flush();
        });

        it('should add a todo', function() {
            $httpBackend.expectPOST('/api/todos').respond(function(method, url, data, headers){
                return [200, {}, {}];
            });

            todoService.add({description: 'z', completed: false});
            $httpBackend.flush();

        });

        it('should update a todo', function() {
            $httpBackend.expectPUT('/api/todos').respond(function(method, url, data, headers){
                return [200, {}, {}];
            });

            todoService.update({description: 'z', completed: true});
        });

        it('should archive a todo', function() {
            $httpBackend.expectDELETE('/api/todos?completed=true&description=z').respond(function(method, url, data, headers){
                return [200, {}, {}];
            });

            todoService.archive({description: 'z', completed: true});
            $httpBackend.flush();
        });
    });
})();