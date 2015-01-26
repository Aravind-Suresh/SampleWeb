function filelist($rootScope, $scope, $http) {

    $rootScope.firstname = localStorage.firstname;
    $rootScope.access_token = localStorage.access_token;
    console.log($scope.firstname);
    $scope.vis=true;
    console.log('in page-filelist on');
    $rootScope.URL = '';

    $http.get( $rootScope.URL + '/dashboard/get/uploads?access_token=' + $rootScope.access_token ).
    success(function(data, status, headers, config) {
        console.log(data);
        $scope.files = data;
    }).error(function(data, status, headers, config) {
        console.log("error");
    });

    $scope.loadfiles = function() {
        $http.get( $rootScope.URL + '/dashboard/get/uploads?access_token=' + $rootScope.access_token ).
        success(function(data, status, headers, config) {
            console.log(data);
            $scope.files = data;
        }).error(function(data, status, headers, config) {
            console.log("error");
        });
    }

    $scope.createAlert = function() {
        if($('#upload_id').val()=='') {
            alert("Choose a file to upload.");
        }
        else {
           // document.forms["uploadForm"].submit();
        
         $(document).ready(function() {
            $("form")[0].submit(function() {
          alert('Your file has been uploaded successfully..');  
        }); 
        }); 
         alert('Your file has been uploaded successfully..');
        }     
    }
    $scope.$on('page-close', function() {
        $scope.vis= false;
    });
    $scope.logout = function() {
        $http.get( $rootScope.URL + '/auth/logout' ).
        success(function(data, status, headers, config) {
            //$rootScope.pageChange('login');
            window.history.back();
        }).error(function(data, status, headers, config) {

        });
    }
    $scope.openFile = function(file) {
        $http.get( $rootScope.URL+'/uploads/get?file=' + file.fileName + '&access_token=' + $rootScope.access_token).
        success(function(data, status, headers, config) {
            console.log(data);
            if(!data.result) {
                if(data.err.code=="909") {
                    alert("Permission denied. You are not authenticated to view the file.");
                }
            }
            else {
                console.log(data);
                //window.open('file://' + data.path, '_blank');
                /*window.location.protocol='';
                window.location.replace(data.path);*/
                //window.navigate(data.path);
                //window.location.assign(data.path);
            }
        }).error(function(data, status, headers, config) {

        });
    }
}