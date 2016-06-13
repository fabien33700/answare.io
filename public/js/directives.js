'use strict';

/* Directives */
angular.module('answareDirectives', [])

  .directive('header', function() {
      return {
        restrict: 'A',
        templateUrl: '../partials/header.html'
      };
  })

  .directive('footer', function() {
      return {
        restrict: 'A',
        templateUrl: '../partials/footer.html'
      };
  });
