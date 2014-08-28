angular.module('emissary.skyfire').factory('user', ['$http', '$cookies', '$q', 'api', '$rootScope', 'utilities', function($http, $cookies, $q, api, $rootScope, utilities) {

  var instance = {};
  instance.user = {};
  var tokenDefer = $q.defer();
  instance.hasToken = function() {
    return tokenDefer.promise;
  }
  api.setUser(instance.user);
  if (!$cookies['anon_id']) {
    $cookies['anon_id'] = utilities.uuid();
  }
  instance.user.anon_id = $cookies['anon_id'];
  instance.login = function(email, password) {
    return api.call('account.get_token', {
      email: email,
      password: password
    }).then(function(data) {
      instance.setUser(data);
    });
  };
  instance.refreshToken = function(){
    var token = $cookies['token'];
    if (token) {
      api.call('account.refresh_token', {'token': token}).then(function(data) {
        if (data && data.token) {
          instance.setUser(data);
        }
        if (data && data.error) {
          delete $cookies['token'];
        }
      });
    }
  };
  instance.setUser = function(data) {
    if (data === null) {
      tokenDefer = $q.defer();
      instance.user = {}
    } else {
      $.extend(instance.user, data);
      tokenDefer.resolve(true);
    }
    api.setUser(instance.user);
    $cookies['token'] = instance.user['token'];
  };
  instance.refreshUserInfo = function() {
    if (instance.user.token) {
      api.call('account.get', {}).then(function(data) {
        if (!data.error) {
          instance.setUser(data);
        }
      });
    }
  };
  instance.getTrip = function(cached) {
    var defer = $q.defer();
    instance.hasToken().then(function() {
      api.call('trip.get_all', {userId: instance.user.id}).then(function(data) {
        defer.resolve(data);
      });
    });
    return defer.promise;
  };
  instance.eventsCache = [];
  instance.getEvents = function(cached) {
    var defer = $q.defer();
    if (cached) {
      //xxx
    }
    instance.hasToken().then(function() {
      api.call('trip.get_events').then(function(data) {
        var arr = [], k;
        for (k in $scope.events) {
          arr.push($scope.events[k]);
        }
        arr.sort(function(a, b) {
          //make time with tz
          return moment.tz(a.time, a.timezone) - moment.tz(b.time, b.timezone);
        });
        defer.resolve(arr);
      });
    });
    return defer.promise;
  };
  instance.getItinerary = function(tripId, cached) {
    var defer = $q.defer();
    if (cached) {
      //xxx
    }
    instance.hasToken().then(function() {
      api.call('trip.get_events', {tripId:tripId}).then(function(data) {
        defer.resolve(data);
      });
    });
    return defer.promise;

  }
  instance.getMyTreatment = function(cached) {
    var defer = $q.defer();
    if (cached) {
      //xxx
    }
    instance.hasToken().then(function() {
      api.call('treatment.get_my_treatment').then(function(data) {
        defer.resolve(data);
      });
    });
    return defer.promise;
  };
   

  instance.init = function() {

  };
  return instance;

  
}]);
