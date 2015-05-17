(function(){
   'use strict';

   angular
      .module('iboysApp')
      .service('LocationService', LocationService);

   LocationService.$inject = ['$q', '$http', 'AuthorizationService', '$cordovaGeolocation', 'UtilityService'];
   function LocationService($q, $http, AuthorizationService, $cordovaGeolocation, UtilityService){
      var currentLocation = undefined;
      var serverLocation = undefined;
      return {
         getCurrentLocation: function(){
            var deferred = $q.defer();
            var posOptions = {maximumAge: 60000, timeout: 4000, enableHighAccuracy: false};
            $cordovaGeolocation
               .getCurrentPosition(posOptions)
               .then(function(position){
                  console.log(JSON.stringify(position));
                  currentLocation = {};
                  currentLocation.latitude = position.coords.latitude;
                  currentLocation.longitude = position.coords.longitude;
                  currentLocation.accuracy = position.coords.accuracy;
                  currentLocation.timestamp = position.timestamp;
                  deferred.resolve(currentLocation);
               }, function(err){
                  alert('Cannot get position');
                  deferred.reject('Cannot get position');
               });

            return deferred.promise;
         },
         getServerLocation: function(){

         },
         sendLocation: function(location){
            //TODO here we can choose if current position is too far from last postion
            var deferred = $q.defer();
            var dataToSend = {action: 'set_geo', lat: location.latitude, lng: location.longitude, add: 'Praha', acc: location.accuracy};

            $http({
               method: 'POST',
               url: 'http://api.iboys.cz.gesys.cz/actions?sid=' + AuthorizationService.getIdentity().getSid(),
               data: UtilityService.serializeData(dataToSend),
               headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data){
               console.log(JSON.stringify(data));
               var result = data.Data;
               if(result && result["0"] == 1){
                  serverLocation = currentLocation;
                  deferred.resolve("Success");
               }else{
                  deferred.reject('Error during settign position');
               }
            })
               .error(function(data, status, headers, config){
                  console.log(JSON.stringify(data) + "  " + JSON.stringify(status) + "  " + JSON.stringify(headers) + "  ");
                  deferred.reject('Error during settign position');
               });

            return deferred.promise;
         }
      };
   }
}());
