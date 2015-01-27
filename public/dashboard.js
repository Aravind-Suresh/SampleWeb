function login($rootScope, $scope, $http) {
	$rootScope.URL = 'http://localhost:3000';
    $scope.visibility = true;

    $rootScope.validate = function(string){
        return string.match(/^([a-zA-z0-9\-\_]+)$/i);
    }
    $rootScope.pageChange = function( page ){
        $rootScope.$broadcast("page-close");
        $rootScope.$broadcast("page-" + page );
    }
    $scope.$on('page-login',function() {
        $scope.visibility = true;
        $scope.username="";
        $scope.password="";
    });

    $scope.$on('page-close',function() {
        $scope.visibility = false;
    });

    $scope.create_user = function(firstname, lastname, username, password) {
        console.log(firstname);
        console.log(lastname);
        console.log(username);
        console.log(password);
        if(true) {
            if(!((firstname=="") ||firstname==undefined ||lastname==undefined||username==undefined||password==undefined || (lastname=="") || (username=="") || (password==""))) {
                $http.get( $rootScope.URL + '/auth/create?firstname=' + firstname + '&lastname=' + lastname + '&username=' + username + '&password=' + password).
                success(function(data, status, headers, config) {
                    console.log(data);
                    console.log(data.err);
                    if(data.result) {
                        alert("Registration successful. Login to continue");
                        $scope.rusername="";
                        $scope.firstname="";
                        $scope.lastname="";
                        $scope.rpassword="";
                    }
                    else if(data.err.code=="420") {
                        alert("All fields are mandatory");
                    }
                    else if(data.err.code=="210") {
                        alert("Choose a different username");
                    }
                }
                ).error(function(data, status, headers, config) {
                });
            }
            else {
                alert("All fields are mandatory");
            }
        }
        else {
            alert("Enter only alphanumeric characters..");
        }
        
    }
    $scope.check = function(username, password) {
        if(username==undefined) {
            username="";
        }
        if(password==undefined) {
            password="";
        }
        $http.get( $rootScope.URL + '/auth/login?username=' + username + '&password=' + password).
        success(function(data, status, headers, config) {
    	//close all pages
    	//open the required page
        console.log(data);
        if(!data.username) {
            alert("Username or password is incorrect");
        }
        else {
            console.log(data.username);
            $rootScope.username = data.username;
            $rootScope.access_token = data.access_token;
            $rootScope.firstname = data.firstname;
            localStorage.username=data.username;
            localStorage.access_token=data.access_token;
            localStorage.firstname=data.firstname;
            console.log("d:"+$rootScope.access_token);
            $http.get( $rootScope.URL + '/dashboard/get/uploads?access_token=' + $rootScope.access_token ).
            success(function(data, status, headers, config) {
                console.log(data);
                localStorage.files = JSON.stringify(data);
            }).error(function(data, status, headers, config) {
                console.log("error");
            });
            window.location.href=$rootScope.URL + '/dashboard?access_token=' + localStorage.access_token;

            console.log($rootScope.firstname);
            $rootScope.pageChange('filelist');
            //$rootScope.$broadcast('page-filelist');
            //$scope.visibility = false;
        }
    }).error(function(data, status, headers, config) {
    		//TODO: Throw error here
    	});
}

}
