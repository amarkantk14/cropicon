angular.element(document).ready(function() {  
  /*$.get('/api/UserPermission', function(data) {
    permissionList = data;
    angular.bootstrap(document, ['cropicon']);
  });*/

   // angular.bootstrap(document, ['cropicon']);
});



(function(window, angular){
    'use strict';

    angular.module('cropicon', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'iUsers',
        'AuthService',
        'iPublicAccess',
        'iDirective',
    ])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', '$sceDelegateProvider',function ($routeProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {

        $locationProvider.html5Mode({enabled: true,requireBase: false});
        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('timestampMarker');
        $httpProvider.interceptors.push('securityInterceptor');



        // Allow same origin resource loads.
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*.youtube.com/**'
        ]);

        $routeProvider
            .when('/', {
                title: 'Home',
                templateUrl: 'partials/home',
                controller: 'HomeController',
                access: {
                    isFree: true
                }
            })
            .when('/about-us', {
                title: 'About us',
                templateUrl: 'partials/aboutus',
                controller: 'AboutUsController',
                access: {
                    isFree: true
                },
                resolve: {
                    /*books: function(srvLibrary) {
                        return srvLibrary.getBooks();
                    },
                    movies: function(srvLibrary) {
                        return srvLibrary.getMovies();
                    }*/
            
                },
            })
            .when('/how-it-works', {
                title: 'How It Works',
                templateUrl: 'partials/howitworks',
                controller: 'HowItWorksController',
                access: {
                    isFree: true
                }
            })
            .when('/login', {
                templateUrl: 'users/login',
                controller: 'LoginController',
                access: {
                    isFree: true
                }
            })
            .when('/logout', {
                controller: 'LogoutController',
                access: {
                    isFree: false
                }
            })
            .when('/sign-up', {
                templateUrl: 'users/signup',
                controller: 'SignUpController',
                access: {
                    isFree: true
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .run(['$rootScope','$location','Auth' ,function($rootScope, $location, Auth) {

        $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){

            // Show a loading message until promises are not resolved
            $rootScope.loadingView = true;

            $rootScope.title = '';
            if( currRoute.$$route && currRoute.$$route.title !== undefined){
                $rootScope.title = currRoute.$$route.title ;
            }

            // enumerate routes that don't need authentication
            var routesThatDontRequireAuth = ['/login','/sign-up'];

            var routesThatForAdmins = ['/admin'];

            var isFreeAccess = currRoute.$$route.access.isFree;
            var isLoggedIn = Auth.isLogin();

            // user is logged in && trying to access login or sign-up route , redirect to home page.
            if(isFreeAccess && (routesThatDontRequireAuth.indexOf($location.path()) !== -1 && isLoggedIn)){
                event.preventDefault();
                $location.path('/')   
            }else if(!isFreeAccess){
                var isLogoutRoute = currRoute.$$route.originalPath.indexOf('/logout') !== -1;
                if(isLogoutRoute && isLoggedIn){
                    Auth.logout();           
                    $location.path('/');    
                }else if(isLogoutRoute && !isLoggedIn){ 
                    $location.path('/login');
                } 
            }
        });


        $rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute) { 
            // Hide loading message
             $rootScope.loadingView = false;
        });
    }])

    .constant('API_PATH', 'http://localhost:3000/api/v1/');

    /* app.constant('API_PATH','https://cropicondev.herokuapp.com/api/v1/') */

})(window, window.angular);