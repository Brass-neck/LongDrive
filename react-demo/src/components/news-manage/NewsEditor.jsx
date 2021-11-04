import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.scss'

export default function NewsEditor(props) {
  useEffect(() => {
    if (props.content == undefined) return
    const block = htmlToDraft(props.content)
    if (block) {
      const contentState = ContentState.createFromBlockArray(block.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      seteditorState(editorState)
    }
  }, [props.content])

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
