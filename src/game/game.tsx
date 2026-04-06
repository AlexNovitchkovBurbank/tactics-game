import React, { useState } from "react";
import { type ReactNode } from "react";
import "./game.css";
import randomArrayIndexGenerator from "../randomizers/randomArrayIndexGenerator";
import type { GamePiece } from "../gamePieces/GamePiece";
import Tank from "../gamePieces/tank";
import sixSidedDie from "../randomizers/die";
import Infantry from "../gamePieces/infantry";

const Game = () => {
  const [pieces, setPieces] = useState<GamePiece[]>([
    new Tank("A-tank-1", 0, 0),
    new Tank("A-tank-2", 0, 1),
    new Infantry("A-infantry-1", 0, 2),
    new Infantry("A-infantry-2", 0, 3),
    new Infantry("A-infantry-3", 0, 4),
    new Infantry("A-infantry-4", 0, 5),
    new Tank("A-tank-3", 0, 6),
    new Tank("A-tank-4", 0, 7),

    new Tank("B-tank-1", 7, 0),
    new Tank("B-tank-2", 7, 1),
    new Infantry("B-infantry-1", 7, 2),
    new Infantry("B-infantry-2", 7, 3),
    new Infantry("B-infantry-3", 7, 4),
    new Infantry("B-infantry-4", 7, 5),
    new Tank("B-tank-3", 7, 6),
    new Tank("B-tank-4", 7, 7),
  ]);
  const [terrain, setTerrain] = useState<string[]>(createTerrainArray(8, 8));

  const [pieceToMove, setPieceToMove] = useState<GamePiece | null>(null);

  const [numClicks, setNumClicks] = useState<number>(0);

  const board = updateGameBoard(
    terrain,
    pieces,
    setPieces,
    pieceToMove,
    setPieceToMove,
    numClicks,
    setNumClicks,
  );

  return <div id="board">{board}</div>;
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
  setPieces: React.Dispatch<React.SetStateAction<GamePiece[]>>,
  pieceToMove: GamePiece | null,
  setPieceToMove: React.Dispatch<React.SetStateAction<GamePiece | null>>,
  numClicks: number,
  setNumClicks: React.Dispatch<React.SetStateAction<number>>,
): ReactNode[] => {
  const board: ReactNode[] = [];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;

    if (target.id === null) return;
    if (!target.id.startsWith("cell-")) return;
    if (target.id.split("-").length !== 3) return;

    const cellRow = parseInt(target.id.split("-")[1]);
    const cellCol = parseInt(target.id.split("-")[2]);

    // Return a piece on the current clicked cell or null
    const currentCellPiece = pieces.find((gamePiece) => {
      const position = gamePiece.getPosition();
      return position.row === cellRow && position.col === cellCol;
    });

    if (numClicks === 0) {
      setNumClicks(currentCellPiece ? 1 : 0);
      setPieceToMove(currentCellPiece ? currentCellPiece : null);
    } else if (numClicks === 1) {
      setNumClicks(0);
      setPieceToMove(null); // No piece for next round of clicks
    }

    if (numClicks === 1 && pieceToMove) {
      const currentCellCoordinates = { row: cellRow, col: cellCol };
      const pieceToMovePosition = pieceToMove.getPosition();
      const terrainOfCellToMoveFrom =
        terrainArray[pieceToMovePosition.row * 8 + pieceToMovePosition.col];
      const terrainOfCellToMoveTo =
        terrainArray[
          currentCellCoordinates.row * 8 + currentCellCoordinates.col
        ];

      const canMoveResultString = checkIfMoveIsValid(
        pieces,
        pieceToMovePosition,
        currentCellCoordinates,
        terrainOfCellToMoveFrom,
        terrainOfCellToMoveTo,
      );
      if (canMoveResultString === "valid move") {
        const updatedPiecesArray = pieces.filter((gamePiece) => {
          const position = gamePiece.getPosition();
          return !(
            position.row === pieceToMovePosition.row &&
            position.col === pieceToMovePosition.col
          );
        });

        pieceToMove.move(cellRow, cellCol, terrainArray[cellRow * 8 + cellCol]);
        updatedPiecesArray.push(pieceToMove);

        setPieces(updatedPiecesArray);
      } else if (canMoveResultString === "piece on square") {
        const dieRoll = sixSidedDie();

        const updatedPiecesArray = pieces.filter((gamePiece) => {
          const position = gamePiece.getPosition();
          return !(
            (position.row === pieceToMovePosition.row &&
              position.col === pieceToMovePosition.col) ||
            (position.row === cellRow && position.col === cellCol)
          );
        });

        const winningPiece = returnWinningPieceInAttack(
          pieceToMove,
          currentCellPiece,
          dieRoll,
        );

        updatedPiecesArray.push(winningPiece);

        setPieces(updatedPiecesArray);
      }
    }
  };

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = pieces.find((piece) => {
        const position = piece.getPosition();
        return position.row === row && position.col === col;
      });

      const piecePosition = piece ? piece.getPosition() : null;
      const cellText = piece ? piece.getPower() + " " + piece.getSpeed() : "";

      let cellColor: string = terrainArray[row * 8 + col];

      if (pieceToMove) {
        const currentClickedPiece = pieceToMove.getPosition();

        if (
          currentClickedPiece.row === row &&
          currentClickedPiece.col === col &&
          numClicks === 1
        ) {
          cellColor = "#ffaa00";
        }
      }

      let cell = React.createElement(
        "button",
        {
          className: "cell",
          id: `cell-${row}-${col}`,
          key: `cell-${row}-${col}`,
          style: {
            backgroundColor: cellColor,
            opacity: 0.8,
          },
          onClick: handleClick,
        },
        cellText,
      );

      board.push(cell);
    }
  }

  return board;
};

const checkIfMoveIsValid = (
  pieces: GamePiece[],
  piecePosition: { row: number; col: number },
  currentCell: { row: number; col: number },
  terrainOfCellToMoveFrom: string,
  terrainOfCellToMoveTo: string,
): string => {
  const pieceOnCurrentClickedSquare = pieces.find((gamePiece) => {
    const position = gamePiece.getPosition();
    return position.row === currentCell.row && position.col === currentCell.col;
  });

  if (
    (currentCell.row === piecePosition.row - 1 &&
      currentCell.col === piecePosition.col - 1) ||
    (currentCell.row === piecePosition.row - 1 &&
      currentCell.col === piecePosition.col) ||
    (currentCell.row === piecePosition.row - 1 &&
      currentCell.col === piecePosition.col + 1) ||
    (currentCell.row === piecePosition.row &&
      currentCell.col === piecePosition.col - 1) ||
    (currentCell.row === piecePosition.row &&
      currentCell.col === piecePosition.col + 1) ||
    (currentCell.row === piecePosition.row + 1 &&
      currentCell.col === piecePosition.col - 1) ||
    (currentCell.row === piecePosition.row + 1 &&
      currentCell.col === piecePosition.col) ||
    (currentCell.row === piecePosition.row + 1 &&
      currentCell.col === piecePosition.col + 1)
  ) {
    if (pieceOnCurrentClickedSquare) {
      return "piece on square";
    }

    return "valid move";
  }

  return "invalid move";
};

const returnWinningPieceInAttack = (
  attackingPiece: GamePiece,
  defendingPiece: GamePiece | undefined,
  dieRoll: number,
): GamePiece => {
  if (!defendingPiece) {
    return attackingPiece;
  }
  // TODO: More sophisticated table
  if (dieRoll <= 3) {
    return defendingPiece;
  } else {
    return attackingPiece;
  }
};

export default Game;
