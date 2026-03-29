import React from "react";
import { type ReactNode } from "react";
import "./game.css";
import randomArrayIndexGenerator from "../randomizers/randomArrayIndexGenerator";

function Game() {
  const board: ReactNode[] = [];
  const colors = ["#e9ecef", "#6a994e", "#90e0ef", "#adb5bd"]; // [City, Forest, Water, Mountain]
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = React.createElement("div", {
        className: "cell",
        id: `cell-${row}-${col}`,
        key: `cell-${row}-${col}`,
        style: {
          backgroundColor: colors[randomArrayIndexGenerator(colors.length)],
          opacity: 0.8,
        },
      });
      board.push(cell);
    }
  }

  return (
    <div id="game">
      <div id="board">{board}</div>
    </div>
  );
}

export default Game;
