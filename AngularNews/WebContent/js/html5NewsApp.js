var app = angular.module("html5NewsApp", ['html5NewsFilters','ngRoute']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider){
	$routeProvider
		.when('/HTML5News',{
			templateUrl: '/HTML5News/home.html',
			controller: 'html5NewsCtrl'
		})
		
		.when('/HTML5News/category/:categoryId',{
			templateUrl: '/HTML5News/content.html',
			controller: 'html5NewsCtrl'
		})
		
		.otherwise({
			redirectTo: '/HTML5News'
		});
	
	$locationProvider.html5Mode(true);
}]);