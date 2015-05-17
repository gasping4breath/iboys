(function(){
   'use strict';

   angular
      .module('iboysApp')
      .service('AuthorizationService', AuthorizationService);

   AuthorizationService.$inject = ['$q', '$http', 'UtilityService'];
   function AuthorizationService($q, $http, UtilityService){
      var IDENTITY = 'IDENTITY_LOCAL';

      function getIdentity(){
         var identity = localStorage.getItem(IDENTITY);
         if(identity){
            var identityObject = new Identity();
            identityObject.build(angular.fromJson(identity));
            return identityObject;
         }else{
            return new Identity();
         }
      };

      function setIdentity(identity){
         localStorage.setItem(IDENTITY, angular.toJson(identity));
      };

      function deleteIdentity(){
         localStorage.removeItem(IDENTITY);
      };

      return {
         getIdentity : function(){
            return getIdentity();
         },
         isSignedIn: function(){
            var identity = getIdentity();
            if(identity.getSid()){
               return true;
            }else{
               return false;
            }
         },
         hasRole: function(role){
            return getIdentity().hasRole(role);
         },
         hasRoleFromList: function(roleList){
            for(var i = 0; i < roleList.length; i++){
               if(getIdentity().hasRole(roleList[i])){
                  return true;
               }
            }
            return false;
         },
         signIn: function(identity){
            var deferred = $q.defer();
            var dataToSend = {p_login: identity.getLogin(), p_heslo: identity.getPassword()};
            $http({
               method: 'POST',
               url: 'http://api.iboys.cz.gesys.cz/login?',
               data: UtilityService.serializeData(dataToSend),
               headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
               console.log(JSON.stringify(data));
               var sid = data.Data.sid;
               var id = data.Data.id;
               if(sid && id){
                  identity.setSid(sid);
                  identity.setId(id)
                  identity.addRole('USER');
                  setIdentity(identity);
                  deferred.resolve(identity);
               }else{
                  deleteIdentity();
                  deferred.reject('Error during sign in');
               }
            })
               .error(function(data, status, headers, config){
                  console.log(JSON.stringify(data) + "  " + JSON.stringify(status) + "  " + JSON.stringify(headers) + "  ");
                  deleteIdentity();
                  deferred.reject('Error during sign in');
               });
            return deferred.promise;
         },
         signOut: function(){
            var deferred = $q.defer();
            if(this.isSignedIn()){
               var dataToSend = {action: 'logout'};
               $http({
                  method: 'POST',
                  url: 'http://api.iboys.cz.gesys.cz/actions?sid=' + getIdentity().getSid(),
                  data: UtilityService.serializeData(dataToSend),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
               }).success(function(data){
                  console.log(JSON.stringify(data));
                  var result = data.Data;
                  if(result && result[0] == 1){
                     deleteIdentity();
                     deferred.resolve();
                  }else{

                     deferred.reject('Error during sign out');
                  }
               })
                  .error(function(data, status, headers, config){
                     console.log(JSON.stringify(data) + "  " + JSON.stringify(status) + "  " + JSON.stringify(headers) + "  ");

                     deferred.reject('Error during sign out');
                  });

            }else{
               deferred.resolve();

            }
            return deferred.promise;
         }
      };
   }
}());
