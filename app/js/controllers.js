var contactControllers = angular.module('contactControllers', []);

contactControllers.controller('ContactListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	
	var getContactList = function(){
		console.log("ContactListCtrl")
		Main.contactList(function(response) {
			console.log('I got the response - ' + response.data);
			$scope.contactList = response.data;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
		
	}
	
	getContactList();

	$scope.addContact = function(){
		console.log($scope.contact);
		$http.post('/contacts/add-contact', $scope.contact).success(function(response){
			console.log(response);
			getContactList();
			$scope.contact = "";
		});
	}

	$scope.removeContact = function(id){
		console.log("Removing Contact - " + id);
		$http.get('/contacts/delete-contact/' + id).success(function(response){
			console.log('I got the response');
			getContactList();
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
			getContactList();
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


contactControllers.controller('UserListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	console.log(bootbox);
	var getUserList = function(){
		console.log("UserListCtrl")
		Main.userList(function(response) {
			console.log(Main.getUser());
			$scope.userList = response;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })


	}
	
	getUserList();
	$scope.currentUser = 
	$scope.logout = function() {
        Main.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = 'Failed to logout';
        });
    };

    $scope.addUser = function(){
    	$location.path('/add-user');
    }

    $scope.deleteUser = function(id){
    	Main.deleteUser(id, function(response) {
				console.log('I got the response');
				getUserList();
	        }, function() {
	            $rootScope.error = 'Failed to signin';
	        });
    	
    	
		
    }
}]);

contactControllers.controller('AddUserCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	$scope.addUser = "";
	$scope.addUserSubmit = function(isValid){
		console.log($scope.addUser);
		if(isValid){
			console.log("Form is valid");
			Main.addUser($scope.addUser, function(response) {
				$location.path('/user-list');
	        }, function() {
	            $rootScope.error = 'Failed to signin';
	        })
		}
	}

	var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res;
	    	console.log(res[0].id);
	    	$scope.addUser.profile_id = res[0].id;
        }, function() {
            $rootScope.error = 'Failed to fetch profiles';
        })
    	
    }

    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res;
	    	$scope.addUser.holding_id = res[0].id;
        }, function() {
            $rootScope.error = 'Failed to fetch holdings';
        })
    	
    }
    profiles();
   	holdings();
}]);

contactControllers.controller('EditUserCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $routeParams, $location, $localStorage, Main, $http){
	$scope.editUserSubmit = function(isValid){
		console.log($scope.editUser);
		if(isValid){
			Main.updateUser($scope.editUser, function(response) {
				$location.path('/user-list');
	        }, function() {
	            $rootScope.error = 'Failed to signin';
	        })
		}

	}

	$scope.userId = $routeParams.userId;
	var getUserDetails = function(){
		Main.getUserDetails($routeParams.userId, function(response) {
			$scope.editUser = response.data;
			$scope.editUser.profile_id = response.data.profile_id;
			$scope.editUser.holding_id = response.data.holding_id;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
	}
	var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res;
        }, function() {
            $rootScope.error = 'Failed to fetch profiles';
        })
    	
    }

    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res;
        }, function() {
            $rootScope.error = 'Failed to fetch holdings';
        })
    	
    }
    profiles();
   	holdings();
	getUserDetails();
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
	//$scope.signUp = "";
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

    var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res;
	    	//$scope.signUp.profile = res[0].id;
        }, function() {
            $rootScope.error = 'Failed to fetch profiles';
        })
    	
    }

    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res;
	    	//$scope.signUp.holding = res[0].id;
        }, function() {
            $rootScope.error = 'Failed to fetch holdings';
        })
    	
    }
    profiles();
   	holdings();

    $scope.signUpSubmit = function(isValid){
		console.log("Form Submitted");	
		console.log($scope.signUp);
		
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
	            Main.setToken(response.token);
	            console.log($localStorage.token)
	            $location.path('/user-list');
	        }, function(response) {
	        	console.log(response);
	            $rootScope.error = response.message;
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





