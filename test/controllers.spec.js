describe('User controller test', function() {
  var scope, ctrl, httpBackend;
  beforeEach(module('emissary.scorponok'));
  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));
  it('should be able to instanciate home controller', inject(function($controller) {
    var hc = $controller('homeController', {$scope: scope});
  }));

  it('should be able to instanciate landing controller', inject(function($controller) {
    var hc = $controller('landingController', {$scope: scope});
              

  }));
    it('should jump to the /home path when / is accessed', function() {
    });
});
