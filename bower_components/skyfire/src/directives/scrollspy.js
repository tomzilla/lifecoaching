angular.module('emissary.skyfire')
.directive('scrollSpy', ['$timeout', function($timeout){
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      var offset = parseInt(attr.scrollOffset, 10)
      if(!offset) offset = 10;
      scope.$watch(attr.scrollSpy, function(value) {
        $timeout(function() { 
          elem.scrollspy('refresh', { "offset" : offset})
        }, 200);
      }, true);
    }
  };
}]).directive('preventDefault', function() {
  return function(scope, element, attrs) {
    jQuery(element).click(function(event) {
      event.preventDefault();
    });
  };
})
.directive("scrollTo", ["$window", function($window){
  return {
    restrict : "AC",
    compile : function(){
      function scrollInto(selector) {
        if(!selector) $window.scrollTo(0, 0);
        //check if an element can be found with id attribute
        var el = jQuery(selector);
        if(el.length) {
          $("body").animate({
            scrollTop: el.offset().top - 10
          }, 358);
        }
      }
      return function(scope, element, attr) {
        element.bind("click", function(event){
          scrollInto(attr.scrollTo);
        });
      };
    }
  };
}]);
