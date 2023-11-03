import { Button, Card, CardBody, Center, Divider, FormControl, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiShuffle } from "react-icons/bi";


export default function FindAQuote() {

    const [season, setSeason] = useState(1);
    const [seasonIsLoading, setSeasonIsLoading] = useState(false);
    const maxSeason = 10;
    const [episode, setEpisode] = useState(1);
    const [episodeIsLoading, setEpisodeIsLoading] = useState(false);
    const [maxEpisode, setMaxEpisode] = useState(Number.MAX_SAFE_INTEGER);
    const [scene, setScene] = useState(1);
    const [sceneIsLoading, setSceneIsLoading] = useState(false);
    const [maxScene, setMaxScene] = useState(Number.MAX_SAFE_INTEGER);
    const [utterance, setUtterance] = useState(1);
    const [utteranceIsLoading, setUtteranceIsLoading] = useState(false);
    const [maxUtterance, setMaxUtterance] = useState(Number.MAX_SAFE_INTEGER);

    const [quote, setQuote] = useState("Your quote will appear here.");
    const [quoteSpeaker, setQuoteSpeaker] = useState("The speaker will appear here");

    const handleQuoteSubmission = (event) => {
        event.preventDefault();
        console.log(`
            Season: ${season}\n
            Episode: ${episode}\n
            Scene: ${scene}\n
            Utterance: ${utterance}
        `);
        fetch(`http://localhost:8000/cassandra/get-utterance-id?season_number=${season}&episode_number=${episode}&scene_number=${scene}&utterance_number=${utterance}`,
            {
                method: 'get'
            }
        ).then((res) => res.json()).then((res) => {
            setQuote(`Utterance id = ${res.utterance_id}`)
        })
    }

    const pickRandomValues = () => {
        setSeasonIsLoading(true);
        setEpisodeIsLoading(true);
        setSceneIsLoading(true);
        setUtteranceIsLoading(true);
        let newSeason = 1;
        let maxSeason = 10;
        let newEpisode = 1;
        let maxEpisode = Number.MAX_SAFE_INTEGER;
        let newScene = 1;
        let maxScene = Number.MAX_SAFE_INTEGER;
        let newUtterance = 1;
        let maxUtterance = Number.MAX_SAFE_INTEGER;
        newSeason = Math.ceil(Math.random() * maxSeason)
        setSeason(newSeason);
        setSeasonIsLoading(false);
        console.log('fetching number of episodes')
        // updating the maximum episode
        fetch(`http://localhost:8000/cassandra/get-num-episodes?season_number=${newSeason}`,
            {
                method: 'get'
            }
        ).then((res) => res.json()).then((res) => {
            setMaxEpisode(res.episode_count);
            maxEpisode = res.episode_count;
        }).then(() => {
            newEpisode = Math.ceil(Math.random() * maxEpisode)
            setEpisode(newEpisode);
            setEpisodeIsLoading(false);
        }).then(() => {
            console.log('fetching number of scenes')
            // updating the maximum scene
            fetch(`http://localhost:8000/cassandra/get-num-scenes?season_number=${newSeason}&episode_number=${newEpisode}`,
                {
                    method: 'get'
                }
            ).then((res) => res.json()).then((res) => {
                setMaxScene(res.scene_count);
                maxScene = res.scene_count;
            }).then(() => {
                newScene = Math.ceil(Math.random() * maxScene)
                setScene(newScene);
                setSceneIsLoading(false);
            }).then(() => {
                console.log('fetching number of utterances')
                // updating the maximum utterances
                fetch(`http://localhost:8000/cassandra/get-num-utterances?season_number=${newSeason}&episode_number=${newEpisode}&scene_number=${newScene}`,
                    {
                        method: 'get'
                    }
                ).then((res) => res.json()).then((res) => {
                    setMaxUtterance(res.utterance_count);
                    maxUtterance = res.utterance_count;
                    newUtterance = Math.ceil(Math.random() * maxUtterance)
                    setUtterance(newUtterance);
                    setUtteranceIsLoading(false);
                })
            })
        })

    }


    return (
        <Center width='50vw'>

            <VStack>

                <Text fontSize='4xl' margin='2vh 0'>Find A Quote!</Text>

                <form onSubmit={handleQuoteSubmission}>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select a season:</Text>
                        <FormControl>
                            <NumberInput isDisabled={true} size='sm' width='10vw' min={1} max={maxSeason} value={season} onChange={(value) => { setSeason(value); setEpisode(1); setScene(1); setUtterance(1); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <Spinner color={seasonIsLoading ? "gray" : "white"} />
                    </HStack>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select an episode:</Text>
                        <FormControl>
                            <NumberInput isDisabled={true} size='sm' width='10vw' min={1} max={maxEpisode} value={episode} onChange={(value) => { setEpisode(value); setScene(1); setUtterance(1); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <Spinner color={episodeIsLoading ? "gray" : "white"} />
                    </HStack>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select a scene:</Text>
                        <FormControl>
                            <NumberInput isDisabled={true} size='sm' width='10vw' min={1} max={maxScene} value={scene} onChange={(value) => { setScene(value); setUtterance(1); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <Spinner color={sceneIsLoading ? "gray" : "white"} />
                    </HStack>
                    <HStack>
                        <Text minW='20vw' margin='1vh 0' align='left'>Select an utterance number:</Text>
                        <FormControl>
                            <NumberInput isDisabled={true} size='sm' width='10vw' min={1} max={maxUtterance} value={utterance} onChange={(value) => { setUtterance(value); }}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <Spinner color={utteranceIsLoading ? "gray" : "white"} />
                    </HStack>
                    <Button type="submit" marginTop='2vh' isDisabled={seasonIsLoading || episodeIsLoading || sceneIsLoading || utteranceIsLoading}>Show Quote</Button>
                </form>

                <Divider margin='1vh 0' />

                <Text>OR</Text>

                <Button onClick={pickRandomValues} rightIcon={<BiShuffle />} isDisabled={seasonIsLoading || episodeIsLoading || sceneIsLoading || utteranceIsLoading}>Randomly Fill Values</Button>

                <Divider margin='1vh 0' />

                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text fontSize={30}>"</Text>
                            <Text>{quote}</Text>
                            <Text fontSize={30}>"</Text>
                            <Text>- {quoteSpeaker}</Text>
                        </VStack>

                    </CardBody>
                </Card>

            </VStack>

        </Center>
    )
}