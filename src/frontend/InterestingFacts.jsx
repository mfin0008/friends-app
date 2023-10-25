import { Button, Card, CardBody, VStack, Center, Text} from "@chakra-ui/react";
import { RepeatIcon } from '@chakra-ui/icons'


export default function InterestingFacts() {

    const handleFactRegeneration = (event) => {
        event.preventDefault();
        console.log("Picking some interesting facts!");
    }

    return (
        <Center width='50vw'>

            <VStack>

                <Text fontSize='4xl' margin='2vh 0'>Interesting Facts!</Text>

                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text><strong>The most viewed episode is:</strong></Text>
                            <Text><i>Season 2, episode 13</i> titled: <i>"The One After the Superbowl"</i></Text>
                            <Text>Airing on <i>1996-01-28</i> to <i>52.9 million</i> viewers</Text>
                        </VStack>
                    </CardBody>
                </Card>
                <Card width='45vw'backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text><strong>The season with the most cumulative views is:</strong></Text>
                            <Text><i>Season 10</i> with <i>600 million</i> total views!</Text>
                        </VStack>
                    </CardBody>
                </Card>
                <Card width='45vw' backgroundColor='#d6d6d6' margin='0 2vw 2vh 2vw'>
                    <CardBody>
                        <VStack>
                            <Text><strong>The director who directed the most episodes is:</strong></Text>
                            <Text><i>Gary Halvorson</i>, who directed <i>54</i> episodes!</Text>
                        </VStack>
                    </CardBody>
                </Card>

                <Button onClick={handleFactRegeneration} rightIcon={<RepeatIcon/>}>Regenerate facts</Button>

            </VStack>

        </Center>
    )
}