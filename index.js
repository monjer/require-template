var fs = require('fs');
var through = require('through');
var path = require('path');

var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

var divider = /\<--\s*#(\w*)\s*--\>/;

var blankLine = /^\s*[\r\n]/gm;

function stringify(content, json) {
  content = json ? JSON.stringify(content) : "'" + content + "'";
  return 'module.exports = ' + content + ';';
}

function strEscap(str) {
  return str.replace(escaper , function(match){
    return '\\' + match;
  })
}

function removeBlankLine(str){
  return str.replace(blankLine , '');
}

module.exports = function(file, opts) {

  var ext = path.extname(file);
  if (ext !== '.html') {
    return through();
  }
  opts = opts || {};

  var data = '';

  function write(buf) {
    data += buf
  }

  function end() {
    var content, src, i = 0,
      str, template = {};
    try {
      content = fs.readFileSync(file, 'utf-8');
      content = removeBlankLine(content);
      content = strEscap(content.trim());

      str = content;

      content = content.split(divider)
      content.shift();
      var length = content.length;
      if (length > 0) {
        while (i < length) {
          template[content[i]] = removeBlankLine(content[i + 1]);
          i += 2;
        }
        src = stringify(template, true);
      } else {
        src = stringify(str, false);
      }

    } catch (error) {
      this.emit('error', error);
    }
    this.queue(src);
    this.queue(null);
  }

  return through(write, end);


};
