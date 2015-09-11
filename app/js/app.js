'use strict';

/* App Module */
var contactApp = angular.module('contactApp', [
  'ngRoute',
  'ngStorage',
  'ngBootbox',
  'contactControllers'
]);

contactApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    
    $routeProvider.
      when('/contact-list', {
        templateUrl: 'partials/contact-list.html',
        controller: 'ContactListCtrl',
        secure: true
      }).
      when('/contact-details/:contactId', {
        templateUrl: 'partials/contact-details.html',
        controller: 'ContactDetailsCtrl',
        secure: true
      }).
      when('/user-list', {
        templateUrl: 'partials/user-list.html',
        controller: 'UserListCtrl',
        secure: true
      }).
      when('/edit-user/:userId', {
        templateUrl: 'partials/edit-user.html',
        controller: 'EditUserCtrl',
        secure: true
      }).
      when('/add-user', {
        templateUrl: 'partials/add-user.html',
        controller: 'AddUserCtrl',
        secure: true
      
      }).
       when('/profile-list', {
        templateUrl: 'partials/profile-list.html',
        controller: 'ProfileListCtrl',
        secure: true
      }).
      when('/edit-profile/:profileId', {
        templateUrl: 'partials/edit-profile.html',
        controller: 'EditProfileCtrl',
        secure: true
      }).
      when('/add-profile', {
        templateUrl: 'partials/add-profile.html',
        controller: 'AddProfileCtrl',
        secure: true
      
      }).
       when('/holding-list', {
        templateUrl: 'partials/holding-list.html',
        controller: 'HoldingListCtrl',
        secure: true
      }).
      when('/edit-holding/:userId', {
        templateUrl: 'partials/edit-holding.html',
        controller: 'EditHoldingCtrl',
        secure: true
      }).
      when('/add-holding', {
        templateUrl: 'partials/add-holding.html',
        controller: 'EditProfileCtrl',
        secure: true
      
      }).
       when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl',
        secure: false
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        secure: false
      }).
      when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignUpCtrl',
        secure: false
      }).
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl',
        secure: false
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
                          $location.path('/user-list');
                      }
                  }
                  return config;
              },
              'responseError': function(response) {
                  if(response.status === 401 || response.status === 403) {
                     delete $localStorage.token;
                     $location.path('/login');
                  }
                  return $q.reject(response);
              }
          };
      }]);


  }]);

contactApp.run(['$rootScope', '$location', '$localStorage', 'Main', 
  function ($rootScope, $location, $localStorage, Main) {
   
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next && next.$$route && next.$$route.secure) { 
        if (typeof $localStorage.token == "undefined") { 
            $rootScope.$evalAsync(function () { 
                $location.path('/login'); 
            }); 
        } else{
          var exp = Main.getUser().exp;
          if (typeof exp !== 'undefined') {
            if (typeof exp !== 'number') {
              delete $localStorage.token;
              $location.path('/login'); 
            }
            if (Math.floor(Date.now() / 1000) >= exp){
              delete $localStorage.token;
              $location.path('/login');  
            }
          }
        }
      } 
    });

}]);

