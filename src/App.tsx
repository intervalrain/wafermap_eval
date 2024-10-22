import WaferVisualizer from "./WaferVisualizer";

function App() {
  return (
    <div>
      <WaferVisualizer
        dieHeight={10}
        dieWidth={17}
        offsetX={5}
        offsetY={8.5}
       />
    </div>
  );
}

export default App;
