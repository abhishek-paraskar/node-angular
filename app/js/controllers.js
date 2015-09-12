var userControllers = angular.module('userControllers', []);

/**
	A controller for Navigation bar.
**/
userControllers.controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	//Prepare the left side menu list for navigation bar.
	$scope.leftMenuItems = [
		{path: '#/user-list', title: 'Users'},
		{path: '#/profiles', title: 'Profiles'},
		{path: '#/holdings', title: 'Holdings'}
	];

	//Check whether the user is logged in or not. Show and hide the navigation bar accordingly.
	$rootScope.isLoggedIn = false;
	if (typeof $localStorage.token != "undefined") { 
		$rootScope.isLoggedIn = true;
	}

	//A function for logout.
	$scope.logout = function(){
		//Delete  the token from the localStorage.
		Main.deleteToken();
		//Redirect the user to login page.
		$location.path("/login");
	}

}]);	


/**
	A controller for Profile list.
**/
userControllers.controller('ProfileCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	

	//Setting the rootscope variable for selected menu.
	$rootScope.selectedMenu = 'Profiles';

	//A function to get the list of profiles.
	var getProfileList = function(){

		//Get the list of profiles.
		Main.getProfileList(function(response) {
			$scope.profileList = response.data;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
	}

	//Render the profile list on load.
	getProfileList();

}]);

/**
	A controller for Holding List.
**/
userControllers.controller('HoldingCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	

	//Setting the rootscope variable for selected menu.
	$rootScope.selectedMenu = 'Holdings';

	//A function to get the list of holdings.
	var getHoldingList = function(){
		Main.getHoldingList(function(response) {
			$scope.holdingList = response.data;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
	}

	//Render the profile list on load.
	getHoldingList();

}]);

/**
	A controller for Add Holding.
**/
userControllers.controller('AddHoldingCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Holdings';
}]);

/**
	A controller for Edit Holding.
**/
userControllers.controller('EditHoldingCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	$rootScope.selectedMenu = 'Holdings';
}]);


/**
	A controller for User listing.
**/
userControllers.controller('UserListCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){	
	//Setting the rootscope variable for selected menu.
	$rootScope.selectedMenu = 'Users';

	//Check user is logged in or not.
	$rootScope.isLoggedIn = false;
	if (typeof $localStorage.token != "undefined") { 
		$rootScope.isLoggedIn = true;
	}

	//A function to get the list of users.
	var getUserList = function(){

		//Get the list of users from backend.
		Main.userList(function(response) {
			//Set the user list.
			$scope.userList = response;

			//Set the user's first name and last name in the header.
			$rootScope.userName = "Welcome " + Main.getUser().name + " " + Main.getUser().last_name;
			//Set the user id of the logged in user in the scope. It will be used for hiding the DELETE button in the user list.
			$scope.loggedInUserId = Main.getUser().id;
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
	}
	getUserList();

	//A function to redirect the user to ADD USER page.
    $scope.addUser = function(){
    	$location.path('/add-user');
    }

    //A function to delete the user.
    $scope.deleteUser = function(id){
		Main.deleteUser(id, function(response) {
			getUserList();
	    }, function() {
	        $rootScope.error = 'Failed to signin';
	    });
    }
}]);


/**
	A controller for Add user.
**/
userControllers.controller('AddUserCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	//Setting the rootscope variable for selected menu.
	$rootScope.selectedMenu = 'Users';
	$scope.addUser = "";

	//A function to add the user.
	$scope.addUserSubmit = function(isValid){
		if(isValid){
			Main.addUser($scope.addUser, function(response) {
				$location.path('/user-list');
	        }, function(response) {
	            $scope.error =  response.message;
	        })
		}
	}
	//Fetch the list of profiles to populate on the add user page.
	var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res.data;
        }, function(response) {
            $scope.error = response.message;
        })
    }

	//Fetch the list of holdings to populate on the add user page.
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


/**
	A controller for Edit Holding.
**/
userControllers.controller('EditUserCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $routeParams, $location, $localStorage, Main, $http){
	//Setting the rootscope variable for selected menu.
	$rootScope.selectedMenu = 'Users';

	// A function to update the edited user.
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

	//A method to get the user by id.
	var getUserDetails = function(){
		Main.getUserDetails($routeParams.userId, function(response) {
			$scope.editUser = response.data;
			$scope.editUser.profile_id = response.data.profile_id;
			$scope.editUser.holding_id = response.data.holding_id;

			//Check the logged in user is updating the profile. It will be used to populate the name in the header after successful update.
			if($routeParams.userId == Main.getUser().id){
				$scope.editUser.updateToken = true;
			}else{
				$scope.editUser.updateToken = false;
			}

        }, function(response) {
            $scope.error =  response.message;
        })
	}

	//Fetch the list of profiles to populate on edit user page.
	var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    	
    }
	//Fetch the list of holdings to populate on edit user page.
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

/**
	A controller for Sig up.
**/
userControllers.controller('SignUpCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
	//Fetch the list of holdings to populate on edit user page.
    var profiles = function(){
    	Main.profiles(function(res) {
	    	$scope.profiles = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    	
    }

    //Fetch the list of holdings to populate on edit user page.
    var holdings = function(){
    	Main.holdings(function(res) {
	    	$scope.holdings = res.data;
        }, function(response) {
            $scope.error =  response.message;
        })
    	
    }
    profiles();
   	holdings();

   	//Post the signup data to server.
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


/**
	A controller for Login.
**/
userControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$http', function($rootScope, $scope, $location, $localStorage, Main, $http){
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


/**
	A controller for Edit Holding.
**/
userControllers.controller('HomeCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
}]);
