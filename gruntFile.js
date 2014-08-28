module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  // Default task.
  grunt.registerTask('default', ['jshint','build','karma:unit']);
  grunt.registerTask('build', ['clean', 'html2js', 'concat','less:build', 'jsonlint', 'symlink']);
  grunt.registerTask('release', ['clean', 'html2js','uglify','jshint','karma:unit','concat:index', 'less:min', 'jsonlint', 'copy']);
  grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var env = grunt.option('env') || 'development';
  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Chrome'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    config: grunt.file.readJSON(env + '.json'),
    version: grunt.option('git-version'),
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      data: ['src/data/**/*.json'],
      js: ['src/**/*.js'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        directives: ['src/directives/**/*.tpl.html']
      },
      less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/less/**/*.less']
    },
    karma: {
      unit: { options: karmaConfig('test/config.js') },
      watch: { options: karmaConfig('test/config.js', { singleRun:false, autoWatch: true}) }
    },
    clean: ['<%= distdir %>/*'],
    jsonlint: {
      data: {
        src: ['<%= src.data %>']
      }
    },
    copy: {
      assets: {
        files: [
          { dest: '<%= distdir %>/', src : '**/*.tpl.html', expand: true, cwd: 'src/app'},
          { dest: '<%= distdir %>/directives/', src : '**/*.tpl.html', expand: true, cwd: 'src/directives'},
          { dest: '<%= distdir %>/assets', src : '**', expand: true, cwd: 'src/assets/' },
          { dest: '<%= distdir %>', src : '**', expand: true, cwd: 'bower_components/bootstrap/dist' },
          { dest: '<%= distdir %>', src : '*.map', expand: true, cwd: 'bower_components/angular' }
        ]
      },
      data: {
        files: [
          { dest: '<%= distdir %>/data', src : '**', expand: true, cwd: 'src/data/' }
        ]
      }
    },
    symlink: {
      assets: {
        files: [
          { dest: '<%= distdir %>', src : '**/*.tpl.html', expand: true, cwd: 'src/app'},
          { dest: '<%= distdir %>/directives', src : '**/*.tpl.html', expand: true, cwd: 'src/directives'},
          { dest: '<%= distdir %>/assets', src : 'src/assets' },
          { dest: '<%= distdir %>', src : '*', expand: true, cwd: 'bower_components/bootstrap/dist' },
          { dest: '<%= distdir %>', src : '*.map', expand: true, cwd: 'bower_components/angular' }
        ]
      },
      data: {
        files: [
          { dest: '<%= distdir %>/data', src : 'src/data'}
        ]
      }
    },
    html2js: {
      directives: {
        options: {
          base: 'src'
        },
        src: [],
        dest: '<%= distdir %>/templates/directives.js',
        module: 'templates.directives'
      },
      app: {
        options: {
          base: 'src/app'
        },
        //include files you want to load fast. e.g. things above the fold.
        src: [
          'src/app/landing/landing2.tpl.html',
          'src/app/landing/v2/summary.tpl.html'
        ],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>" + 
          'window.emissaryConfig = <%= JSON.stringify(config) %>;\n'
        },
        src:[
          'bower_components/jquery/dist/jquery.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'bower_components/bootstrap/js/scrollspy.js',
          'bower_components/angular-ui-router/release/angular-ui-router.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/moment/min/moment.min.js',
          'bower_components/moment-timezone/min/moment-timezone.min.js',
          'bower_components/skyfire/src/**/*.js',
          '<%= src.js %>',
          '<%= src.jsTpl %>'
        ],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>" + 
          'window.emissaryConfig = <%= JSON.stringify(config) %>;\n'
        },
        src:['<%= concat.dist.src %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      }
    },
    less: {
      build: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      all: {
        files:['<%= src.js %>', '<%= src.data %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.directives %>', '<%= src.tpl.app %>','<%= src.html %>'],
        tasks:['default','timestamp']
      },
      build: {
        files:['<%= src.js %>', '<%= src.data %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.directives %>', '<%= src.tpl.app %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
