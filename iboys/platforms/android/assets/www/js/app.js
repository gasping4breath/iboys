(function(){
   'use strict';

   var iboysApp = angular.module('iboysApp', ['ui.router', 'ngCordova', 'angular-gestures']);
   iboysApp

      .config(function($stateProvider, $urlRouterProvider, hammerDefaultOptsProvider){

         //$urlRouterProvider.otherwise('/user - nearby - list');
         $urlRouterProvider.otherwise(function($injector){
            var $state = $injector.get("$state");
            $state.go("app.user-nearby-list");
         });

         hammerDefaultOptsProvider.set({
            recognizers: [
               [Hammer.Pinch]
            ]
         });

         $stateProvider
            .state('app', {
               abstract: true,
               views: {
                  'header': {
                     templateUrl: 'view/header.html'
                  },
                  'content': {
                     templateUrl: 'view/content.html'
                  },
                  'footer': {
                     templateUrl: 'view/footer.html'
                  }
               },
               data: {
                  roles: []
               }
            })
            .state('app.user-nearby-list', {
               url: '/user-nearby-list',
               data: {
                  roles: ['User']
               },
               views: {
                  'content@': {
                     templateUrl: 'view/user-nearby-list.html',
                     controller: 'UserNearbyListController'
                  }
               }
            })
            .state('app.user-nearby-list.detail', {
               url: '/:id',
               data: {
                  roles: ['User']
               },
               views: {
                  'detail@app.user-nearby-list': {
                     templateUrl: 'view/user-nearby-list-detail.html',
                     controller: 'UserNearbyListDetailController'
                  }
               }
            })
            .state('app.authorization', {
               url: '/authorization',
               data: {
                  roles: []
               },
               views: {
                  //'header@': {},
                  'content@': {
                     templateUrl: 'view/authorization.html',
                     controller: 'AuthorizationController'
                  }
               }
            })
            .state('app.restricted', {
               url: 'restricted',
               data: {
                  roles: ['Admin']
               },
               views: {
                  'content@': {
                     templateUrl: 'view/restricted.html'
                  }
               }
            })
            .state('app.denied', {
               url: 'denied',
               data: {
                  roles: []
               },
               views: {
                  'content@': {
                     templateUrl: 'view/denied.html'
                  }
               }
            })
      }).run(['$rootScope', '$state', '$stateParams', 'AuthorizationService',
         function($rootScope, $state, $stateParams, AuthorizationService){
            $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams){
               var accessRoleList = toState.data.roles;
               if(accessRoleList && accessRoleList.length > 0 && !AuthorizationService.hasRoleFromList(accessRoleList)){
                  event.preventDefault();
                  if(AuthorizationService.isSignedIn()){
                     $state.go('app.denied');
                  }else{
                     $state.go('app.authorization');
                  }
               }

            });
         }
      ]);

}());


