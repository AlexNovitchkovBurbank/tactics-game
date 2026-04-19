import "./resolutionCard.css";

const resolutionCard = () => {
  const card = {
    title: "Resolution Card",
    description:
      "If the player moving pieces has piece(s) adjacent to piece(s) of the other player, they can choose to attack them. This card determines the outcome. The first number in the odds column is the attackers power. Ex: 6-1 means 6 attacking power to 1 defending power. Just add up all powers for each side if more than 2 pieces in conflict.",
    rows: [
      {
        odds: "6-1",
        1: "The defending piece is removed from the board. Attacking piece power remains the same.",
        2: "The defending piece is removed from the board. Attacking piece power reduces by 1.",
        5: "The defending piece is removed from the board. Attacking piece power reduces by 1.",
        6: "The defending piece is removed from the board. Attacking piece power remains the same.",
      },
      {
        odds: "1-6",
        1: "The attacking piece is removed from the board. Defending piece power remains the same.",
        2: "The attacking piece is removed from the board. Defending piece power reduces by 1.",
        5: "The attacking piece is removed from the board. Defending piece power reduces by 1.",
        6: "The attacking piece is removed from the board. Defending piece power remains the same.",
      },
    ],
  };

  return (
    <div id="resolution-card">
      <h2 className="title">{card.title}</h2>
      <p className="description">{card.description}</p>
      <table>
        <thead>
          <tr>
            <th>Odds</th>
            <th>Die roll of 1</th>
            <th>Die roll of 2</th>
          </tr>
        </thead>
        <tbody>
          {card.rows.map((row, index) => (
            <tr key={index}>
              <td>{row.odds}</td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default resolutionCard;
