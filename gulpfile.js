// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var gulpCopy = require('gulp-copy');


// use ! to ignore files when inject
var paths = {
    base: './',
    baseTmpl: './template/index.html',
    baseIndex: './index.html',
    javascript: [
        'node_modules/leaflet/dist/leaflet.js',
        'src/cors_proxy.js',

        // layers
        'src/lib/vendor/shramov/Google.js',
        'src/lib/vendor/shramov/Bing.js',
        'src/leaflet_plugins/Yandex.js',
        'src/leaflet_plugins/leaflet.soviet-topomaps-grid.js',
        'src/leaflet_plugins/leaflet.wikimapia.js',
        'src/leaflet_plugins/google-street-view/leaflet.google-street-view.js',

        'src/layers.js',

        // mapper
        'src/leaflet_plugins/hash_state/hash_state.js',
        'src/leaflet_plugins/hash_state/leaflet.hash_state.js',
        'src/leaflet_plugins/hash_state/Leaflet.Map.js',
        'src/leaflet_plugins/hash_state/Leaflet.Control.Layers.js',
        'src/leaflet_plugins/Control.Layers.Hotkeys.js',

        'src/lib/vendor/promise/promise-4.0.0.js',
        'src/lib/vendor/FileSaver.js',
        'src/lib/file_utils.js',

        'src/leaflet_plugins/track_list_control/lib/geo_file_exporters.js',

        'src/lib/vendor/js-unzip.js',
        'src/lib/vendor/rawinflate.js',
        'src/leaflet_plugins/track_list_control/lib/geo_file_formats.js',

        'src/leaflet_plugins/context_menu/leaflet.contextmenu.js',

        'node_modules/knockout/build/output/knockout-latest.js',
        'src/lib/ko_component_progress/ko_component_progress.js',

        'src/leaflet_plugins/measured_line/measured_line.js',
        'src/leaflet_plugins/edit_line/edit_line.js',
        'src/leaflet_plugins/LineUtil.simplifyLatngs.js',

        'src/leaflet_plugins/track_list_control/track_list.js', // ko

        'src/leaflet_plugins/print_pages/papersheet_feature.js',
        'src/leaflet_plugins/print_pages/lib/map_to_image.js',
        'src/leaflet_plugins/print_pages/lib/pdf.js',
        'src/leaflet_plugins/print_pages/print_pages_control.js',

        'src/lib/draw_utils.js',
        'src/lib/vendor/mapbbcode/FunctionButton.js',

        'src/leaflet_plugins/tile_layer_grabber/Google.js',
        'src/leaflet_plugins/tile_layer_grabber/TileLayer.js',
        'src/leaflet_plugins/tile_layer_grabber/Bing.js',
        'src/leaflet_plugins/tile_layer_grabber/Yandex.js',
        'src/lib/binstream.js',
        'src/leaflet_plugins/jnx/jnx_control.js',

        'src/leaflet_plugins/custom_layers/custom_layers.js',
        'src/mapper.js'
    ],
    css: [
        'src/lib/vendor/leaflet-0.7.7/leaflet.css',
        'src/lib/ko_component_progress/ko_component_progress.css',
        'src/leaflet_plugins/**/*.css',
        'src/style.css'
    ]
};

// copy template to untracked file
gulp.task('copy', function(){
    return gulp.src(paths.baseTmpl)
        .pipe(gulpCopy(paths.base, { prefix: 1 }));
});

// find js/css to inject in index.html
gulp.task('index', ['copy'], function(){
    return gulp.src(paths.baseIndex)
        .pipe(inject(
            gulp.src(paths.javascript,
                {read: false}), {relative: true}))
        .pipe(gulp.dest(paths.base))
        .pipe(inject(
            gulp.src(paths.css,
            {read: false}), {relative: true}))
        .pipe(gulp.dest(paths.base));
});

// start server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: paths.base
    },
  })
});

// collect css TODO collect globally
gulp.task('css', function() {
  return gulp.src(paths.css) // Gets all files ending with .css in src
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', ['index', 'browserSync'], function() {
    gulp.watch(paths.js, ['lint', 'scripts']);
    gulp.watch(paths.css);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
