/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const path = require('path');
const gulp = require('gulp');
const pkg = require('./package.json');
const $ = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');
const importOnce = require('node-sass-import-once');
const stylemod = require('gulp-style-modules');
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const combiner = require('stream-combiner2');
const bump = require('gulp-bump');
const argv = require('yargs').argv;
const sassdoc = require('sassdoc');
const fs = require('fs');
const { ensureLicense } = require('ensure-px-license');

const sassOptions = {
  importer: importOnce,
  importOnce: {
    index: true,
    bower: true
  }
}

gulp.task('clean', function() {
  return gulp.src(['.tmp', 'css'], { read: false })
    .pipe($.clean());
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

function buildCSS() {
  return combiner.obj([
    $.sass(sassOptions),
    $.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      flexbox: false
    }),
    gulpif(!argv.debug, $.cssmin())
  ]).on('error', handleError);
}

gulp.task('sass', function() {
  return gulp.src(['./sass/*.scss'])
    .pipe(buildCSS())
    .pipe(stylemod({
      moduleId(file) {
        return path.basename(file.path, path.extname(file.path)) + '-styles';
      }
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream({ match: 'css/*.html' }));
});

gulp.task('watch', function() {
  gulp.watch(['*.scss', 'sass/*.scss'], ['sass', 'sassdoc']);
});

gulp.task('serve', function() {
  browserSync.init({
    port: 8080,
    notify: false,
    reloadOnRestart: true,
    logPrefix: `${pkg.name}`,
    https: false,
    server: ['./', 'bower_components'],
  });

  gulp.watch(['css/*-styles.html', '*.html', '*.js', 'demo/*.html']).on('change', browserSync.reload);
  gulp.watch(['*.scss', 'sass/*.scss'], ['sass', 'sassdoc']);
});

gulp.task('bump:patch', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ type: 'minor' }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ type: 'major' }))
    .pipe(gulp.dest('./'));
});

gulp.task('license', function() {
  return gulp.src(['./**/*.{html,js,css,scss}', '!./node_modules/**/*', '!./bower_components?(-1.x)/**/*'])
    .pipe(ensureLicense())
    .pipe(gulp.dest('.'));
});

gulp.task('default', function(callback) {
  gulpSequence('clean', 'sass', 'sassdoc', 'license')(callback);
});

/**
 * Special task just for Sass design repos. Builds the Sassdoc documentation and
 * spits it out as `sassdoc.json`.
 */
gulp.task('sassdoc', function() {
  gulp.src(['./*.scss'])
    .pipe(sassdoc.parse())
    .on('data', function(data) {
      fs.writeFileSync('sassdoc.json', JSON.stringify(data,null,4));
    });
});
