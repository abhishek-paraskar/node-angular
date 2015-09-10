var contactControllers = angular.module('contactControllers', []);

contactControllers.controller('ContactListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	$rootScope.selectedMenu = 'Contacts';
	var getContactList = function(){
		Main.contactList(function(response) {
			$scope.contactList = response.data;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
		
	}
	
	getContactList();

	$scope.addContact = function(){
		$http.post('/contacts/add-contact', $scope.contact).success(function(response){
			getContactList();
			$scope.contact = "";
		});
	}

	$scope.removeContact = function(id){
		
		$http.get('/contacts/delete-contact/' + id).success(function(response){
			getContactList();
		});
		
	}

	$scope.editContact = function(id){
		$http.get('/contacts/edit-contact/' + id).success(function(response){
			$scope.contact = response;
		});
	}

	$scope.updateContact = function(){
		$http.post('/contacts/update-contact', $scope.contact).success(function(response){
			getContactList();
			$scope.contact = "";
		});
	}
}]);
contactControllers.controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$scope.leftMenuItems = [
		{path: '#/user-list', title: 'Users'},
		{path: '#/profile-list', title: 'Profiles'},
		{path: '#/holding-list', title: 'Holdings'},
		{path: '#/contact-list', title: 'Contacts'}
	];

	$rootScope.isLoggedIn = false;
	if (typeof $localStorage.token != "undefined") { 
		$rootScope.isLoggedIn = true;
	}
	$scope.logout = function(){
		Main.deleteToken();
		$location.path("/login");
	}

}]);	

contactControllers.controller('ProfileListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Profiles';
}]);

contactControllers.controller('AddProfileCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Profiles';
}]);

contactControllers.controller('EditProfileCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Profiles';
}]);

contactControllers.controller('HoldingListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Holdings';
}]);

contactControllers.controller('AddHoldingCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Holdings';
}]);

contactControllers.controller('EditHoldingCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Holdings';
}]);

contactControllers.controller('UserListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Users';
	$rootScope.isLoggedIn = false;
	if (typeof $localStorage.token != "undefined") { 
		$rootScope.isLoggedIn = true;
	}
	var getUserList = function(){
		Main.userList(function(response) {
			$scope.userList = response;
			$rootScope.userName = "Welcome " + Main.getUser().name + " " + Main.getUser().last_name;
			$scope.loggedInUserId = Main.getUser().id;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
	}
	getUserList();
	

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
			getUserList();
	    }, function() {
	        $rootScope.error = 'Failed to signin';
	    });
    }
}]);

contactControllers.controller('AddUserCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	$rootScope.selectedMenu = 'Users';
	$scope.addUser = "";
	$scope.addUserSubmit = function(isValid){
		if(isValid){
			Main.addUser($scope.addUser, function(response) {
				$location.path('/user-list');
	        }, function(response) {
	            $scope.error =  response.message;
	        })
		}
	}

	var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res.data;
        }, function(response) {
            $scope.error = response.message;
        })
    }

    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    }

    $scope.cancelAddUser = function(){
    	$location.path('/user-list');
    }
    profiles();
   	holdings();
}]);

contactControllers.controller('EditUserCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $routeParams, $location, $localStorage, Main, $http){
	$rootScope.selectedMenu = 'Users';
	$scope.editUserSubmit = function(isValid){
		if(isValid){
			Main.updateUser($scope.editUser, function(response) {
				if($scope.editUser.updateToken){
					Main.setToken(response.token);
	            	$rootScope.userName = "Welcome " + Main.getUser().name + " " + Main.getUser().last_name;
	        	}
				$location.path('/user-list');
	        }, function(response) {
	            $scope.error =  response.message;
	        })
		}
		
	}

	$scope.userId = $routeParams.userId;
	var getUserDetails = function(){
		Main.getUserDetails($routeParams.userId, function(response) {
			$scope.editUser = response.data;
			$scope.editUser.profile_id = response.data.profile_id;
			$scope.editUser.holding_id = response.data.holding_id;
			if($routeParams.userId == Main.getUser().id){
				$scope.editUser.updateToken = true;
			}else{
				$scope.editUser.updateToken = false;
			}
        }, function(response) {
            $scope.error =  response.message;
        })
	}
	var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    	
    }

    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    }

     $scope.cancelEditUser = function(){
    	$location.path('/user-list');
    }
    
    profiles();
   	holdings();
	getUserDetails();
}]);


contactControllers.controller('ContactDetailsCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $routeParams, $location, $localStorage, Main, $http){
	$rootScope.selectedMenu = 'Contacts';
	$scope.contactId = $routeParams.contactId;
}]);

contactControllers.controller('SignUpCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){

    var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    	
    }

    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    	
    }
    profiles();
   	holdings();

    $scope.signUpSubmit = function(isValid){
		if(isValid){
			Main.signUp($scope.signUp, function(res) {
	            $location.path('/login');
	        }, function(response) {
	            $scope.error =  response.message;
	        })
		}
		
   	}
}]);

contactControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	$rootScope.isLoggedIn = false;
	if (typeof $localStorage.token != "undefined") { 
		$rootScope.isLoggedIn = true;
	}
  	$scope.submitSignInForm = function(isValid){
		if(isValid){
			Main.signin($scope.signIn, function(response) {
	            Main.setToken(response.token);
	            $location.path('/user-list');
	        }, function(response) {
	            $scope.error =  response.message;
	        })
		}
   	}
}]);


contactControllers.controller('HomeCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
}]);





