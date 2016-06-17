'use strict';

/**
 * Angular app dependencies
 */
var answareApp = angular.module('answareApp', [
  'checklist-model',
  'angular-svg-round-progressbar',
  'timer',
  'cgBusy',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'answareControllers',
  'answareFilters',
  'answareDirectives',
  'answareServices'
]);

/**
 * URL Routes definitions
 */
answareApp.config(
  function($routeProvider) {
    $routeProvider.
      when('/quiz', {
        templateUrl: 'views/quiz-list.html',
        controller: 'quizListCtrl'
      }).
      when('/quiz/:quizName', {
        templateUrl: 'views/quiz-test.html',
        controller: 'quizTestCtrl'
      }).
      otherwise({
        redirectTo: '/quiz'
      });
  });
