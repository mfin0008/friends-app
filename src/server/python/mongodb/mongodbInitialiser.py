# The PyMongo driver and required classes can be imported using the following command:
import pymongo
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import csv

def parse_quotes():
    with open('../data/friends.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader, None)
        utterance_count = 0

        utterance_objects = []

        for row in csv_reader:
            utterance_object = {
                "quote": row[0],
                "speaker": row[1],
                "utterance_id": utterance_count
            }
            utterance_objects.append(utterance_object)
            utterance_count += 1

    return utterance_objects

def main():
    client = pymongo.MongoClient("mongodb://localhost:27017/")

    # connect to the Altas connection:
    uri = "mongodb+srv://mfin0008:GzBKV51gjG4e35Z0@cluster0.saswisr.mongodb.net/?retryWrites=true&w=majority"
    # Create a new client and connect to the server [you will need to change the username and password]
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Parse data from the .csv file
    utterance_objects = parse_quotes()

    # Insert data into the database
    with client.start_session() as s1:
        # use the quotes collection in the utterances database
        quotes = client.utterances.quotes
        # if the database is empty, fill it with the quote objects
        if (quotes.count_documents(filter={}) == 0):
            quotes.insert_many(utterance_objects, session=s1)

main()
