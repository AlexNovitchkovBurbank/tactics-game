import { useSelector } from "react-redux";
import type { RootState } from "../redux/dieRollStore";
import "./dieComponent.css";

const DieComponent = () => {
  const dieRollResult = useSelector(
    (state: RootState) => state.dieRollResult.value,
  );
  return (
    <div id="die-component">
      <p>
        {dieRollResult !== 0
          ? `Die Roll Result: ${dieRollResult}`
          : "Roll the die"}
      </p>
    </div>
  );
};

export default DieComponent;
