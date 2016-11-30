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
      template = {} , fragments;
    try {
      content = fs.readFileSync(file, 'utf-8');
      content = removeBlankLine(content.trim());

      fragments = content.split(divider)
      fragments.shift();
      var length = fragments.length;
      if (length > 0) {
        while (i < length) {
          template[fragments[i]] = removeBlankLine(fragments[i + 1].trim());
          i += 2;
        }
        content = stringify(template, true);
      } else {
        content = strEscap(content.trim());
        content = stringify(content, false);
      }

    } catch (error) {
      this.emit('error', error);
    }
    this.queue(content);
    this.queue(null);
  }

  return through(write, end);


};
