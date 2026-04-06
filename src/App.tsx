import "./App.css";
import Game from "./game/game";
import ResolutionCard from "./resolutionCard/resolutionCard";

function App() {
  return (
    <>
      <section id="header"></section>
      <section id="body">
        <Game />
        <ResolutionCard />
      </section>
      <section id="footer"></section>
    </>
  );
}

export default App;
