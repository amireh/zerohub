import React from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/rulers';
import 'codemirror/keymap/emacs';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/vim';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/lua/lua';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/diff/diff';
import 'codemirror/mode/erlang/erlang';
import 'codemirror/mode/go/go';
import 'codemirror/mode/http/http';
import 'codemirror/mode/nginx/nginx';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/php/php';
import 'codemirror/mode/puppet/puppet';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/yaml/yaml';

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

const Page = React.createClass({
  componentDidMount() {
    this.editor = this.createEditor({ node: this.refs.editorNode });
    this.editor.setValue(this.props.page.content)
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this.editor.setValue(nextProps.page.content);
      this.editor.clearHistory();
    }
  },

  componentWillUnmount() {
    this.editor.toTextArea();
    this.editor = null;
  },

  render() {
    return (
      <div className="space-page">
        <h1 className="space-page__title">{this.props.page.title}</h1>

        <textarea ref="editorNode" />
      </div>
    );
  },

  createEditor({ node }) {
    const RULER = 80;

    return CodeMirror.fromTextArea(node, {
      mode: "gfm",
      lineNumbers: false,
      matchBrackets: true,
      theme: "default",
      tabSize: 2,
      indentUnit: 2,
      gutter: false,
      lineNumbers: false,
      foldGutter: true,
      gutters: [ "CodeMirror-foldgutter" ],
      autoClearEmptyLines: false,
      lineWrapping: true,
      styleActiveLine: true,
      rulers: [ RULER ],
      keyMap: "sublime",
      viewportMargin: Infinity,
      // onKeyEvent: function(editor,e) {
      //   if (editor_disabled) {
      //     e.preventDefault();
      //     e.stopPropagation();
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }
    })

  }
});

export default Page;
