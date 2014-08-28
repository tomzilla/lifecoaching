angular.module('emissary.skyfire').factory('ui', ['$rootScope',function($rootScope) {
  var instance = {};
  instance.scrollto = function(selector, offset, cb) {
    offset = offset || 0;
    if ($(selector).length) {
      $("body").animate({
        scrollTop: $(selector).offset().top - 140 + offset
      }, 358, cb);
    }
  };
  return instance;
}])
.controller('VCarouselController', ['$scope', '$timeout', '$q', function ($scope, $timeout, $q) {
  var self = this,
    slides = self.slides = [],
    currentIndex = -1,
    currentTimeout, isPlaying;
  self.currentSlide = null;

  var destroyed = false;
  /* direction: "prev" or "next" */
  self.select = function(nextSlide, direction) {
    var nextIndex = slides.indexOf(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > currentIndex ? "next" : "prev";
    }
    if (nextSlide && nextSlide !== self.currentSlide) {
        goNext();
    }
    function goNext() {
      // Scope has been destroyed, stop here.
      if (destroyed) { return; }
      //If we have a slide to transition from and we have a transition type and we're allowed, go
      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
        
        self.currentSlide.slideOut(nextSlide.slideIn);
              
      }
      self.currentSlide = nextSlide;
      currentIndex = nextIndex;
      //every time you change slides, reset the timer
      restartTimer();
    }
  };
  $scope.$on('$destroy', function () {
    destroyed = true;
  });

  /* Allow outside people to call indexOf on slides array */
  self.indexOfSlide = function(slide) {
    return slides.indexOf(slide);
  };

  $scope.next = function() {
    var newIndex = (currentIndex + 1) % slides.length;


    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'next');
    }
  };

  $scope.prev = function() {
    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'prev');
    }
  };

  $scope.select = function(slide) {
    self.select(slide);
  };

  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };

  $scope.slides = function() {
    return slides;
  };

  $scope.$watch('interval', restartTimer);
  $scope.$on('$destroy', resetTimer);

  function restartTimer() {
    resetTimer();
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval>=0) {
      currentTimeout = $timeout(timerFn, interval);
    }
  }

  function resetTimer() {
    if (currentTimeout) {
      $timeout.cancel(currentTimeout);
      currentTimeout = null;
    }
  }

  function timerFn() {
    if (isPlaying) {
      $scope.next();
      restartTimer();
    } else {
      $scope.pause();
    }
  }

  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };
  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      resetTimer();
    }
  };

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      slide.active = true;
      self.select(slides[slides.length-1]);
      if (slides.length == 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.removeSlide = function(slide) {
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) {
      if (index >= slides.length) {
        self.select(slides[index-1]);
      } else {
        self.select(slides[index]);
      }
    } else if (currentIndex > index) {
      currentIndex--;
    }
  };

}])
.directive('vCarousel', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'VCarouselController',
    require: 'vCarousel',
    template: '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel v-carousel vertical">\n' +
    "    <ol class=\"carousel-indicators\" ng-show=\"slides().length > 1\">\n" +
    "        <li ng-repeat=\"slide in slides()\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
    "    </ol>\n" +
    "<div class=\"carousel-inner\" ng-transclude></div>\n" +
  '</div>',
    scope: {
      interval: '=',
      noTransition: '=',
      noPause: '='
    }
  };
}])
.directive('vSlide', ['$parse', function($parse) {
  return {
    require: '^vCarousel',
    restrict: 'EA',
    transclude: true,
    replace: true,
    template: '<div class="v-slide vertical" ng-class="{\'active\': active, \'next\': next}" ng-transclude><div class="clearfix"></div></div>' ,
    scope: {
    },
    link: function (scope, element, attrs, vCarouselCtrl) {
      //Set up optional 'active' = binding
      if (attrs.active) {
        var getActive = $parse(attrs.active);
        var setActive = getActive.assign;
        var lastValue = scope.active = getActive(scope.$parent);
        scope.$watch(function parentActiveWatch() {
          var parentActive = getActive(scope.$parent);

          if (parentActive !== scope.active) {
            // we are out of sync and need to copy
            if (parentActive !== lastValue) {
              // parent changed and it has precedence
              lastValue = scope.active = parentActive;
            } else {
              // if the parent can be assigned then do so
              setActive(scope.$parent, parentActive = lastValue = scope.active);
            }
          }
          return parentActive;
        });
      }

      vCarouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        vCarouselCtrl.removeSlide(scope);
      });
      scope.slideIn = function(cb) {
        scope.active = true;
        scope.$element.fadeIn(
            function(){
              scope.$apply(cb);
            });
      };
      scope.slideOut = function (cb) {
        scope.$element.fadeOut(function() {
          scope.$apply(function() {
            scope.active = false;
          });
          if (cb) {
            cb();
          }
        });
      };
      scope.$watch('active', function(active) {
        if (active) {
          vCarouselCtrl.select(scope);
        }
      });
    }
  };
}]);




