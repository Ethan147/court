import math
import glicko2
from geopy.distance import great_circle

def get_distance(user1, user2):
    distance = great_circle(user1.location, user2.location).miles
    return math.ceil(distance * 4) / 4

def get_availability_score(user1, user2):
    common_availability = set(user1.availability) & set(user2.availability)
    return len(common_availability)

def mmr_difference(player1, player2):
    return abs(player1.rating - player2.rating)


'''The minimum match quality is 0, which can happen if the MMR difference score is 0 (MMR difference >= 250) 
or if the availability score is 0 (no common availability). 
The maximum match quality is the product of the maximum availability score 
(7, when both users are available every day) and the maximum MMR difference score (1, when the MMR difference is 0). This makes the maximum match quality 7.
'''

def match_quality(player1, player2, availability_score):
    rating1, rd1 = player1.rating, player1.rd
    rating2, rd2 = player2.rating, player2.rd
    mmr_diff = mmr_difference(player1, player2)
    mmr_diff_score = max(0, 1 - mmr_diff / 250)  # Higher score for smaller MMR difference
    return availability_score * mmr_diff_score

def matchmake(users):
    matches = []
    user_count = len(users)

    # Initialize Glicko-2 players
    players = [glicko2.Player(rating=user.mmr if user.mmr is not None else 1500) for user in users]

    for i in range(user_count):
        for j in range(i + 1, user_count):
            user1 = users[i]
            user2 = users[j]

            distance = get_distance(user1, user2)
            availability_score = get_availability_score(user1, user2)

            if availability_score > 0:
                player1 = players[i]
                player2 = players[j]

                mmr_diff = mmr_difference(player1, player2)

                if mmr_diff <= 250:
                    match_quality_value = match_quality(player1, player2, availability_score)
                    matches.append((user1, user2, availability_score, distance, match_quality_value))

    # Sort matches by match quality in descending order
    matches.sort(key=lambda x: x[4], reverse=True)

    # Keep only the best, unique matches
    best_matches = []
    matched_user_ids = set()
    for match in matches:
        user1_id, user2_id = match[0].user_id, match[1].user_id
        if user1_id not in matched_user_ids and user2_id not in matched_user_ids:
            best_matches.append(match)
            matched_user_ids.add(user1_id)
            matched_user_ids.add(user2_id)

    return best_matches
