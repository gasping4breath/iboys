angular.module('iboysApp').controller('UserNearbyListController',
   ['$scope'
      , '$state'
      , 'AuthorizationService'
      , 'UserService'
      , 'LocationService'
      , '$interval',
      function($scope, $state, AuthorizationService, UserService, LocationService, $interval){

         if(localStorage.getItem("userList")){
            console.log("GETTING FROM STORAGE");
            $scope.userList = JSON.parse(localStorage.getItem("userList"));
         }

         LocationService.getCurrentLocation().then(function(location){
            LocationService.sendLocation(location).then(function(){
                  UserService.getUserNearbyMap().then(function(userMap){
                     $scope.userList = userMap;
                     localStorage.setItem("userList", JSON.stringify(userMap));
                  }, function(reason){
                     alert('Failed: ' + reason);
                  })
               }
            )
         });

         $scope.pinch = function(event){
            console.log(event.scale);
            console.log(event.type);
            if(event.scale > 1){
               $scope.pinchOut = true;
            }
            if(event.scale < 1){
               $scope.pinchOut = false;
            }
            event.preventDefault();


         };


         //$interval(function(){
         //   var i = 0;
         //   angular.forEach($scope.userList, function(value, key){
         //      if(i === 0){
         //         console.log("deleting " + $scope.userList[key]);
         //         delete $scope.userList[key];
         //      }
         //      i++;
         //   });
         //}, 3000);

         $scope.signOut = function(){
            var promise = AuthorizationService.signOut();
            promise.then(function(){
               alert('Success logout ');
               $state.go('app.authorization');
            }, function(reason){
               alert('Failed: ' + reason);
               $state.go('app.authorization');
            });
         };
      }
   ])
;
