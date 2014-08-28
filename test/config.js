// base path, that will be used to resolve files and exclude

module.exports = function(config) {
  config.set({
    basePath: '..',
    files: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jpillora/xdomain/dist/0.6/xdomain.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-bootstrap/ui-bootstrap.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js',
    'dist/templates/**.js',             
    'bower_components/skyfire/src/**/*.js',
    'test/**/*.spec.js',
    {pattern: 'test/data/*.json', watched: true, served: true, included: false}
    ],
    frameworks:["jasmine"],
    reporters: 'progress',
    port: 8089,
    runnerPort: 9109,
    urlRoot:'/__test/',
    colors: true,
    logLevel: config.LOG_INFO,
    auto_watch: true,
    browsers: ['Chrome'],
    singleRun: true
  });
};
