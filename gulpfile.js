const { src, dest, parallel, siries, watch } = require('gulp');
const myBrowserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

function start() {
    myBrowserSync.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: false,
    })
}

function scripts() {
    return src([
        'app/app.js',
        'app/fill.js',
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('./app/static/js'))
    .pipe(myBrowserSync.stream())
}

function startWatch(){
    watch('./app/*.js', scripts);

}

exports.start = parallel([scripts, start]);
exports.scripts = scripts;
exports.default = parallel([scripts, start, startWatch])
