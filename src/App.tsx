import "./App.css";
import DieComponent from "./components/DieComponent";
import Game from "./game/game";
import ResolutionCard from "./resolutionCard/resolutionCard";

function App() {
  return (
    <>
      <section id="header">
        <h1 className="title">Tactics Game</h1>
      </section>
      <section id="body">
        <Game />
        <div id="conflict-resolution-components">
          <ResolutionCard />
          <DieComponent />
        </div>
      </section>
      <section id="footer"></section>
    </>
  );
}

export default App;
