import * as React from 'react';
import {RouteComponentProps} from "react-router";
import {Editor, EditorState, RichUtils, ContentBlock, ContentState, convertFromHTML} from "draft-js"
import {RefObject} from "react";
import UnderlineIcon from '@material-ui/icons/FormatUnderlined';
import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnorderedListIcon from '@material-ui/icons/FormatListBulleted';
import OrderedListIcon from '@material-ui/icons/FormatListNumbered';

import "draft-js/dist/Draft.css";
import {stateToHTML} from 'draft-js-export-html';

interface Props {
   title:string,
   value:string,
   onChange?:(newValue:string) => void
}

type State = {
   editorState:EditorState,
   lastHtml?:string
}

class RichTextEditor extends React.Component<Props, State> {
   public readonly state: State = {
      editorState: EditorState.createEmpty()
   };

   rulesEditorRef:RefObject<any>; //HTMLDivElement

   constructor(props: Props & RouteComponentProps) {
      super(props);
      this.rulesEditorRef = React.createRef();
   }

   componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
      this.updateValue(nextProps.value, false);
   }

   componentDidMount() {
      this.updateValue(this.props.value, true);
   }

   updateValue = (newValue: string, forceUpdate:boolean) => {
      if(this.state.lastHtml !== newValue || forceUpdate) {
         const blocksFromHTML = convertFromHTML(newValue || "");
         if (blocksFromHTML.contentBlocks.length) {
            const state = ContentState.createFromBlockArray(
               blocksFromHTML.contentBlocks,
               blocksFromHTML.entityMap
            );
            this.state.editorState = EditorState.createWithContent(state);
         } else {
            this.state.editorState = EditorState.createEmpty();
         }
      }
      this.setState(this.state);
   };

   onEditorChange = (editorState:EditorState) => {
      this.state.editorState = editorState;
      this.state.lastHtml = stateToHTML(editorState.getCurrentContent());
      this.setState(this.state);
      this.props.onChange!(this.state.lastHtml);
   };

   toggleUnorderedList = (e:any) => {
      e.preventDefault();
      this.onEditorChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
   };

   toggleOrderedList = (e:any) => {
      e.preventDefault();
      this.onEditorChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
   };

   toggleBold = (e:any) => {
      e.preventDefault();
      this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
   };
   toggleUnderline = (e:any) => {
      e.preventDefault();
      this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
   };
   toggleItalic = (e:any) => {
      e.preventDefault();
      this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
   };

   render() {
      return(
         <div style={{display:"flex", flexDirection:"column", flexGrow:1}} onClick={() => this.rulesEditorRef.current!.focus()}>
            <div style={{display:"flex", alignItems:"center", marginBottom:5}}>
               <span style={{marginRight:"auto", color:"rgba(0, 0, 0, 0.54)"}}>{this.props.title}</span>
               <UnderlineIcon className="editor-action" onMouseDown={this.toggleUnderline} />
               <BoldIcon className="editor-action" onMouseDown={this.toggleBold} />
               <ItalicIcon className="editor-action" style={{marginRight:10}} onMouseDown={this.toggleItalic} />
               <UnorderedListIcon className="editor-action" onMouseDown={this.toggleUnorderedList} />
               <OrderedListIcon className="editor-action" onMouseDown={this.toggleOrderedList} />
            </div>
            <Editor editorState={this.state.editorState}
                    onChange={this.onEditorChange}
                    ref={this.rulesEditorRef}
                    />

         </div>
      )
   }
}

export default RichTextEditor;
