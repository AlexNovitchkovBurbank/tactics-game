import React, { useEffect, useState } from "react";
import { type ReactNode } from "react";
import "./game.css";
import randomArrayIndexGenerator from "../randomizers/randomArrayIndexGenerator";
import type { GamePiece } from "../gamePieces/GamePiece";
import Tank from "../gamePieces/tank";

const Game = () => {
  const [pieces, setPieces] = useState<GamePiece[]>([
    new Tank("A1", 0, 0),
    new Tank("B1", 7, 0),
  ]);
  const [terrain, setTerrain] = useState<string[]>(createTerrainArray(8, 8));

  const board = updateGameBoard(terrain, pieces);

  return (
    <div id="game">
      <div id="board">{board}</div>
    </div>
  );
};

const createTerrainArray = (rows: number, cols: number): string[] => {
  const terrain: string[] = [];
  const colors = ["#e9ecef", "#6a994e", "#90e0ef", "#adb5bd"]; // [City, Forest, Water, Mountain]
  for (let i = 0; i < rows * cols; i++) {
    terrain.push(colors[randomArrayIndexGenerator(colors.length)]);
  }

  return terrain;
};

const updateGameBoard = (
  terrainArray: string[],
  pieces: GamePiece[],
): ReactNode[] => {
  const board: ReactNode[] = [];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    for (const piece of pieces) {
      const position = piece.getPosition();
      if (position.row === parseInt(target.id) && position.col === parseInt(target.id)) {
        console.log("Updating game board with pieces:", pieces);
      }
    }
  };

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = pieces.find((piece) => {
        const position = piece.getPosition();
        return position.row === row && position.col === col;
      });

      const text = piece ? `${piece.getPower()} ${piece.getSpeed()}` : "";

      const cell = React.createElement(
        "button",
        {
          className: "cell",
          id: `cell-${row}-${col}`,
          key: `cell-${row}-${col}`,
          style: {
            backgroundColor: terrainArray[row * 8 + col],
            opacity: 0.8,
          },
          onClick: handleClick,
        },
        text,
      );
      board.push(cell);
    }
  }

  return board;
};

// const putPiecesOnBoard = (board: ReactNode[]): GamePiece[] => {
//   const pieces: GamePiece[] = [];
//   const tankA1 = new Tank("A1", 0, 0);
//   const tankB1 = new Tank("B1", 7, 0);

//   const gamePieces : GamePiece[] = [tankA1, tankB1];

//   for (const piece of gamePieces) {
//     const {row, col} = piece.getPosition();
//     const cellId = `cell-${row}-${col}`;
//     const cell = document.getElementById(cellId);
//     if (cell) {
//       const pieceElement = React.createElement("div");
//       cell.appendChild(pieceElement);
//     }
//   }

//   return pieces;
// }

export default Game;
