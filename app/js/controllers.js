var contactControllers = angular.module('contactControllers', []);

contactControllers.controller('ContactListCtrl', ['$scope', '$http', function($scope, $http){
	
	var refresh = function(){
		$http.get('/contacts/contactList').success(function(response){
			console.log('I got the response');
			$scope.contactList = response;
		});
		$scope.orderProp = 'name';
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

			$http.post('/home/sign-up', $scope.signUp).success(function(response){
				console.log('I got the response - ');
				console.log(response);
				//$scope.contact = response;
			});
			/*
			Main.save($scope.signUp, function(res) {
	            $localStorage.token = res.data.token;
	            $location.path('/contact-list');
	        }, function() {
	            $rootScope.error = 'Failed to signup';
	        })*/
		}
   	}


    $scope.me = function() {
        Main.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
    };

    $scope.logout = function() {
        Main.logout(function() {
            $location.path('/');
        }, function() {
            $rootScope.error = 'Failed to logout';
        });
    };
}]);

contactControllers.controller('LoginCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
  	console.log("LoginCtrl Controller - ");
  	$http.get('/home/test').success(function(response){
		console.log('I got the response - ');
		console.log(response);
	});
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





