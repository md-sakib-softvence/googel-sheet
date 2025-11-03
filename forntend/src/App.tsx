import { Route, Routes } from 'react-router-dom';
import './App.css';
import ExcelSheet from './components/ExcelSheet';
import SheetHistory from './components/SheetHistory';

function App() {

  return (
    <Routes>
      <Route path="/" element={<ExcelSheet />} />
      <Route path="/history/:historyId" element={<SheetHistory />} />
    </Routes>
  )
}

export default App
