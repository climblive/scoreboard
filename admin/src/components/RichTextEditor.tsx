import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { RefObject } from "react";
import UnderlineIcon from "@material-ui/icons/FormatUnderlined";
import BoldIcon from "@material-ui/icons/FormatBold";
import ItalicIcon from "@material-ui/icons/FormatItalic";
import UnorderedListIcon from "@material-ui/icons/FormatListBulleted";
import OrderedListIcon from "@material-ui/icons/FormatListNumbered";

import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";

interface Props {
  title: string;
  value: string;
  onChange?: (newValue: string) => void;
}

type State = {
  editorState: EditorState;
  lastHtml?: string;
};

const RichTextEditor = (props: Props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [lastHtml, setLastHtml] = useState<string | undefined>(undefined);

  let rulesEditorRef: RefObject<any> = React.createRef();

  useEffect(() => {
    updateValue(props.value, true);
  }, []);

  const updateValue = (newValue: string, forceUpdate: boolean) => {
    if (lastHtml !== newValue || forceUpdate) {
      const blocksFromHTML = convertFromHTML(newValue || "");
      if (blocksFromHTML.contentBlocks.length) {
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(state));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  };

  const onEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);
    setLastHtml(stateToHTML(editorState.getCurrentContent()));
    if (lastHtml) {
      props.onChange?.(lastHtml);
    }
  };

  const toggleUnorderedList = (e: any) => {
    e.preventDefault();
    onEditorChange(
      RichUtils.toggleBlockType(editorState, "unordered-list-item")
    );
  };

  const toggleOrderedList = (e: any) => {
    e.preventDefault();
    onEditorChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
  };

  const toggleBold = (e: any) => {
    e.preventDefault();
    onEditorChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const toggleUnderline = (e: any) => {
    e.preventDefault();
    onEditorChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  const toggleItalic = (e: any) => {
    e.preventDefault();
    onEditorChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      onClick={() => rulesEditorRef.current!.focus()}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
        <span style={{ marginRight: "auto", color: "rgba(0, 0, 0, 0.54)" }}>
          {props.title}
        </span>
        <UnderlineIcon
          className="editor-action"
          onMouseDown={toggleUnderline}
        />
        <BoldIcon className="editor-action" onMouseDown={toggleBold} />
        <ItalicIcon
          className="editor-action"
          style={{ marginRight: 10 }}
          onMouseDown={toggleItalic}
        />
        <UnorderedListIcon
          className="editor-action"
          onMouseDown={toggleUnorderedList}
        />
        <OrderedListIcon
          className="editor-action"
          onMouseDown={toggleOrderedList}
        />
      </div>
      <Editor
        editorState={editorState}
        onChange={onEditorChange}
        ref={rulesEditorRef}
      />
    </div>
  );
};

export default RichTextEditor;
