import { OvelayProvider } from "@youngduck/yd-ui/Overlays";
import Timer from "@timer/timer";

const App = () => {
  return (
    <OvelayProvider>
      <Timer />
    </OvelayProvider>
  );
};

export default App;

