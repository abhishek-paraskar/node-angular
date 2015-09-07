var contactControllers = angular.module('contactControllers', []);

contactControllers.controller('ContactListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	
	var refresh = function(){
		Main.contactList(function(response) {
			console.log('I got the response');
            $localStorage.token = response.token;
			$scope.contactList = response.data;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
		
	}
	
	refresh();

	$scope.addContact = function(){
		console.log($scope.contact);
		$http.post('/contacts/add-contact', $scope.contact).success(function(response){
			console.log(response);
			refresh();
			$scope.contact = "";
		});
	}

	$scope.removeContact = function(id){
		console.log("Removing Contact - " + id);
		$http.get('/contacts/delete-contact/' + id).success(function(response){
			console.log('I got the response');
			refresh();
		});
		
	}

	$scope.editContact = function(id){
		console.log("Edit Contact - " + id)
		$http.get('/contacts/edit-contact/' + id).success(function(response){
			console.log('I got the response - ' + response.toString());
			console.log(response);
			$scope.contact = response;
		});
	}

	$scope.updateContact = function(){
		console.log($scope.contact);
		$http.post('/contacts/update-contact', $scope.contact).success(function(response){
			console.log('I got the response');
			console.log(response);
			refresh();
			$scope.contact = "";
		});
	}

	$scope.logout = function() {
        Main.logout(function() {
        	console.log("Logout Success.. redirecting user..");
            $location.path('/login');
        }, function() {
            $rootScope.error = 'Failed to logout';
        });
    };
}]);

contactControllers.controller('ContactDetailsCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
  //console.log("Contact Details Controller - " + $routeParams.contactId);
	$scope.contactId = $routeParams.contactId;
  	$http.get('/contacts/contact-details/' + $routeParams.contactId).success(function(response){
		console.log('I got the response - ');
		console.log(response);
		$scope.contact = response;
	});

}]);

contactControllers.controller('SignUpCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
  	$scope.signin = function() {
        var formData = {
            email: $scope.email,
            password: $scope.password
        }

        Main.signin(formData, function(res) {
            $localStorage.token = res.data.token;
            $location.path('/me');
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
    };

    $scope.signUpSubmit = function(isValid){
		console.log("Form Submitted");	
		if(isValid){
			Main.signUp($scope.signUp, function(res) {
	            $location.path('/login');
	        }, function() {
	            $rootScope.error = 'Failed to signup';
	        })
		}
   	}
}]);

contactControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
  	$scope.submitSignInForm = function(isValid){
		console.log("Form Submitted");	
		if(isValid){
			console.log($scope.signIn);	
			Main.signin($scope.signIn, function(response) {
	            $localStorage.token = response.token;
	            console.log($localStorage.token)
	            $location.path('/contact-list');
	        }, function() {
	            $rootScope.error = 'Failed to signin';
	        })
		}
   	}
}]);


contactControllers.controller('HomeCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
  	console.log("SignUpCtrl Controller - ");
	$scope.submitSignUpForm = function(isValid){
		console.log("Form Submitted");	
		if(isValid){
			console.log($scope.signUp);	
			
			
			$http.post('/signUp', $scope.signUp).success(function(response){
				console.log(response);
				$scope.signUp = "";
			});
			//alert("We can submit the form");
		}
   	}
}]);





