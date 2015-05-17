angular.module('iboysApp').controller('UserNearbyListDetailController', ['$scope', '$stateParams', 'UserService',
   function($scope, $stateParams, UserService){
      UserService.getUserNearbyMap().then(function(userMap){
         $scope.user = userMap[$stateParams.id];
      }, function(reason){
         alert('Failed: ' + reason);
      })
   }
]);
