'use strict';

/* App Module */
var contactApp = angular.module('contactApp', [
  'ngRoute',
  'ngStorage',
  'contactControllers'
]);

contactApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    
    $routeProvider.
      when('/contact-list', {
        templateUrl: 'partials/contact-list.html',
        controller: 'ContactListCtrl'
      }).
      when('/contact-details/:contactId', {
        templateUrl: 'partials/contact-details.html',
        controller: 'ContactDetailsCtrl'
      }).
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignUpCtrl'
      }).
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
          return {
              'request': function (config) {
                  config.headers = config.headers || {};
                  if ($localStorage.token) {
                      config.headers.Authorization = 'Bearer ' + $localStorage.token;
                      var restrictedPage = $.inArray($location.path(), ['/login', '/signup', '/home', '/']) === -1;
                      if(!restrictedPage) {
                          $location.path('/contact-list');
                      }
                  }
                  return config;
              },
              'responseError': function(response) {
                  if(response.status === 401 || response.status === 403) {
                      $location.path('/login');
                  }
                  return $q.reject(response);
              }
          };
      }]);

  }]);

