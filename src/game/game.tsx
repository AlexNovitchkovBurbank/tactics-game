function Game() {
    const board = document.getElementById('board');
    if (!board) return null;
    
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            board.appendChild(cell);
        }
    }

  return (
    <>
        <div id="board"></div>
    </>
  )
}

export default Game