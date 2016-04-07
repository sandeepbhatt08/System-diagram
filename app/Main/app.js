'use strict';

// Declare app level module which depends on views, and components
angular.module('Main.myApp', [
  'ngRoute',
  'myApp.Module.FlowChart'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/flowchart'});
}]).run(['$rootScope',
      function($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
          if(current && current.$$route) {
            if (current.$$route.title) {
              $rootScope.pageTitle = current.$$route.title;
            } else {
              $rootScope.pageTitle = "Flow chart";
            }
          }
        });

      }]);
 

