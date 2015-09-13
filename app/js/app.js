'use strict';

/* App Module */
var userApp = angular.module('userApp', [
  'ngRoute',
  'ngStorage',
  'ngBootbox',
  'userControllers'
]);

userApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    
    $routeProvider.
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
       when('/profiles', {
        templateUrl: 'partials/profiles.html',
        controller: 'ProfileCtrl',
        secure: true
      }).
       when('/holdings', {
        templateUrl: 'partials/holdings.html',
        controller: 'HoldingCtrl',
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
      when('/activate/:activationCode', {
        templateUrl: 'partials/activate.html',
        controller: 'ActivateUserCtrl',
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

userApp.run(['$rootScope', '$location', '$localStorage', 'Main', 
  function ($rootScope, $location, $localStorage, Main) {
   
    $rootScope.$on('$routeChangeStart', function (event, next, current) {


      if (next && next.$$route && next.$$route.secure) { 
        //Validating the token and token validity at client side.
        if (typeof $localStorage.token == "undefined") { 
            $rootScope.$evalAsync(function () { 
                $location.path('/login'); 
            }); 
        } else{
          //Checking token validity
          //This approch will not work if the timezone of client and server is different.
          //As its validating the token expiration field which is created on server against the client datetime. 
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

