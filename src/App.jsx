import { useEffect, useMemo, useState } from 'react'
import './App.css'

const DEFAULT_CELL_COUNT = 3

// X - 0
// O - 1
function App() {
  const [cellCount, setCellCount] = useState(DEFAULT_CELL_COUNT)
  const [selectedPlayer, setSelectedPlayer] = useState(null) // null | 0 | 1
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [takenCells, setTakenCells] = useState({}) // { 11: 0, 12: 1 }
  const [currentTurn, setCurrentTurn] = useState(1)
  const [winner, setWinner] = useState(null)

  const cells = useMemo(() => {
    const arr = new Array(cellCount).fill(null)
    return arr.flatMap((_, row) => arr.map((_, column) => row + 1 + '' + (column + 1)))
  }, [cellCount])

  useEffect(() => {
    if (isGameStarted) {
      toggleCurrentTurn()

      setTimeout(() => {
        checkWinning()
      }, 100)
    }
  }, [isGameStarted, takenCells])

  useEffect(() => {
    if (winner) {
      alert(`${winner} won`)
      restartGame()
    }
  }, [winner])

  const handlePlayerSelect = player => {
    setSelectedPlayer(player)
  }

  const startGame = () => {
    setIsGameStarted(true)
  }

  const restartGame = () => {
    setSelectedPlayer(null)
    setIsGameStarted(false)
    setTakenCells({})
    setCurrentTurn(1)
    setWinner(null)
  }

  const toggleCurrentTurn = () => {
    setCurrentTurn(turn => (turn === 0 ? 1 : 0))
  }

  const handleClickCell = cellId => {
    const activeCells = { ...takenCells }

    if (activeCells[cellId] === undefined) {
      activeCells[cellId] = currentTurn
      setTakenCells(activeCells)
    }
  }

  const incCount = () => {
    setCellCount(count => (count < 9 ? count + 1 : count))
  }

  const decCount = () => {
    setCellCount(count => (count > 3 ? count - 1 : count))
  }

  const checkWinning = () => {
    const currentCells = [...cells]
    const horizontalChecks = []
    const verticalChecks = []
    const diagonalChecks = []

    for (let i = 0; i < cellCount; i++) {
      const [first, ...rest] = currentCells.slice(i * cellCount, i * cellCount + cellCount)
      horizontalChecks.push(first)

      if (i === 0) {
        verticalChecks.push(first, ...rest)
      }

      if (i === 0 || i === cellCount - 1) {
        diagonalChecks.push(first)
      }
    }

    // console.log(horizontalChecks, verticalChecks, diagonalChecks)

    // horizontal check
    if (horizontalChecks.length > 0) {
      const isWin = horizontalChecks.filter(cell => {
        const cellValue = takenCells[cell]
        let winCount = 0

        if (cellValue !== undefined) {
          for (let i = 1; i < cellCount; i++) {
            const [row, col] = cell.split('')
            const nextCell = `${row}${parseInt(col, 10) + i}`
            if (cellValue === takenCells[nextCell]) {
              winCount += 1
            }
          }
        }

        return winCount === cellCount - 1
      })

      if (isWin[0]) {
        setWinner(takenCells[isWin[0]] === 0 ? 'X' : 'O')
        return
      }
    }

    // vertical check
    if (verticalChecks.length > 0) {
      const isWin = verticalChecks.filter(cell => {
        const cellValue = takenCells[cell]
        let winCount = 0

        if (cellValue !== undefined) {
          for (let i = 1; i < cellCount; i++) {
            const [row, col] = cell.split('')
            const bottomCell = `${parseInt(row, 10) + i}${col}`
            if (cellValue === takenCells[bottomCell]) {
              winCount += 1
            }
          }
        }

        return winCount === cellCount - 1
      })

      if (isWin[0] !== undefined) {
        setWinner(takenCells[isWin[0]] === 0 ? 'X' : 'O')
        return
      }
    }

    if (diagonalChecks.length > 0) {
      const isWin = diagonalChecks.filter((cell, index) => {
        const cellValue = takenCells[cell]
        let winCount = 0

        if (cellValue !== undefined) {
          for (let i = 1; i < cellCount; i++) {
            const [row, col] = cell.split('')
            const bottomCell =
              index === 0
                ? `${parseInt(row, 10) + i}${parseInt(col, 10) + i}`
                : `${parseInt(row, 10) - i}${parseInt(col, 10) + i}`
            if (cellValue === takenCells[bottomCell]) {
              winCount += 1
            }
          }
        }

        return winCount === cellCount - 1
      })

      if (isWin[0] !== undefined) {
        setWinner(takenCells[isWin[0]] === 0 ? 'X' : 'O')
        return
      }
    }
  }

  return (
    <div className="App">
      <h1 className="primary-text">
        Tic <span className="secondary-text">Tac</span> Toe
      </h1>

      {!isGameStarted && (
        <>
          {/* Pick player card */}
          <div className="pick-card">
            <p className="pick-card-text">
              Please select <span className="primary-text">X</span> or{' '}
              <span className="secondary-text">O</span>
            </p>

            <div className="pick-card-btn-wrapper">
              <button
                className={selectedPlayer === 0 ? 'selected-player' : ''}
                onClick={() => handlePlayerSelect(0)}
              >
                <span className="primary-text">X</span>
              </button>

              <button
                className={selectedPlayer === 1 ? 'selected-player' : ''}
                onClick={() => handlePlayerSelect(1)}
              >
                <span className="secondary-text">O</span>
              </button>
            </div>

            <div style={{ marginTop: '50px' }}>
              <p>Cell Count</p>

              <button onClick={decCount}>-</button>
              <span style={{ margin: '0px 20px' }}>{cellCount}</span>
              <button onClick={incCount}>+</button>
            </div>
          </div>

          {selectedPlayer !== null && (
            <button className="start-btn" onClick={startGame}>
              Start Game
            </button>
          )}
        </>
      )}

      {/* Game */}
      {isGameStarted && (
        <>
          <div className="game-card" style={{ gridTemplateColumns: `repeat(${cellCount}, 100px)` }}>
            {cells.map(cell => (
              <button key={cell} className="cell" id={cell} onClick={() => handleClickCell(cell)}>
                {takenCells[cell] === 0 && <span className="primary-text">X</span>}
                {takenCells[cell] === 1 && <span className="secondary-text">O</span>}
              </button>
            ))}
          </div>

          <div>
            <span style={{ marginRight: '50px' }}>{currentTurn === 0 ? 'X' : 'O'} turn</span>

            <button className="start-btn" onClick={restartGame}>
              Restart Game
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
