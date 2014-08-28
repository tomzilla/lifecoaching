angular.module('emissary.skyfire').factory('dataService', ['$http', '$q', function($http, $q) {
  var instance = {};
  instance.getJSON = function(path) {
    return $http.get('data/' + path);
  };
  return instance;
}]);

