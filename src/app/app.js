angular.module('lifecoaching', [
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'seo',
  'emissary.skyfire',
  'templates.app', 'templates.directives'
  ]);
//TODO: move those messages to a separate module
angular.module('lifecoaching').constant('I18N.MESSAGES', {
  'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});
angular.module('lifecoaching').config(['$locationProvider',  '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.rule(function($injector, $location) {
    var path = $location.path(),
    search = $location.search(),
    params;

    // check to see if the path already ends in '/'
    if (path[path.length - 1] === '/') {
      return;
    }

    // If there was no search string / query params, return with a `/`
    if (Object.keys(search).length === 0) {
      return path + '/';
    }
    // Otherwise build the search string and return a `/?` prefix
    params = [];
    angular.forEach(search, function(v, k){
      params.push(k + '=' + v);
    });
    return path + '/?' + params.join('&');
  });
}]);
angular.module('lifecoaching').run(['user', 'api', 'track', '$state', '$rootScope', function(user, api, track, $state, $rootScope) {
  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      if (toState.data && toState.data.footerDisabled) {
        $rootScope.footerDisabled = true;
      } else {
        $rootScope.footerDisabled = false;
      }
      if (toState.data && toState.data.menuDisabled) {
        $rootScope.menuDisabled = true;
      } else {
        $rootScope.menuDisabled = false;
      }
      if (!user.user.hasOwnProperty('id') && toState.data && toState.data.auth) {
        $rootScope.returnState = toState;
        $rootScope.returnStateParams = toParams;
        event.preventDefault(); 
        $state.go('login');
      }
    });
  //defined in grunt
  var config = window.emissaryConfig || {};
  if (config['env'] !== 'dev' && window.xdomain) {
    window.xdomain.slaves({
      "https://api.emissarymed.com": "/proxy.html",
      "http://alpha-api.emissarymed.com": "/proxy.html"
    });
  }
  window.dataLayer = [];
  window.onbeforeunload = function (event) {
    api.flush();
  };
}]);
angular.module('lifecoaching').controller('AppCtrl', ['$scope', '$location', 'track', '$rootScope', function($scope, $location, track, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.title = toState.title;
      track.pageView($location.path());
      track.track({
        domain: toState.name,
        kingdom: 'pageview'
      });
      track.kmq_push(['record', 'pageview', {'state': toState.name}]);
      $rootScope.htmlReady();
    });
}]);

