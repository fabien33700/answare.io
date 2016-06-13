'use strict';

/* App Module */

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

answareApp.config(
  function($httpProvider) {
      //Enable cross domain calls
      //$httpProvider.defaults.useXDomain = true;
  });
