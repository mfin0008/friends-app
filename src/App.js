import logo from "./frontend/images/Friends-logo.png";
import "./App.css";
import { HStack, Divider, Center, ChakraProvider } from "@chakra-ui/react";
import FindAQuote from "./frontend/FindAQuote";
import InterestingFacts from "./frontend/InterestingFacts";
import { useEffect } from "react";

const pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
});

const runScript = async (code) => {
    return await pyodide.runPythonAsync(code);
};

const runCode = async (scriptText) => {
    try {
        const out = await runScript(scriptText);
        console.log(out);
    }
    catch (err) {
        console.log(err);
    }
};

function App() {
    useEffect(() => {
        runCode(`
        def func():
          return "Hello from python (code)"
        func()
      `);
    }, []);

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
                            <Divider orientation="vertical" borderColor="#d6d6d6" />
                        </Center>
                        <InterestingFacts />
                    </HStack>
                </div>
            </div>
        </ChakraProvider>
    );
}

export default App;
