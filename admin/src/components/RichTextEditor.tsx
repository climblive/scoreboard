import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import BoldIcon from "@material-ui/icons/FormatBold";
import ItalicIcon from "@material-ui/icons/FormatItalic";
import UnorderedListIcon from "@material-ui/icons/FormatListBulleted";
import OrderedListIcon from "@material-ui/icons/FormatListNumbered";
import UnderlineIcon from "@material-ui/icons/FormatUnderlined";
import {
  ContentState,
  convertFromHTML,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import React, { RefObject, useEffect, useState } from "react";

interface Props {
  title: string;
  value: string;
  onChange?: (newValue: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      "& > *": {
        cursor: "pointer",
      },
    },
    editor: {
      flexGrow: 1,
      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.5)",
      overflowY: "scroll",
      padding: 5,
      fontSize: 16,
    },
  })
);

const RichTextEditor = (props: Props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [lastHtml, setLastHtml] = useState<string | undefined>(undefined);

  const classes = useStyles();

  let rulesEditorRef: RefObject<any> = React.createRef();

  useEffect(() => {
    if (lastHtml === undefined) {
      const blocksFromHTML = convertFromHTML(props.value || "");
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
  }, [props.value, lastHtml]);

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
        <div className={classes.actions}>
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
      </div>
      <div className={classes.editor}>
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          ref={rulesEditorRef}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
