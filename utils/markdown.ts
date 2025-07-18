import { marked } from 'marked';
import hljs from 'highlight.js';

// highlight.jsの設定
hljs.configure({
  ignoreUnescapedHTML: true,
});

// markedの設定
marked.setOptions({
  breaks: true, // 改行を<br>に変換
  gfm: true, // GitHub Flavored Markdown
  pedantic: false, // 厳密モードを無効化
  highlight: function (code, lang) {
    // 言語が指定されている場合
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.warn('Syntax highlighting error:', err);
      }
    }

    // 言語が指定されていない場合は自動検出
    try {
      return hljs.highlightAuto(code).value;
    } catch (err) {
      console.warn('Auto syntax highlighting error:', err);
      return code; // エラーの場合はそのまま返す
    }
  },
});

/**
 * マークダウンテキストをHTMLに変換
 */
export const parseMarkdown = (markdown: string): string => {
  if (!markdown) return '';

  try {
    // リストの前後に改行を追加して確実にパースされるようにする
    const processedMarkdown = markdown
      .replace(/^(\s*)(-|\*|\+|\d+\.)\s+/gm, '$1$2 ') // リストマーカーの後にスペースを統一
      .replace(/\n(?=\s*(-|\*|\+|\d+\.)\s)/g, '\n\n') // リスト前に空行を追加
      .replace(/(?<=(-|\*|\+|\d+\.).*)\n(?!\s*(-|\*|\+|\d+\.|\s*$))/g, '\n\n'); // リスト後に空行を追加

    const html = marked.parse(processedMarkdown) as string;

    return html;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    // エラーの場合は元のテキストをそのまま返す
    return markdown.replace(/\n/g, '<br>');
  }
};
