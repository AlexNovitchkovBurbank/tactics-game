import React from "react";
import { type ReactNode } from "react";

function Game() {
  const board: ReactNode[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = React.createElement("div", {
        className: "cell",
        id: `cell-${row}-${col}`,
        key: `cell-${row}-${col}`,
      });
      board.push(cell);
    }
  }

  return (
    <>
      <div id="board">{board}</div>
    </>
  );
}

export default Game;
