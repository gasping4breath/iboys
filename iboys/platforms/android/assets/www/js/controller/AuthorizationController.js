angular.module('iboysApp').controller('AuthorizationController', ['$scope', '$state', 'AuthorizationService', function($scope, $state, AuthorizationService){
   $scope.login = 'gasping_breath';
   $scope.password = 'fyfcnfcbz';

   $scope.signIn = function(){
      var login = $scope.login;
      var password = $scope.password;
      var identity = new Identity();
      identity.setLogin(login);
      identity.setPassword(password);

      var promise = AuthorizationService.signIn(identity);
      promise.then(function(identity){
         alert('Success: ' + identity.toString());
         $state.go('app.user-nearby-list');
      }, function(reason){
         alert('Failed: ' + reason);
      });

   };
}
])
