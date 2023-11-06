const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* CASSANDRA */

// initialise the databases
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

    exec(
        "python ./python/mongodb/mongodbInitialiser.py",
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log("MongoDB initialisation complete.");
        }
    );

    exec("python ./python/neo4j/neo4jInitialiser.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log("Neo4j initialisation complete.");
    });
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
app.get("/mongodb/get-quote", (req, res) => {
    const {exec} = require("child_process");

    const utterance_id = req.query.utterance_id;

    console.log(`Finding the quote for utterance_id of ${utterance_id}.`);

    exec(
        `python ./python/mongodb/getQuote.py ${utterance_id}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            const utterance = stdout.split(`@`);
            console.log(`quote is: "${utterance[0]}"- ${utterance[1]}`);
            res.send({ quote: `${utterance[0]}`, speaker: `${utterance[1]}` });
        }
    )
})

/* NEO4J */
const neo4j = require("neo4j-driver");

// Initialise the Neo4j driver
const neo4jUri = "bolt://localhost:7687";
const neo4jUser = "neo4j";
const neo4jPassword = "neo4jgraph";
const neo4jdriver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Get the most viewed episode
app.get("/neo4j/most-viewed-episode", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
        MATCH (e:Episode)-[:IN]->(s:Season)
        RETURN e, s
        ORDER BY e.views DESC
        LIMIT 1
      `);

        const mostViewedEpisode = result.records[0].get("e").properties;
        const mostViewedEpisodeSeason = result.records[0].get("s").properties;

        res.json({ mostViewedEpisode, mostViewedEpisodeSeason });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the season with the highest cumulative views
app.get("/neo4j/most-viewed-season", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
      MATCH (e:Episode)-[:IN]->(s:Season)
      RETURN s, SUM(e.views) AS cumulativeViews
      ORDER BY cumulativeViews DESC
      LIMIT 1
    `);

        const mostViewedSeason = {
            season_num: result.records[0].get("s").properties.season_num,
            cumulative_views: result.records[0].get("cumulativeViews"),
        };

        res.json({ mostViewedSeason });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the director who directed the most episodes
app.get("/neo4j/most-profilic-director", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
        MATCH (e:Episode)-[:DIRECTED_BY]->(c:CrewMember)
        RETURN c, COUNT(e) AS directedEpisodes
        ORDER BY directedEpisodes DESC
        LIMIT 1
      `);

        const mostProfilicDirector = {
            name: result.records[0].get("c").properties.name,
            directedEpisodes: result.records[0].get("directedEpisodes").toNumber(),
        };

        res.json({ mostProfilicDirector });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the writer who wrote the most episodes
app.get("/neo4j/most-profilic-writer", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
        MATCH (e:Episode)-[:WRITTEN_BY]->(c:CrewMember)
        RETURN c, COUNT(e) AS writtenEpisodes
        ORDER BY writtenEpisodes DESC
        LIMIT 1
      `);

        const mostProfilicWriter = {
            name: result.records[0].get("c").properties.name,
            writtenEpisodes: result.records[0].get("writtenEpisodes").toNumber(),
        };

        res.json({ mostProfilicWriter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the highest-rated episode
app.get("/neo4j/highest-rated-episode", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
          MATCH (e:Episode)-[:IN]->(s:Season)
          RETURN e, s
          ORDER BY e.rating DESC
          LIMIT 1
      `);

        const highestRatedEpisode = {
            episode: result.records[0].get("e").properties,
            season_num: result.records[0].get("s").properties.season_num,
        };

        res.json({ highestRatedEpisode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the lowest-rated episode
app.get("/neo4j/lowest-rated-episode", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
            MATCH (e:Episode)-[:IN]->(s:Season)
            RETURN e, s
            ORDER BY e.rating ASC
            LIMIT 1
        `);

        const lowestRatedEpisode = {
            episode: result.records[0].get("e").properties,
            season_num: result.records[0].get("s").properties.season_num,
        };

        res.json({ lowestRatedEpisode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the least viewed episode
app.get("/neo4j/least-viewed-episode", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
      MATCH (e:Episode)-[:IN]->(s:Season)
      RETURN e, s
      ORDER BY e.views ASC
      LIMIT 1
    `);

        const leastViewedEpisode = result.records[0].get("e").properties;
        const leastViewedEpisodeSeason = result.records[0].get("s").properties;

        res.json({ leastViewedEpisode, leastViewedEpisodeSeason });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Get the earliest aired episode
app.get("/neo4j/earliest-aired-episode", async (req, res) => {
    const session = neo4jdriver.session();
    try {
        const result = await session.run(`
        MATCH (e:Episode)-[:IN]->(s:Season)
        RETURN e, s
        ORDER BY e.air_date ASC
        LIMIT 1
      `);

        const earliestAiredEpisode = {
            episode: result.records[0].get("e").properties,
            season_num: result.records[0].get("s").properties.season_num,
        };

        res.json({ earliestAiredEpisode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    } finally {
        session.close();
    }
});

// Close the Neo4j driver on application shutdown
process.on("exit", () => {
    neo4jdriver.close();
});
