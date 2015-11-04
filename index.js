'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var through2 = require('through2');

module.exports = function (options) {
    return through2.obj(function (file, enc, cb) {

        options = options || {};

        var self = this;
        var filePath = path.join(os.tmpdir(), options.tempfilename);
        var newhtml = '';

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var html = file.contents.toString();

        editfile(html,options);

        function editfile(html,options){

            var temphtml = file.contents.toString();
            var len = html.length;
            var result = '';
            var tempresult = '';
            var i = 0;
            var save = false;

          if(options.takeOut){

            while (i < len)
            {
              if(!save && html.charAt(i) == '<' && html.charAt(i+1) == '%'){
                save = true;
                i=i+2;
                continue;
              }
              if(save && html.charAt(i) == '%'&&html.charAt(i+1)=='>'){
                save = false;
                var random = getRandomString();

                tempresult += '"' + random + '":' + ' "'+result + '",';
                temphtml = temphtml.replace('<%'+result+'%>','{{{'+random+'}}}');
                result = '';
                i=i+2;
                continue;
              }
              if(save){
                result += html.charAt(i);
              }
              i++;
            }
            tempresult = tempresult.substring(0,tempresult.length-1);
            fs.writeFileSync(filePath, '{ '+tempresult+' }');
          }
          if(options.takeInto) {

            var data = fs.readFileSync(filePath, 'utf-8');
            if(data){

              data = eval("(" + data + ")");

              while (i < len)
              {
                if(!save && html.charAt(i) == '{' && html.charAt(i+1) == '{' && html.charAt(i+2) == '{'){
                  save = true;
                  i=i+3;
                  continue;
                }else if(save && html.charAt(i) == '}' && html.charAt(i+1) == '}' && html.charAt(i+2) == '}'){
                  save = false;
                  tempresult = data[result];

                  temphtml = temphtml.replace('{{{'+result+'}}}','<%' + tempresult + '%>');
                  result = '';
                  i=i+3;
                  continue;
                }
                if(save){
                  result += html.charAt(i);
                }
                i++;
              }

            }
            // fs.unlinkSync(filePath);
          }
          newhtml = temphtml;
        }

        function getRandomString() {
          const x = 2147483648;
          return Math.floor(Math.random() * x).toString(36) +
                 Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36);
        }

        file.contents = new Buffer(newhtml);
        self.push(file);
        cb();
    });
};
