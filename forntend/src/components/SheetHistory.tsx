import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ExcelSheet.css';

const ROWS = 50;
const COLS = 30;

const SheetHistory = () => {
  const [data, setData] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const { historyId } = useParams();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/sheet/snapshot/${historyId}`);
        if (response.ok) {
          const snapshot = await response.json();
          if (snapshot && snapshot.data) {
            const newData = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
            snapshot.data.forEach(cell => {
              if (cell.row < ROWS && cell.col < COLS) {
                newData[cell.row][cell.col] = cell.value;
              }
            });
            setData(newData);
          }
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    if (historyId) {
      fetchHistoryData();
    }
  }, [historyId]);

  const renderTable = () => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      const cells = [];
      for (let j = 0; j < COLS; j++) {
        cells.push(
          <td key={j}>
            <input
              type="text"
              value={data[i][j]}
              readOnly
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
      <h2>History for {historyId}</h2>
      {renderTable()}
    </div>
  );
};

export default SheetHistory;
