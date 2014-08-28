angular.module('emissary.skyfire').factory('settings', ['$http', '$cookies', '$q', 'api', '$rootScope', 'user', 'utilities', function($http, $cookies, $q, api, $rootScope, user, utilities) {
  var instance = {};
  instance.settings = {};
  var settingsDefer = $q.defer();
  instance.hasToken = function() {
    return settingsDefer.promise;
  }
  user.hasToken.then(function() {
    api.call('settings.get').then(function(data) {
      instance.settings = data;
      settingsDefer.resolve(data);
    });
  });
  instance.set = function(name, value) {
    user.hasToken.then(function() {
      api.call('settings.set', {settings: {name: value}}).then(function(data) {
        if (!data.error) {
          instance.settings = data;
        }
      });;
    });
  };
  instance.get = function(name) {
    return instance.settings[name];
  }
}]);
