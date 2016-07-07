

angular.module('myApp', ['ngRoute'])
.config(function($routeProvider,$httpProvider) {
        $routeProvider

            // route for the home page
                   .when('/', {
                              templateUrl : 'html/home.html',
                                controller  : 'homeCtlr'
                    }).when('/login',{
				templateUrl : 'html/login.html',
				controller : 'loginCtlr'
			});

		 $httpProvider.interceptors.push('authInterceptor');
                     })
.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
         }
  return response || $q.when(response);
     }
   };
 }).
        
 //                          myApp.config(function ($httpProvider) {
  //                           $httpProvider.interceptors.push('authInterceptor');
    //                      })
.controller("homeCtlr",function($scope){



})
.controller("loginCtlr",function($scope){


cope.submit = function () {
    $http
      .post('/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;
        
        //                 // Handle login errors here
                                 $scope.message = 'Error: Invalid user or password';
                                       });
                                         };
});
