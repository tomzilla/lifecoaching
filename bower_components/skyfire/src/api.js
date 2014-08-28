angular.module('emissary.skyfire', ['ngCookies']);
angular.module('emissary.skyfire').factory('api', ['$rootScope', '$http', '$q', 'utilities', '$timeout', function($rootScope, $http, $q, utilities, $timeout) {
  var instance = {};
  var timer;
  instance.init = function(baseUrl) {
    instance.baseUrl = baseUrl;
  };
  instance.setUser = function(data) {
    instance.user = data;
    if(instance.user.token) {
      tokenDefer.resolve();
    }
  };
  var tokenDefer = $q.defer();
  instance.hasToken = function() {
    return tokenDefer.promise;
  };
  var calls = [];
  var defers = {};
  instance.flush = function() {
    timer = null;
    var data = {}, i;
    if (instance.user && instance.user.token) {
      data.token = instance.user.token;
    }
    var defersCopy = angular.extend({}, defers);
    defers = {};
    data.anon_id = instance.user.anon_id;
    if (calls.length) {
      data.calls = calls;
      calls = [];
      $http.post(instance.baseUrl + '/api', data).success(function(result) {
        //result is 
        //{
        //  id: [result]
        //}
        for (var k in result) {
          defersCopy[k].resolve(result[k]);
          delete defersCopy[k];
        }
      });
    }
  };
  instance.call = function(call, params, instant) {
    var instant = !(instant === false);
    var callObj = {
      call: call,
      params: angular.extend({}, params) || {},
      id: utilities.uuid() 
    };
    calls.push(callObj);

    //create a defer object for the callback
    var defer = $q.defer();
    defers[callObj.id] = defer;

    if (instant) {
      instance.flush();
    } else {
      if (!timer) {
        timer = $timeout(instance.flush, 3000);
      }
    }

    return defer.promise;
  };

  return instance;
}]);
