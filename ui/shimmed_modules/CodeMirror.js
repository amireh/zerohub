const CodeMirror = require('../../node_modules/codemirror');
require('../../node_modules/codemirror/addon/fold/foldcode');
require('../../node_modules/codemirror/addon/fold/foldgutter');
require('../../node_modules/codemirror/addon/fold/brace-fold');
require('../../node_modules/codemirror/addon/fold/markdown-fold');
require('../../node_modules/codemirror/addon/dialog/dialog');
require('../../node_modules/codemirror/addon/search/searchcursor');
require('../../node_modules/codemirror/addon/search/search');
require('../../node_modules/codemirror/addon/selection/active-line');
require('../../node_modules/codemirror/addon/display/rulers');
require('../../node_modules/codemirror/keymap/emacs');
require('../../node_modules/codemirror/keymap/sublime');
require('../../node_modules/codemirror/keymap/vim');
require('../../node_modules/codemirror/mode/markdown/markdown');
require('../../node_modules/codemirror/mode/gfm/gfm');
require('../../node_modules/codemirror/mode/lua/lua');
require('../../node_modules/codemirror/mode/htmlembedded/htmlembedded');
require('../../node_modules/codemirror/mode/htmlmixed/htmlmixed');
require('../../node_modules/codemirror/mode/xml/xml');
require('../../node_modules/codemirror/mode/shell/shell');
require('../../node_modules/codemirror/mode/ruby/ruby');
require('../../node_modules/codemirror/mode/javascript/javascript');
require('../../node_modules/codemirror/mode/clike/clike');
require('../../node_modules/codemirror/mode/coffeescript/coffeescript');
require('../../node_modules/codemirror/mode/css/css');
require('../../node_modules/codemirror/mode/diff/diff');
require('../../node_modules/codemirror/mode/erlang/erlang');
require('../../node_modules/codemirror/mode/go/go');
require('../../node_modules/codemirror/mode/http/http');
require('../../node_modules/codemirror/mode/nginx/nginx');
require('../../node_modules/codemirror/mode/perl/perl');
require('../../node_modules/codemirror/mode/php/php');
require('../../node_modules/codemirror/mode/puppet/puppet');
require('../../node_modules/codemirror/mode/python/python');
require('../../node_modules/codemirror/mode/sass/sass');
require('../../node_modules/codemirror/mode/sql/sql');
require('../../node_modules/codemirror/mode/yaml/yaml');

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
