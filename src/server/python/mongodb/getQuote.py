# The PyMongo driver and required classes can be imported using the following command:
import pymongo, sys
from pymongo import MongoClient
from pymongo.server_api import ServerApi

if __name__ == "__main__":
    utterance_id = sys.argv[1]
    client = pymongo.MongoClient("mongodb://localhost:27017/")

    # connect to the Altas connection:
    uri = "mongodb+srv://mfin0008:GzBKV51gjG4e35Z0@cluster0.saswisr.mongodb.net/?retryWrites=true&w=majority"
    # Create a new client and connect to the server [you will need to change the username and password]
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Insert data into the database
    with client.start_session() as s1:
        # use the quotes collection in the utterances database
        quotes = client.utterances.quotes
        result = quotes.find_one({"utterance_id": int(utterance_id)}, {"_id":0, "quote":1, "speaker":1})
        
        print(f"{result['quote']}@{result['speaker']}")