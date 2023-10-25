import { Button, Card, CardBody, Center, Divider, FormControl, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiShuffle } from "react-icons/bi";


export default function FindAQuote() {

    const [season, setSeason] = useState(1);
    const maxSeason = 10;
    const [episode, setEpisode] = useState(1);
    const [maxEpisode, setMaxEpisode] = useState(Number.MAX_SAFE_INTEGER);
    const [scene, setScene] = useState(1);
    const [maxScene, setMaxScene] = useState(Number.MAX_SAFE_INTEGER);
    const [utterance, setUtterance] = useState(1);
    const [maxUtterance, setMaxUtterance] = useState(Number.MAX_SAFE_INTEGER);

    const handleQuoteSubmission = (event) => {
        event.preventDefault();
        console.log(`
            Season: ${season}\n
            Episode: ${episode}\n
            Scene: ${scene}\n
            Utterance: ${utterance}
        `);
    }

    const pickRandomValues = (event) => {
        setSeason(Math.ceil(Math.random() * maxSeason));
        setEpisode(Math.ceil(Math.random() * maxEpisode));
        setScene(Math.ceil(Math.random() * maxScene));
        setUtterance(Math.ceil(Math.random() * maxUtterance));

        handleQuoteSubmission(event);
    }

    const getMaximumValues = () => {
        // interacts with the cassandra database to find the maximum value for the number input of :
        // episode
        setMaxEpisode(Number.MAX_SAFE_INTEGER);
        // scene
        setMaxScene(Number.MAX_SAFE_INTEGER);
        // utterance
        setMaxUtterance(Number.MAX_SAFE_INTEGER);
    }

    return (
        <Center width='50vw'>

            <VStack>

                <Text fontSize='4xl' margin='2vh 0'>Find A Quote!</Text>

                <form onSubmit={handleQuoteSubmission}>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select a season:</Text>
                        <FormControl>
                            <NumberInput size='sm' width='10vw' min={1} max={maxSeason} value={season} onChange={(value) => { setSeason(value); setEpisode(1); setScene(1); setUtterance(1); getMaximumValues(); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </HStack>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select an episode:</Text>
                        <FormControl>
                            <NumberInput size='sm' width='10vw' min={1} max={maxEpisode} value={episode} onChange={(value) => { setEpisode(value); setScene(1); setUtterance(1); getMaximumValues(); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </HStack>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select a scene:</Text>
                        <FormControl>
                            <NumberInput size='sm' width='10vw' min={1} max={maxScene} value={scene} onChange={(value) => { setScene(value); setUtterance(1); getMaximumValues(); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </HStack>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select an utterance number:</Text>
                        <FormControl>
                            <NumberInput size='sm' width='10vw' min={1} max={maxUtterance} value={utterance} onChange={(value) => { setUtterance(value); getMaximumValues(); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </HStack>
                    <Button type="submit" marginTop='2vh'>Show Quote</Button>
                </form>

                <Divider margin='1vh 0'/>

                <Text>OR</Text>

                <Button onClick={pickRandomValues} rightIcon={<BiShuffle/>}>Find a random quote</Button>

                <Divider  margin='1vh 0'/>

                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                                <Text fontSize={30}>"</Text>
                                <Text>This is not the right text.</Text>
                                <Text fontSize={30}>"</Text>
                                <Text>- Monica Geller</Text>
                        </VStack>
                        
                    </CardBody>
                </Card>

            </VStack>

        </Center>
    )
}