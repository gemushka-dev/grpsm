import { useRef, type UIEvent, type KeyboardEvent } from "react";
import { SQL_KEYWORDS, SQL_TYPES, SQL_FUNCTIONS } from "../data/sql-keywords";
import "../styles/editor.css";

type EditorProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
};

export const EditorComponent = ({ code, setCode }: EditorProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const highLight = (text: string) => {
    if (!text) return "\n";
    const endsWithN = text.endsWith("\n");
    const adjustedText = endsWithN ? text + "\n" : text;

    const textArr = adjustedText.split(/(\s+|[,;()])/);
    return textArr.map((word, id) => {
      if (!word) return null;
      if (SQL_KEYWORDS.has(word.trim().toUpperCase())) {
        return (
          <span className="sql-span" key={id}>
            {word}
          </span>
        );
      } else if (SQL_TYPES.has(word.trim().toUpperCase())) {
        return (
          <span className="sql-type-span" key={id}>
            {word}
          </span>
        );
      } else if (SQL_FUNCTIONS.has(word.trim().toUpperCase())) {
        return (
          <span className="sql-function-span" key={id}>
            {word}
          </span>
        );
      } else {
        return <span key={id}>{word}</span>;
      }
    });
  };

  const handleScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    if (divRef.current) {
      divRef.current.scrollTop = e.currentTarget.scrollTop;
      divRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleClick = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const tab = "  ";

      const newCode = code.substring(0, start) + tab + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tab.length;
      }, 0);
    }
  };

  return (
    <>
      <div className="container">
        <div className="container-text" ref={divRef}>
          {highLight(code)}
        </div>
        <textarea
          className="container-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleClick}
          onScroll={handleScroll}
          spellCheck={false}
        ></textarea>
      </div>
    </>
  );
};
