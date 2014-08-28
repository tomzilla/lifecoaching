angular.module('emissary.skyfire')
.directive('stickyFixed', ['$window', function($window){
  return function(scope, element, attrs) {
    var originalY = element.offset().top;
    angular.element($window).bind("scroll", function() {
      if (this.pageYOffset >= originalY - 30)  {
        element.css('position', 'fixed');
        element.css('top', '10px');
      } else {
        element.css('position', 'absolute');
        element.css('top', '');
      }
    }).addClass('sticky');
  };
}]);
