
import React, { useState, useEffect } from 'react';
import './ExcelSheet.css';

const ROWS = 50;
const COLS = 30;

const ExcelSheet = () => {
  const [data, setData] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const [changes, setChanges] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  const [updatedCells, setUpdatedCells] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const sheetId = 'your-sheet-id'; // This should be dynamic in a real app
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/sheet/${sheetId}`);
        if (response.ok) {
          const sheetData = await response.json();
          if (sheetData && sheetData.data && sheetData.data.cells) {
            const newData = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
            sheetData.data.cells.forEach(cell => {
              if (cell.row < ROWS && cell.col < COLS) {
                newData[cell.row][cell.col] = cell.value;
              }
            });
            setData(newData);
          }
        }
      } catch (error) {
        console.error('Error fetching sheet data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleCellChange = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value;
    setData(newData);

    const newChanges = [...changes];
    newChanges[rowIndex][colIndex] = true;
    setChanges(newChanges);

    const existingChangeIndex = updatedCells.findIndex(cell => cell.row === rowIndex && cell.col === colIndex);
    if (existingChangeIndex > -1) {
      const newUpdatedCells = [...updatedCells];
      newUpdatedCells[existingChangeIndex].value = e.target.value;
      setUpdatedCells(newUpdatedCells);
    } else {
      setUpdatedCells([...updatedCells, { row: rowIndex, col: colIndex, value: e.target.value }]);
    }

    console.log('Updated Cells:', updatedCells);
  };

  const handleSave = async () => {
    const sheetId = 'your-sheet-id'; // This should be dynamic in a real app
    const dataToSend = updatedCells.map(cell => ({ ...cell, sheetId }));

    try {
      const response = await fetch('http://localhost:3000/api/v1/sheet/update-cells', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Changes saved successfully!');
        setUpdatedCells([]);
        setChanges(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
      } else {
        alert('Failed to save changes.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('An error occurred while saving changes.');
    }
  };

  const handleHistory = async () => {
    const sheetId = 'your-sheet-id'; // This should be dynamic in a real app
    try {
      const response = await fetch(`http://localhost:3000/api/v1/sheet/history/${sheetId}`);
      if (response.ok) {
        const historyData = await response.json();
        if (historyData && Array.isArray(historyData.data)) {
          setHistory(historyData.data);
        } else {
          setHistory([]);
        }
      } else {
        alert('Failed to fetch history.');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('An error occurred while fetching history.');
    }
  };

  const renderTable = () => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      const cells = [];
      for (let j = 0; j < COLS; j++) {
        cells.push(
          <td key={j} className={changes[i][j] ? 'changed' : ''}>
            <input
              type="text"
              value={data[i][j]}
              onChange={(e) => handleCellChange(e, i, j)}
            />
          </td>
        );
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }
    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return (
    <div className="excel-sheet-container">
      {renderTable()}
      <div className="info-container">
        <div className="changed-cells">
          <h3>Updated Cells</h3>
          <button onClick={handleSave}>Save Changes</button>
          <ul>
            {updatedCells.map((cell, index) => (
              <li key={index}>
                Row: {cell.row}, Col: {cell.col}, Value: {cell.value}
              </li>
            ))}
          </ul>
        </div>
        <div className="history">
          <h3>History</h3>
          <button onClick={handleHistory}>Show History</button>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                Row: {entry.row}, Col: {entry.col}, Value: {entry.value} @ {new Date(entry.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExcelSheet;
