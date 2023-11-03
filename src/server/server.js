const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* CASSANDRA */

// initialise the cassandra database
app.listen(8000, () => {
    const { exec } = require("child_process");

    exec(
        "python ./python/cassandra/cassandraInitialiser.py",
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log("Cassandra initialisation complete.");
        }
    );
});

// get the number of episodes in a given season
app.get("/cassandra/get-num-episodes", (req, res) => {
    const { exec } = require("child_process");

    const season_number = req.query.season_number;
    console.log(`Finding the number of episodes in season ${season_number}`);

    exec(
        `python ./python/cassandra/getEpisodeCount.py ${season_number}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            const episode_count = parseInt(stdout);
            console.log(`Number of episodes is ${episode_count}`);
            res.send({ episode_count: episode_count });
        }
    );
});

// get the number of scenes in a given episodes
app.get("/cassandra/get-num-scenes", (req, res) => {
    const { exec } = require("child_process");

    const season_number = req.query.season_number;
    const episode_number = req.query.episode_number;

    console.log(
        `Finding the number of scenes in season ${season_number}, episode ${episode_number}`
    );

    exec(
        `python ./python/cassandra/getSceneCount.py ${season_number} ${episode_number}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            const scene_count = parseInt(stdout);
            console.log(`Number of scenes is ${scene_count}`);
            res.send({ scene_count: scene_count });
        }
    );
});

// get the number of utterances in a given scene
app.get("/cassandra/get-num-utterances", (req, res) => {
    const { exec } = require("child_process");

    const season_number = req.query.season_number;
    const episode_number = req.query.episode_number;
    const scene_number = req.query.scene_number;

    console.log(
        `Finding the number of utterances in season ${season_number}, episode ${episode_number}, scene ${scene_number}`
    );

    exec(
        `python ./python/cassandra/getUtteranceCount.py ${season_number} ${episode_number} ${scene_number}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            const utterance_count = parseInt(stdout);
            console.log(`Number of utterances is ${utterance_count}`);
            res.send({ utterance_count: utterance_count });
        }
    );
});

// get the number of utterances in a given scene
app.get("/cassandra/get-utterance-id", (req, res) => {
    const { exec } = require("child_process");

    const season_number = req.query.season_number;
    const episode_number = req.query.episode_number;
    const scene_number = req.query.scene_number;
    const utterance_number = req.query.utterance_number;

    console.log(
        `Finding the utterance_id for season ${season_number}, episode ${episode_number}, scene ${scene_number}, utterance ${utterance_number}`
    );

    exec(
        `python ./python/cassandra/getUtteranceId.py ${season_number} ${episode_number} ${scene_number} ${utterance_number}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            const utterance_id = parseInt(stdout);
            console.log(`utterance_id is ${utterance_id}`);
            res.send({ utterance_id: utterance_id });
        }
    );
});


/* MONGODB */

/* NEO4J */
