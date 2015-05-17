(function(){
   'use strict';

   angular
      .module('iboysApp')
      .service('UserService', UserService);

   UserService.$inject = ['$q', '$http', 'AuthorizationService'];
   function UserService($q, $http, AuthorizationService){
      var userNearbyMap = undefined;

      return {
         getUserNearbyMap: function(){
            //TODO here we can choose cache or ws
            var deferred = $q.defer();
           // if(angular.isDefined(userNearbyMap)){
           //    deferred.resolve(userNearbyMap);
           // }else{
               $http({
                  method: 'GET',
                  url: 'http://api.iboys.cz.gesys.cz/list-nearby?sid=' + AuthorizationService.getIdentity().getSid(),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
               }).success(function(data){
                  console.log(JSON.stringify(data));
                  var result = data.Data;
                  if(result){
                     userNearbyMap = {}
                     for(var i = 0; i < result.length; i++){
                        userNearbyMap[result[i].id] = result[i];
                     }
                     deferred.resolve(userNearbyMap);
                  }else{
                     deferred.reject('Error during getting user nearby list');
                  }
               })
                  .error(function(data, status, headers, config){
                     console.log(JSON.stringify(data) + "  " + JSON.stringify(status) + "  " + JSON.stringify(headers) + "  ");
                     deferred.reject('Error during getting user nearby list');
                  });
           // }
            return deferred.promise;
         }
      };
   }
}());
