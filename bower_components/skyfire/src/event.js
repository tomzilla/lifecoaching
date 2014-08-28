angular.module('emissary.skyfire').factory('event', ['$http', '$q', 'api', '$rootScope', 'utilities', function($http, $q, api, $rootScope, utilities) {
  var instance = {};
  var eventDeferred = $q.defer();

  api.call('trip.get_event_types').then(function(data) {
    //sort
    eventDeferred.resolve(data);
  });
  instance.getEventTypes = function() {
    return eventDeferred.promise;
  };
  return instance;

}]);
