'use strict';

angular.module('contactApp')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "http://localhost:3000/";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {

            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                //user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            signUp: function(data, success, error) {
                $http.post(baseUrl + 'home/sign-up', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + 'home/authenticate', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/me/').success(success).error(error)
            },
            userList: function(success, error) {
                $http.get(baseUrl + 'users/user-list').success(success).error(error)
            },
            contactList: function(success, error) {
                $http.get(baseUrl + 'contacts/contactList').success(success).error(error)
            },
            profiles: function(success, error) {
                $http.get(baseUrl + 'home/profiles').success(success).error(error)
            },
            holdings: function(success, error) {
                $http.get(baseUrl + 'home/holdings').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
]);
