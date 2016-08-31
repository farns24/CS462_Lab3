

angular.module('myApp', ['ngRoute'])
.config(function($routeProvider,$httpProvider) {
        $routeProvider

            // route for the home page
                   .when('/home', {
                              templateUrl : 'html/home.html',
                                controller  : 'homeCtlr'
                    }).when('/login',{
				templateUrl : 'html/login.html',
				controller : 'loginCtlr'
			})
			.when('/newuser',{
                                templateUrl : 'html/newuser.html',
                                controller : 'newuserCtlr'
                        })
			.when('/content/:user',{
                                templateUrl : 'html/content.html',
                                controller : 'contentCtlr'
			}).when('/userlist',{
                                templateUrl : 'html/userList.html',
                                controller : 'userListCtlr'
                        }).otherwise({redirectTo:'/home'});


 })
.controller("homeCtlr",function($scope,$http){
  
    $scope.loggedOn = false;
  
    $http({url: '/api/currentUser?', method: 'GET'})
   .success(function (data, status, headers, config) {
  
		$scope.me = (data.name);
		if (typeof $scope.me != "undefined")
		{
			$scope.loggedOn = true;
			$scope.currentUser = "Currently Logged on :"+$scope.me;
		}
		else
		{
			$scope.loggedOn = false;
			$scope.currentUser = "No User logged on";
		}

		//find out if logged onto foursquare
		//
		if (typeof data.cookies.fs_at!= 'undefined')
		{
			$scope.fsloggedOn = true;
		}
		else
		{
			$scope.fsloggedOn = false;
		}

	});
  

})
.controller("contentCtlr", function($scope,$http,$routeParams, $window){

	$scope.user = $routeParams.user;
	 $http({url: "/api/user", method:"GET"}).success(function(data,staus,headers,config){
       		var user = _.find(data,function(person){
			return (person.name ==$scope.user);
		});
	$scope.checkins = JSON.parse(user.checkins);
	});

})
.controller("userListCtlr",function($scope,$http, $window){

     $http({url: "/api/user", method:"GET"}).success(function(data,staus,headers,config){
	$scope.users = data;

	});



})
.controller("newuserCtlr",function($scope,$http, $window){
	       $scope.submit = function () {
            $http
              .post('/api/user',$scope.user)
              .success(function (data, status, headers, config) {
                $scope.message = 'Welcome';
		 $window.location.href = "/";
              })
            .error(function (data, status, headers, config) {
               
              });                                                                                                                                                    };
               
})
.controller("loginCtlr",function($scope, $http, $window){


	$scope.submit = function () {
	    $http
	      .post('/authenticate',$scope.user)
	      .success(function (data, status, headers, config) {
	        $scope.message = 'Welcome';
		$window.location.href = "/";
	      })
  	    .error(function (data, status, headers, config) {
        
                                       });
                         };
	});
