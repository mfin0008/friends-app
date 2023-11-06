import { Button, Card, CardBody, VStack, Center, Text, Divider } from "@chakra-ui/react";
import { RepeatIcon } from '@chakra-ui/icons'
import React, { useState, useEffect } from "react";


export default function InterestingFacts() {
    const [mostViewedEpisode, setMostViewedEpisode] = useState(null);
    const [mostViewedEpisodeSeason, setMostViewedEpisodeSeason] = useState(null);
    const [mostViewedSeason, setMostViewedSeason] = useState(null);
    const [mostProfilicDirector, setMostProfilicDirector] = useState(null);
    const [mostProfilicWriter, setMostProfilicWriter] = useState(null);
    const [highestRatedEpisode, setHighestRatedEpisode] = useState(null);
    const [lowestRatedEpisode, setLowestRatedEpisode] = useState(null);
    const [leastViewedEpisode, setLeastViewedEpisode] = useState(null);
    const [leastViewedEpisodeSeason, setLeastViewedEpisodeSeason] = useState(null);
    const [earliestAiredEpisode, setEarliestAiredEpisode] = useState(null);

    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [nextFact, setNextFact] = useState(0);
    const [nextFact2, setNextFact2] = useState(0);

    const facts = [
        { type: "mostViewedEpisode", text: "The most viewed episode is:" },
        { type: "mostViewedSeason", text: "The season with the most cumulative views is:" },
        { type: "mostProfilicDirector", text: "The director who directed the most episodes is:" },
        { type: "mostProfilicWriter", text: "The writers who wrote the most episodes is:" },
        { type: "highestRatedEpisode", text: "The highest rated episode is:" },
        { type: "leastRatedEpisode", text: "The lowest rated episode is:" },
        { type: "leastViewedEpisode", text: "The lowest viewed episode is:" },
        { type: "earliestAiredEpisode", text: "The first ever episode aired was:" }
    ];

    useEffect(() => {
        // Calculate the next index
        const nextIndex = currentFactIndex === 0 ? 7 : currentFactIndex - 1;

        // Set the next fact in the state
        setNextFact(facts[nextIndex]);
    }, [currentFactIndex]);

    useEffect(() => {
        // Calculate the next index
        let nextIndex;
        if (currentFactIndex === 0) {
            nextIndex = 6;
        } else if (currentFactIndex === 1) {
            nextIndex = 7;
        } else {
            nextIndex = currentFactIndex - 2;
        }

        // Set the next fact in the state
        setNextFact2(facts[nextIndex]);
    }, [currentFactIndex]);

    const regenerateFacts = () => {
        // Generate a random index within the range of facts
        const randomIndex = Math.floor(Math.random() * facts.length);

        // Update currentFactIndex with the random index
        setCurrentFactIndex(randomIndex);
    };


    // const handleFactRegeneration = (event) => {
    //     event.preventDefault();
    //     console.log("Picking some interesting facts!");
    // }

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/most-viewed-episode")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data:", data);
                setMostViewedEpisode(data.mostViewedEpisode);
                setMostViewedEpisodeSeason(data.mostViewedEpisodeSeason);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/most-viewed-season")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data2:", data);
                setMostViewedSeason(data.mostViewedSeason);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/most-profilic-director")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data3:", data);
                setMostProfilicDirector(data.mostProfilicDirector);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/most-profilic-writer")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data4:", data);
                setMostProfilicWriter(data.mostProfilicWriter);
            })
            .catch((error) => console.error(error));
    }, []);


    useEffect(() => {
        fetch("http://localhost:8000/neo4j/highest-rated-episode")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data5:", data);
                setHighestRatedEpisode(data.highestRatedEpisode);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/lowest-rated-episode")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data6:", data);
                setLowestRatedEpisode(data.lowestRatedEpisode);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/least-viewed-episode")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data7:", data);
                setLeastViewedEpisode(data.leastViewedEpisode);
                setLeastViewedEpisodeSeason(data.leastViewedEpisodeSeason);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/neo4j/earliest-aired-episode")
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data8:", data);
                setEarliestAiredEpisode(data.earliestAiredEpisode);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <Center width='50vw'>

            <VStack>

                <Text fontSize='4xl' margin='2vh 0'>Interesting Facts!</Text>

                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text><strong>{facts[currentFactIndex].text}</strong></Text>
                            {currentFactIndex === 0 && mostViewedEpisode && (
                                <>
                                    <Text><i>Season {mostViewedEpisodeSeason.season_num.low}, episode {mostViewedEpisode.episode_num.low}</i> titled: <i>"{mostViewedEpisode.title}"</i></Text>
                                    <Text>Airing on <i>{mostViewedEpisode.air_date}</i> to <i>{mostViewedEpisode.views} million</i> viewers</Text>
                                </>
                            )}
                            {currentFactIndex === 1 && mostViewedSeason && (
                                <>
                                    <Text><i>Season {mostViewedSeason.season_num.low} with</i> <i>{Math.round(mostViewedSeason.cumulative_views)} million</i> total views!</Text>
                                </>
                            )}
                            {currentFactIndex === 2 && mostProfilicDirector && (
                                <>
                                    <Text><i>{mostProfilicDirector.name}</i>, who directed <i>{mostProfilicDirector.directedEpisodes}</i> episodes!</Text>
                                </>
                            )}
                            {currentFactIndex === 3 && mostProfilicWriter && (
                                <>
                                    <Text><i>{mostProfilicWriter.name}</i>, who wrote <i>{mostProfilicWriter.writtenEpisodes}</i> episodes!</Text>
                                </>
                            )}
                            {currentFactIndex === 4 && highestRatedEpisode && (
                                <>
                                    <Text><i>Season {highestRatedEpisode.season_num.low}, episode {highestRatedEpisode.episode.episode_num.low}</i>, titled <i>"{highestRatedEpisode.episode.title}"</i>, rated <i>{highestRatedEpisode.episode.rating}</i> on IMDB!</Text>
                                </>
                            )}
                            {currentFactIndex === 5 && lowestRatedEpisode && (
                                <>
                                    <Text><i>Season {lowestRatedEpisode.season_num.low}, episode {lowestRatedEpisode.episode.episode_num.low}</i>, titled <i>"{lowestRatedEpisode.episode.title}"</i>, rated <i>{lowestRatedEpisode.episode.rating}</i> on IMDB!</Text>
                                </>
                            )}
                            {currentFactIndex === 6 && mostViewedEpisode && (
                                <>
                                    <Text><i>Season {leastViewedEpisodeSeason.season_num.low}, episode {leastViewedEpisode.episode_num.low}</i> titled: <i>"{leastViewedEpisode.title}"</i></Text>
                                    <Text>Airing on <i>{leastViewedEpisode.air_date}</i> to <i>{leastViewedEpisode.views} million</i> viewers</Text>
                                </>
                            )}
                            {currentFactIndex === 7 && lowestRatedEpisode && (
                                <>
                                    <Text><i>Season {earliestAiredEpisode.season_num.low}, episode {earliestAiredEpisode.episode.episode_num.low}</i>, titled <i>"{earliestAiredEpisode.episode.title}"</i>, on <i>{earliestAiredEpisode.episode.air_date}</i></Text>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text><strong>{nextFact.text}</strong></Text>
                            {currentFactIndex === 1 && mostViewedEpisode && (
                                <>
                                    <Text><i>Season {mostViewedEpisodeSeason.season_num.low}, episode {mostViewedEpisode.episode_num.low}</i> titled: <i>"{mostViewedEpisode.title}"</i></Text>
                                    <Text>Airing on <i>{mostViewedEpisode.air_date}</i> to <i>{mostViewedEpisode.views} million</i> viewers</Text>
                                </>
                            )}
                            {currentFactIndex === 2 && mostViewedSeason && (
                                <>
                                    <Text><i>Season {mostViewedSeason.season_num.low} with</i> <i>{Math.round(mostViewedSeason.cumulative_views)} million</i> total views!</Text>
                                </>
                            )}
                            {currentFactIndex === 3 && mostProfilicDirector && (
                                <>
                                    <Text><i>{mostProfilicDirector.name}</i>, who directed <i>{mostProfilicDirector.directedEpisodes}</i> episodes!</Text>
                                </>
                            )}
                            {currentFactIndex === 4 && mostProfilicWriter && (
                                <>
                                    <Text><i>{mostProfilicWriter.name}</i>, who wrote <i>{mostProfilicWriter.writtenEpisodes}</i> episodes!</Text>
                                </>
                            )}
                            {currentFactIndex === 5 && highestRatedEpisode && (
                                <>
                                    <Text><i>Season {highestRatedEpisode.season_num.low}, episode {highestRatedEpisode.episode.episode_num.low}</i>, titled <i>"{highestRatedEpisode.episode.title}"</i>, rated <i>{highestRatedEpisode.episode.rating}</i> on IMDB!</Text>
                                </>
                            )}
                            {currentFactIndex === 6 && lowestRatedEpisode && (
                                <>
                                    <Text><i>Season {lowestRatedEpisode.season_num.low}, episode {lowestRatedEpisode.episode.episode_num.low}</i>, titled <i>"{lowestRatedEpisode.episode.title}"</i>, rated <i>{lowestRatedEpisode.episode.rating}</i> on IMDB!</Text>
                                </>
                            )}
                            {currentFactIndex === 7 && mostViewedEpisode && (
                                <>
                                    <Text><i>Season {leastViewedEpisodeSeason.season_num.low}, episode {leastViewedEpisode.episode_num.low}</i> titled: <i>"{leastViewedEpisode.title}"</i></Text>
                                    <Text>Airing on <i>{leastViewedEpisode.air_date}</i> to <i>{leastViewedEpisode.views} million</i> viewers</Text>
                                </>
                            )}
                            {currentFactIndex === 0 && lowestRatedEpisode && (
                                <>
                                    <Text><i>Season {earliestAiredEpisode.season_num.low}, episode {earliestAiredEpisode.episode.episode_num.low}</i>, titled <i>"{earliestAiredEpisode.episode.title}"</i>, on <i>{earliestAiredEpisode.episode.air_date}</i></Text>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text><strong>{nextFact2.text}</strong></Text>
                            {currentFactIndex === 2 && mostViewedEpisode && (
                                <>
                                    <Text><i>Season {mostViewedEpisodeSeason.season_num.low}, episode {mostViewedEpisode.episode_num.low}</i> titled: <i>"{mostViewedEpisode.title}"</i></Text>
                                    <Text>Airing on <i>{mostViewedEpisode.air_date}</i> to <i>{mostViewedEpisode.views} million</i> viewers</Text>
                                </>
                            )}
                            {currentFactIndex === 3 && mostViewedSeason && (
                                <>
                                    <Text><i>Season {mostViewedSeason.season_num.low} with</i> <i>{Math.round(mostViewedSeason.cumulative_views)} million</i> total views!</Text>
                                </>
                            )}
                            {currentFactIndex === 4 && mostProfilicDirector && (
                                <>
                                    <Text><i>{mostProfilicDirector.name}</i>, who directed <i>{mostProfilicDirector.directedEpisodes}</i> episodes!</Text>
                                </>
                            )}
                            {currentFactIndex === 5 && mostProfilicWriter && (
                                <>
                                    <Text><i>{mostProfilicWriter.name}</i>, who wrote <i>{mostProfilicWriter.writtenEpisodes}</i> episodes!</Text>
                                </>
                            )}
                            {currentFactIndex === 6 && highestRatedEpisode && (
                                <>
                                    <Text><i>Season {highestRatedEpisode.season_num.low}, episode {highestRatedEpisode.episode.episode_num.low}</i>, titled <i>"{highestRatedEpisode.episode.title}"</i>, rated <i>{highestRatedEpisode.episode.rating}</i> on IMDB!</Text>
                                </>
                            )}
                            {currentFactIndex === 7 && lowestRatedEpisode && (
                                <>
                                    <Text><i>Season {lowestRatedEpisode.season_num.low}, episode {lowestRatedEpisode.episode.episode_num.low}</i>, titled <i>"{lowestRatedEpisode.episode.title}"</i>, rated <i>{lowestRatedEpisode.episode.rating}</i> on IMDB!</Text>
                                </>
                            )}
                            {currentFactIndex === 0 && mostViewedEpisode && (
                                <>
                                    <Text><i>Season {leastViewedEpisodeSeason.season_num.low}, episode {leastViewedEpisode.episode_num.low}</i> titled: <i>"{leastViewedEpisode.title}"</i></Text>
                                    <Text>Airing on <i>{leastViewedEpisode.air_date}</i> to <i>{leastViewedEpisode.views} million</i> viewers</Text>
                                </>
                            )}
                            {currentFactIndex === 1 && lowestRatedEpisode && (
                                <>
                                    <Text><i>Season {earliestAiredEpisode.season_num.low}, episode {earliestAiredEpisode.episode.episode_num.low}</i>, titled <i>"{earliestAiredEpisode.episode.title}"</i>, on <i>{earliestAiredEpisode.episode.air_date}</i></Text>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                <Button onClick={regenerateFacts} rightIcon={<RepeatIcon />}>
                    Regenerate facts
                </Button>

                <Divider />

                <Text m="2vh 2vw">In memory of Matthew Perry, a fantastically talented individual whose work continues to bring smiles to faces worldwide.</Text>

            </VStack>

        </Center>
    )
}