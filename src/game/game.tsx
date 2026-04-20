import React, { useState } from "react";
import { type ReactNode } from "react";
import "./game.css";
import randomArrayIndexGenerator from "../randomizers/randomArrayIndexGenerator";
import type { GamePiece } from "../gamePieces/GamePiece";
import Tank from "../gamePieces/tank";
import sixSidedDie from "../randomizers/die";
import Infantry from "../gamePieces/infantry";
import { useDispatch } from "react-redux";
import { setDieRollResult } from "../redux/dieRollSlice";
import features from "../features";

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
  const [terrain] = useState<string[]>(createTerrainArray(8, 8));

  const [activePiece, setActivePiece] = useState<GamePiece | null>(null);

  const [numClicks, setNumClicks] = useState<number>(0);

  const board = updateGameBoard(
    terrain,
    pieces,
    setPieces,
    activePiece,
    setActivePiece,
    numClicks,
    setNumClicks,
  );

  return <div id="board">{board}</div>;
};

const createTerrainArray = (rows: number, cols: number): string[] => {
  const terrain: string[] = [];
  const colors = [
    features.City,
    features.Forest,
    features.Water,
    features.Mountain,
  ];
  for (let i = 0; i < rows * cols; i++) {
    terrain.push(colors[randomArrayIndexGenerator(colors.length)]);
  }

  return terrain;
};

const updateGameBoard = (
  terrainArray: string[],
  pieces: GamePiece[],
  setPieces: React.Dispatch<React.SetStateAction<GamePiece[]>>,
  activePiece: GamePiece | null,
  setActivePiece: React.Dispatch<React.SetStateAction<GamePiece | null>>,
  numClicks: number,
  setNumClicks: React.Dispatch<React.SetStateAction<number>>,
): ReactNode[] => {
  const board: ReactNode[] = [];
  const dieRollSelector = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;

    if (target.id === null) return;
    if (!target.id.startsWith("cell-")) return;
    if (target.id.split("-").length !== 3) return;

    const currentCellRow = parseInt(target.id.split("-")[1]);
    const currentCellCol = parseInt(target.id.split("-")[2]);

    // Return a piece on the current clicked cell or null
    const currentCellPiece = pieces.find((gamePiece) => {
      const position = gamePiece.getPosition();
      return position.row === currentCellRow && position.col === currentCellCol;
    });

    if (numClicks === 0) {
      setNumClicks(currentCellPiece ? 1 : 0);
      setActivePiece(currentCellPiece ? currentCellPiece : null);
    } else if (numClicks === 1) {
      setNumClicks(0);
      setActivePiece(null); // No piece for next round of clicks
    }

    if (numClicks === 1 && activePiece) {
      const activePiecePosition = activePiece.getPosition();
      const terrainOfCellToMoveTo =
        terrainArray[
          currentCellRow * 8 + currentCellCol
        ];

      const canMoveResultString = checkIfMoveIsValid(
        pieces,
        activePiece,
        { row: currentCellRow, col: currentCellCol },
        terrainOfCellToMoveTo,
      );

      if (canMoveResultString === "valid move") {
        const updatedPiecesArray = pieces.filter((gamePiece) => {
          const position = gamePiece.getPosition();
          return !(
            position.row === activePiecePosition.row &&
            position.col === activePiecePosition.col
          );
        });

        activePiece.move(currentCellRow, currentCellCol, terrainOfCellToMoveTo);
        updatedPiecesArray.push(activePiece);

        setPieces(updatedPiecesArray);
      } else if (canMoveResultString === "piece on square") {
        const dieRoll = sixSidedDie();

        const updatedPiecesArray = pieces.filter((gamePiece) => {
          const position = gamePiece.getPosition();
          return !(
            (position.row === activePiecePosition.row &&
              position.col === activePiecePosition.col) ||
            (position.row === currentCellRow && position.col === currentCellCol)
          );
        });

        dieRollSelector(setDieRollResult(dieRoll));

        const winningPiece = returnWinningPieceInAttack(
          activePiece,
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

      const cellText = piece
        ? piece.getPower() +
          " " +
          piece.getNumMovement() +
          " " +
          Math.trunc(piece.getMovementLeft() * 100) / 100
        : "";

      let cellColor: string = terrainArray[row * 8 + col];

      if (activePiece) {
        const activePiecePosition = activePiece.getPosition();

        if (
          activePiecePosition.row === row &&
          activePiecePosition.col === col &&
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
  activePiece: GamePiece | null,
  currentCell: { row: number; col: number },
  terrainOfCellToMoveTo: string,
): string => {
  const pieceOnCurrentClickedSquare = pieces.find((gamePiece) => {
    const position = gamePiece.getPosition();
    return position.row === currentCell.row && position.col === currentCell.col;
  });

  if (activePiece?.getMovementLeft() === 0) {
    return "invalid move";
  }

  const activePiecePosition = activePiece ? activePiece.getPosition() : null;

  if (
    activePiece &&
    activePiecePosition &&
    ((currentCell.row === activePiecePosition.row - 1 &&
      currentCell.col === activePiecePosition.col - 1) ||
      (currentCell.row === activePiecePosition.row - 1 &&
        currentCell.col === activePiecePosition.col) ||
      (currentCell.row === activePiecePosition.row - 1 &&
        currentCell.col === activePiecePosition.col + 1) ||
      (currentCell.row === activePiecePosition.row &&
        currentCell.col === activePiecePosition.col - 1) ||
      (currentCell.row === activePiecePosition.row &&
        currentCell.col === activePiecePosition.col + 1) ||
      (currentCell.row === activePiecePosition.row + 1 &&
        currentCell.col === activePiecePosition.col - 1) ||
      (currentCell.row === activePiecePosition.row + 1 &&
        currentCell.col === activePiecePosition.col) ||
      (currentCell.row === activePiecePosition.row + 1 &&
        currentCell.col === activePiecePosition.col + 1))
  ) {
    if (pieceOnCurrentClickedSquare) {
      return "piece on square";
    }

    const canMove = canActivePieceMoveToSquare(
      activePiece,
      terrainOfCellToMoveTo,
    );

    if (canMove) {
      return "valid move";
    }
  }

  return "invalid move";
};

/**
 * Checks if the piece can move to a square based on terrain and movement left of the piece.
 * @param activePiece, the piece that is currently being moved
 * @param terrainOfCellToMoveTo, feature of the square to move to
 * @returns whether the piece can move to the square
 */
const canActivePieceMoveToSquare = (
  activePiece: GamePiece,
  terrainOfCellToMoveTo: string,
): boolean => {
  if (terrainOfCellToMoveTo === features.Mountain) {
    return false;
  }

  if (
    activePiece.getMovementLeft() < 2 &&
    (terrainOfCellToMoveTo === features.Water ||
      terrainOfCellToMoveTo === features.Forest)
  ) {
    return false;
  }

  if (
    activePiece.getMovementLeft() < 1 / 3 &&
    terrainOfCellToMoveTo === features.City
  ) {
    return false;
  }

  return true;
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
