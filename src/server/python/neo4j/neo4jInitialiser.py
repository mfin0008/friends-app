from neo4j import GraphDatabase
import csv

def populate_neo4j_database_from_csv(session, csv_file):
    with open(csv_file, newline="") as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Extract data from CSV rows 
            season_num = int(row["season"])
            episode_num = int(row["episode"])
            title = row["title"]
            air_date = row["air_date"]
            views = float(row["us_views_millions"])
            rating = float(row["imdb_rating"])
            directors = row["directed_by"].split(" & ")
            writers = row["written_by"].split(" & ")

            # Create Season node 
            session.write_transaction(lambda tx: tx.run(
                "MERGE (s:Season {season_num: $season_num})",
                season_num=season_num
            ))

            # Create Episode node and relationships
            session.write_transaction(lambda tx: tx.run(
                """
                MERGE (e:Episode {episode_num: $episode_num, title: $title, air_date: $air_date, views: $views, rating: $rating})
                MERGE (s:Season {season_num: $season_num})
                CREATE (e)-[:IN]->(s)
                """,
                season_num=season_num,
                episode_num=episode_num,
                title=title,
                air_date=air_date,
                views=views,
                rating=rating
            ))

            # Create Director node and relationship to Episode
            for director in directors:
                session.write_transaction(lambda tx: tx.run(
                    """
                    MERGE (c:CrewMember {name: $director})
                    MERGE (e:Episode {episode_num: $episode_num})-[:IN]->(s:Season {season_num: $season_num})
                    CREATE (e)-[:DIRECTED_BY]->(c)
                    """,
                    director=director,
                    episode_num=episode_num,
                    season_num=season_num
                ))

            # Create Writer node and relationship to Episode
            for writer in writers: 
                session.write_transaction(lambda tx: tx.run(
                    """
                    MERGE (c:CrewMember {name: $writer})
                    MERGE (e:Episode {episode_num: $episode_num})-[:IN]->(s:Season {season_num: $season_num})
                    CREATE (e)-[:WRITTEN_BY]->(c)
                    """,
                    writer=writer,
                    episode_num=episode_num,
                    season_num=season_num
                ))
    
if __name__ == "__main__":   
    URI = "bolt://localhost:7687"
    AUTH = ("neo4j", "neo4jgraph")
    driver = GraphDatabase.driver(URI, auth=AUTH)
    
    # Specify the path to CSV file (friends_info.csv)
    csv_file = "../data/friends_info.csv"
    
    # Create a session and populate the database from the CSV file
    with driver.session() as session:
        populate_neo4j_database_from_csv(session, csv_file)
    
    # Close the Neo4j driver
    driver.close()










