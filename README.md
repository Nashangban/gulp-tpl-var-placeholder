## gulp-tpl-var-placeholder

## Test

```
npm test
```

## Usage

```js
var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css'),
    tplVarPlaceholder = require('gulp-tpl-var-placeholder'),
    tempfilename = 'gulp-tpl-var-placeholder.tmp';

gulp.task('default', function() {
    return gulp.src('./*.html')
        .pipe(tplVarPlaceholder({
            takeOut: true,
            tempfilename: tempfilename
        }))
        .pipe(inlineCss())
        .pipe(tplVarPlaceholder({
            takeInto: true,
            tempfilename: tempfilename
        }))
        .pipe(gulp.dest('build/'));
});
```


## API

### tplVarPlaceholder(options)


#### options.takeOut

Type: `Boolean`

Default: `""`

`<% something %>` to `{{{ something }}}`.


#### options.takeInto

Type: `Boolean`

Default: `""`

`{{{ something }}}` to `<% something %>`.


#### options.tempfilename

Type: `String`

Default: `gulp-tpl-var-placeholder.tmp`

缓存数据存储在系统临时缓存目录，默认文件名称 `gulp-tpl-var-placeholder.tmp`

## License

MIT
