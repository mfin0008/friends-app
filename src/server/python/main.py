import csv

def parse_utterance_values():
    with open('src/data/friends.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader, None)
        utterance_count = 0

        utterance_objects = []

        for row in csv_reader:
            utterance_object = {
                "season": row[2],
                "episode": row[3], 
                "scene": row[4],
                "utterance": row[5],
                "utterance_id": utterance_count
            }
            utterance_objects.append(utterance_object)
            utterance_count += 1

    return utterance_objects

def func():
    batch_insert_string = "begin batch "
    for utterance_object in parse_utterance_values():
        batch_insert_string += f"insert into utterances_by_id (utterance_id, season, episode, scene, utterance) values ({utterance_object['utterance_id']}, {utterance_object['season']}, {utterance_object['episode']}, {utterance_object['scene']}, {utterance_object['utterance']});"
    batch_insert_string += "apply batch;"
    print(batch_insert_string)

func()