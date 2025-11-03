import { useState , useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import  Editor  from '@monaco-editor/react'
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";


function App() {
  const editorRef = useRef<any>(null)

  const handleTextingEditingFuncitons = (editor: any, monaco: any) => {
    editorRef.current = editor
    const ydoc = new Y.Doc();

    const provider = new WebrtcProvider("test-room", ydoc);
    const yText = ydoc.getText("monaco");
    const binding = new MonacoBinding(yText, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
  }

  return (
    <Editor
      height="90vh"
      width="90vw"
      theme='vs-dark'
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onMount={handleTextingEditingFuncitons}
    />
  )
}

export default App
