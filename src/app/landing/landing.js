angular.module('emissary.scorponok').config(['$stateProvider', function($stateProvider) {
  $stateProvider.state("landing", {
    url: "/l/:somestuff/?v",
    title: "Life Coaching - Free Consultation",
    templateUrl: function($stateParams) {
      var landingVersions = ["1","2", "4"],
        v = $stateParams.v;
      if (landingVersions.indexOf(v) === -1) {
        v = 2;
      }

      return 'landing/landing' + v + '.tpl.html';
    },
    data: {
      menuDisabled: true
    },
    controller:'landingController'
  });
}]).controller('landingController', ['$scope', '$timeout', 'track', 'api', 'ui', '$modal', 'dataService', '$stateParams', '$rootScope', '$interval', function($scope, $timeout, track, api, ui, $modal, dataService, $stateParams, $rootScope, $interval) {
  
}]);

