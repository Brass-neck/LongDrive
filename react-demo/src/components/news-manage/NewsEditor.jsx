import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.scss'

export default function NewsEditor(props) {
  const [editorState, seteditorState] = useState('')

  const onEditorStateChange = (v) => seteditorState(v)

  const onBlur = () => {
    let content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    props.getContent(content)
  }

  return (
    <div>
      <Editor
        editorClassName='editor-body'
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        onBlur={onBlur}
      />
    </div>
  )
}
