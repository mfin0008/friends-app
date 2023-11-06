import { Button, Card, CardBody, Center, Divider, Spinner, Table, TableContainer, Tbody, Td, Text, Tr, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiShuffle } from "react-icons/bi";


export default function FindAQuote() {

    const [season, setSeason] = useState(1);
    const [seasonIsLoading, setSeasonIsLoading] = useState(false);
    const [episode, setEpisode] = useState(1);
    const [episodeIsLoading, setEpisodeIsLoading] = useState(false);
    const [scene, setScene] = useState(1);
    const [sceneIsLoading, setSceneIsLoading] = useState(false);
    const [utterance, setUtterance] = useState(1);
    const [utteranceIsLoading, setUtteranceIsLoading] = useState(false);

    const [quote, setQuote] = useState("Your quote will appear here.");
    const [quoteSpeaker, setQuoteSpeaker] = useState("The speaker will appear here");
    const [quoteIsLoading, setQuoteIsLoading] = useState(false);

    const handleQuoteSubmission = (event, utteranceInfo) => {
        event.preventDefault();
        console.log(utteranceInfo);
        fetch(`http://localhost:8000/cassandra/get-utterance-id?season_number=${utteranceInfo['season']}&episode_number=${utteranceInfo['episode']}&scene_number=${utteranceInfo['scene']}&utterance_number=${utteranceInfo['utterance']}`,
            {
                method: 'get'
            }
        ).then((res) => res.json()).then((res) => {
            const utterance_id = res.utterance_id
            fetch(`http://localhost:8000/mongodb/get-quote?utterance_id=${utterance_id}`,
                {
                    method: 'get'
                }
            ).then((res) => res.json()).then((res) => {
                console.log(res);
                setQuote(res.quote);
                setQuoteSpeaker(res.speaker);
                setQuoteIsLoading(false);
            })
        })
    }

    const pickRandomValues = (event) => {
        setQuoteIsLoading(true);
        setSeasonIsLoading(true);
        setEpisodeIsLoading(true);
        setSceneIsLoading(true);
        setUtteranceIsLoading(true);
        const utteranceInfo = {
            "season": 1,
            "episode": 1, 
            "scene": 1,
            "utterance": 1
        }
        let MAX_SEASON = 10;
        let MAX_EPISODE = Number.MAX_SAFE_INTEGER;
        let MAX_SCENE = Number.MAX_SAFE_INTEGER;
        let MAX_UTTERANCE = Number.MAX_SAFE_INTEGER;
        utteranceInfo['season'] = Math.ceil(Math.random() * MAX_SEASON)
        setSeason(utteranceInfo['season']);
        setSeasonIsLoading(false);
        console.log('fetching number of episodes')
        // updating the maximum episode
        fetch(`http://localhost:8000/cassandra/get-num-episodes?season_number=${utteranceInfo['season']}`,
            {
                method: 'get'
            }
        ).then((res) => res.json()).then((res) => {
            MAX_EPISODE = res.episode_count;
        }).then(() => {
            utteranceInfo['episode'] = Math.ceil(Math.random() * MAX_EPISODE)
            setEpisode(utteranceInfo['episode']);
            setEpisodeIsLoading(false);
        }).then(() => {
            console.log('fetching number of scenes')
            // updating the maximum scene
            fetch(`http://localhost:8000/cassandra/get-num-scenes?season_number=${utteranceInfo['season']}&episode_number=${utteranceInfo['episode']}`,
                {
                    method: 'get'
                }
            ).then((res) => res.json()).then((res) => {
                MAX_SCENE = res.scene_count;
            }).then(() => {
                utteranceInfo['scene'] = Math.ceil(Math.random() * MAX_SCENE)
                setScene(utteranceInfo['scene']);
                setSceneIsLoading(false);
            }).then(() => {
                console.log('fetching number of utterances')
                // updating the maximum utterances
                fetch(`http://localhost:8000/cassandra/get-num-utterances?season_number=${utteranceInfo['season']}&episode_number=${utteranceInfo['episode']}&scene_number=${utteranceInfo['scene']}`,
                    {
                        method: 'get'
                    }
                ).then((res) => res.json()).then((res) => {
                    MAX_UTTERANCE = res.utterance_count;
                    utteranceInfo['utterance'] = Math.ceil(Math.random() * MAX_UTTERANCE)
                    setUtterance(utteranceInfo['utterance']);
                    setUtteranceIsLoading(false);
                    handleQuoteSubmission(event, utteranceInfo);
                })
            })
        })

    }


    return (
        <Center width='50vw'>

            <VStack>

                <Text fontSize='4xl' margin='2vh 0'>Find A Quote!</Text>

                <TableContainer>
                    <Table variant='simple' size='sm'>
                        <Tbody>
                            <Tr>
                                <Td><Text minW='20vw' margin='1vh 0' align='left'>Season number:</Text></Td>
                                <Td>{season}</Td>
                                <Td><Spinner color={seasonIsLoading ? "gray" : "white"} /></Td>
                            </Tr>
                            <Tr>
                                <Td><Text minW='20vw' margin='1vh 0' align='left'>Episode number:</Text></Td>
                                <Td>{episode}</Td>
                                <Td><Spinner color={episodeIsLoading ? "gray" : "white"} /></Td>
                            </Tr>
                            <Tr>
                                <Td><Text minW='20vw' margin='1vh 0' align='left'>Scene number:</Text></Td>
                                <Td>{scene}</Td>
                                <Td><Spinner color={sceneIsLoading ? "gray" : "white"} /></Td>
                            </Tr>
                            <Tr>
                                <Td><Text minW='20vw' margin='1vh 0' align='left'>Utterance number:</Text></Td>
                                <Td>{utterance}</Td>
                                <Td><Spinner color={utteranceIsLoading ? "gray" : "white"} /></Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>

                <Divider margin='1vh 0' />

                <Button isDisabled={quoteIsLoading} onClick={pickRandomValues} rightIcon={<BiShuffle />}>Randomly Generate Quote</Button>

                <Divider margin='1vh 0' />

                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text fontSize={30}>"</Text>
                            <Text>{quoteIsLoading ? "..." : quote}</Text>
                            <Text fontSize={30}>"</Text>
                            <Text>- {quoteIsLoading ? "..." : quoteSpeaker}</Text>
                        </VStack>

                    </CardBody>
                </Card>

            </VStack>

        </Center>
    )
}