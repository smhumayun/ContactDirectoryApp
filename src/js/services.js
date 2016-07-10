angular.module('contactDirectoryWebApp.services', [])
    .factory('Contact', function($resource) {
        return $resource('http://localhost:8080/api/contacts/:id', { id: '@id' }, {
            update: {
                method: 'PUT'
                },
            query: {
                method: 'GET',
                isArray: false
            }
            });
    });