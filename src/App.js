import logo from "./frontend/images/Friends-logo.png";
import "./App.css";
import cassandraInitialiser from "./python/cassandra/cassandraInitialiser.py";
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

const runFile = async (fileName) => {
    const scriptText = await (await fetch(fileName)).text();
    try {
        const out = await runScript(scriptText);
        console.log(out);
    }
    catch (err) {
        console.log(err);
    }
};

const initialiseCassandra = () => {
    const {exec} = require('child_process');

    exec('python ./python/cassandra/cassandraInitialiser.py', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
}

function App() {
    useEffect(() => {
        runCode(`
        def func():
          return "Hello from python (code)"
        func()
      `);
    }, []);

    useEffect(() => {
        runFile(cassandraInitialiser);
    }, []);

    initialiseCassandra();

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
