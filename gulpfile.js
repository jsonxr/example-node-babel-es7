'use strict';

const gulp = require('gulp'),
      babel = require('gulp-babel'),
      // cached = require('gulp-cached'),
      changed = require('gulp-changed'),        // Only process files that have changed
      concat = require('gulp-concat'),
      debug = require('gulp-debug'),            // Print out filenames in a stream
      hash = require('gulp-hash'),
      // print = require('gulp-print'),
      sourcemaps = require('gulp-sourcemaps'),  // Output transformed sourcemaps

      inject = require('gulp-inject'),
      sass = require('gulp-sass'),
      // watch = require('gulp-watch'),
      browserSync = require('browser-sync'),
      del = require('del');


// .pipe(hash()) // Add hashes to the files' names
// .pipe(hash.manifest('assets.json')) // Switch to the manifest file

const PATHS = {
  LIBS: {
    CACHE: 'libs',
    INJECT: [
      '*.js',
      '!system.src.js' // This should not be included in the index.html
    ],
    SRC: [
      // These are copied over but not included in the 
      // Injection
      'node_modules/systemjs/dist/system.js',
      'node_modules/systemjs/dist/system.js.map',
      'node_modules/systemjs/dist/system.src.js'
    ],
    DEST: 'dist/client/libs'
  }
}

function jsTask(options = {}) {
  return () => {
    return gulp
      .src(options.src)
      // .src(options.src, { since: gulp.lastRun(options.name)})
      .pipe(changed(options.dest))
      // .pipe(cached(options.src))
      .pipe(debug({title: options.name}))
      .pipe(sourcemaps.init())
      .pipe(babel({ plugins: options.plugins }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(options.dest));
  }
}

function scssTask(options = {}) {
  return () => {
    return gulp
      .src(options.src)
      // .src(options.src, { since: gulp.lastRun(options.name)})
      .pipe(changed(options.dest))
      // .pipe(cached(options.src))
      .pipe(debug({title: options.name}))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(options.dest));
  }
}

function copyTask(options = {}) {
  return () => {
    return gulp
      .src(options.src)
      .pipe(changed(options.dest))
      // .pipe(cached(PATHS.COPY.CACHE))
      // .pipe(print())
      .pipe(debug({title: options.name}))
      .pipe(gulp.dest(options.dest));
  }
}

//----------------------------------------------------------------------------
// Browser:
//----------------------------------------------------------------------------
gulp.task('browser-js', jsTask({
  name: 'browser-js',
  src: 'src/browser/**/*.js',
  dest: 'dist/browser',
  plugins: [
    'transform-es2015-modules-systemjs',
    'transform-async-to-generator',
  ],
}));
gulp.task('browser-copy', copyTask({
  name: 'copy',
  src: [
      'src/browser/**/*',              // ALL files not explicitly excluded
      'node_modules/systemjs/dist/system.js.map',
      '!src/browser/**/*.js',          // All JS is transpiled
      '!src/**/browser/*.scss',        // All scss is compiled to css
//      '!src/browser/index.html' // this is treated special for library includes
  ],
  dest: 'dist/browser'
}))
gulp.task('browser-lib', () => {
  return gulp.src([
    'node_modules/systemjs/dist/system.js',
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('dist/browser'));
});
gulp.task('browser-watch', function () {
  return gulp.watch('src/browser/**/*.js', gulp.series('browser-js'));
});
gulp.task('browser', gulp.parallel(['browser-js', 'browser-copy', 'browser-lib']));

//----------------------------------------------------------------------------
// Server: JS = lint, compile, watch
//----------------------------------------------------------------------------
gulp.task('server-js', jsTask({
  name: 'server-js',
  src: 'src/server/**/*.js',
  dest: 'dist/server',
  plugins: [
    'transform-es2015-modules-commonjs',
    'transform-async-to-generator',
  ],
}));
gulp.task('server-watch', function () {
  return gulp.watch('src/server/**/*.js', gulp.series('server-js'));
});
gulp.task('server-scss', scssTask({
  name: 'server-scss',
  src: 'src/server/**/*.scss',
  dest: 'dist/server',
}));
gulp.task('server', gulp.parallel(['server-js', 'server-scss']));

//
// // Copy libraries used in the client app
// gulp.task('libs', function () {
//   return gulp
//     .src(PATHS.LIBS.SRC)
//     .pipe(cached(PATHS.LIBS.CACHE))
//     .pipe(print())
//     .pipe(gulp.dest(PATHS.LIBS.DEST));
// });
//
// // Create the index file with the injected libraries
// gulp.task('index', ['libs', 'js'], function () {
//   var libSrc = gulp.src(PATHS.LIBS.INJECT, {read: false, cwd: PATHS.LIBS.DEST});
//   return gulp
//     .src('src/client/index.html')
//     .pipe(print())
//     .pipe(inject(libSrc, {
//       relative: true,
//       ignorePath: '../../dist/client/',
//       addRootSlash: false
//     }))
//     .pipe(gulp.dest('dist/client'));
// });
//
//
// gulp.task('build', ['js', 'libs', 'copy', 'scss', 'index']);
//
// var serverSync = require('server-sync');
//
// // watch files for changes and reload
// gulp.task('serve', ['build'], function() {
//   serverSync({
//     script: 'dist/server'
//   });
//
//   browserSync({
//     proxy: "localhost:3000",
//     port: 8080
//   });
//
//   gulp.watch('**/*', {cwd: 'dist/client'}, browserSync.reload);
//   gulp.watch('**/*.js', { cwd: 'dist/server' }, serverSync.reload);
//   gulp.watch(PATHS.JS_CLIENT.SRC, ['js-client']);
//   gulp.watch(PATHS.JS_SERVER.SRC, ['js-server']);
//   gulp.watch(PATHS.COPY.SRC, ['copy']);
//   gulp.watch(PATHS.SCSS.SRC, ['scss']);
//   gulp.watch('src/client/index.html', ['index']);
// });


gulp.task('watch', gulp.parallel('server-watch', 'browser-watch'));

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('build', gulp.parallel(['server', 'browser']));

//gulp.task('default', ['serve']);
gulp.task('default', gulp.series('build', 'watch'));



//gulp.task('default', ['serve']);
