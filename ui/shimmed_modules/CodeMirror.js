const CodeMirror = require('codemirror');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/fold/markdown-fold');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/search');
require('codemirror/addon/selection/active-line');
require('codemirror/addon/display/rulers');
require('codemirror/keymap/emacs');
require('codemirror/keymap/sublime');
require('codemirror/keymap/vim');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/gfm/gfm');
require('codemirror/mode/lua/lua');
require('codemirror/mode/htmlembedded/htmlembedded');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/xml/xml');
require('codemirror/mode/shell/shell');
require('codemirror/mode/ruby/ruby');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/clike/clike');
require('codemirror/mode/coffeescript/coffeescript');
require('codemirror/mode/css/css');
require('codemirror/mode/diff/diff');
require('codemirror/mode/erlang/erlang');
require('codemirror/mode/go/go');
require('codemirror/mode/http/http');
require('codemirror/mode/nginx/nginx');
require('codemirror/mode/perl/perl');
require('codemirror/mode/php/php');
require('codemirror/mode/puppet/puppet');
require('codemirror/mode/python/python');
require('codemirror/mode/sass/sass');
require('codemirror/mode/sql/sql');
require('codemirror/mode/yaml/yaml');

const CODE_MIRROR_ALIASES = {
  'shell': [ 'bash', 'sh' ]
};

Object.keys(CODE_MIRROR_ALIASES).filter(mode => CodeMirror.modes[mode]).forEach(mode => {
  CODE_MIRROR_ALIASES[mode].forEach(alias => {
    if (!CodeMirror.modes[alias]) {
      CodeMirror.defineMode(alias, CodeMirror.modes[mode]);
    }
  });
});

module.exports = CodeMirror;
