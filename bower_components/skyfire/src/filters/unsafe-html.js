angular.module('emissary.skyfire')
.filter('unsafeHtml', ['$sce', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  };
}]);
