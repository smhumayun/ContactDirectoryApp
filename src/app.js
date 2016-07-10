require('angular');
require('angular-ui-router');
require('angular-resource');
require('./js/controllers');
require('./js/services');

angular
    .module('contactDirectoryWebApp', ['ui.router', 'ngResource', 'contactDirectoryWebApp.controllers', 'contactDirectoryWebApp.services'])
    .config(function($stateProvider) {
      $stateProvider.state('contacts', { // state for showing all backup tasks
        url: '/contacts',
        templateUrl: 'partials/contacts.html',
        controller: 'ContactListController'
        }).state('viewContact', { //state for showing a backup task
        url: '/contacts/:id/view',
        templateUrl: 'partials/contact-view.html',
        controller: 'ContactViewController'
        }).state('newContact', { //state for adding a new backup task
        url: '/contacts/new',
        templateUrl: 'partials/contact-add.html',
        controller: 'ContactCreateController'
        }).state('editContact', { //state for updating a backup task
        url: '/contacts/:id/edit',
        templateUrl: 'partials/contact-edit.html',
        controller: 'ContactEditController'
        });
      })
    .run(function($state) {
      $state.go('contacts'); //make a transition to contacts state when app starts
      });