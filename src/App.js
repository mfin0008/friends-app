import logo from "./frontend/images/Friends-logo.png";
import "./App.css";
import {
  HStack,
  Divider,
  Center,
  ChakraProvider,
} from "@chakra-ui/react";
import FindAQuote from "./frontend/FindAQuote";
import InterestingFacts from "./frontend/InterestingFacts";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div height="100vh">
            <HStack>
              <FindAQuote />
              <Center height="80vh">
                <Divider
                  orientation="vertical"
                  borderColor="#d6d6d6"
                />
              </Center>
              <InterestingFacts/>
            </HStack>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
