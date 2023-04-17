import math
from user import User
import glicko2
from geopy.distance import great_circle

# Calculate the distance between two users in miles, rounded to the nearest 0.25 miles
def get_distance(user1, user2):
    distance = great_circle(user1.location, user2.location).miles
    return math.ceil(distance * 4) / 4

# Calculate the number of common availability days between two users
def get_availability_score(user1, user2):
    common_availability = set(user1.availability) & set(user2.availability)
    return len(common_availability)

# Calculate the g function value for Glicko-2 system given the RD (rating deviation)
def g(rd):
    return 1 / math.sqrt(1 + 3 * (rd ** 2) / (math.pi ** 2))

# Calculate the expected outcome of a match between two players with ratings and RDs
def E(rating1, rating2, rd2):
    return 1 / (1 + math.exp(-g(rd2) * (rating1 - rating2)))

# Calculate the match quality between two players
def match_quality(player1, player2):
    rating1, rd1 = player1.rating, player1.rd
    rating2, rd2 = player2.rating, player2.rd
    expected_outcome = E(rating1, rating2, rd2)
    return expected_outcome

# Main matchmaking function, takes a list of users and returns matches sorted by quality
def matchmake(users):
    matches = []
    user_count = len(users)

    # Initialize Glicko-2 players
    players = [glicko2.Player(rating=user.mmr if user.mmr is not None else 1500) for user in users]

    # Iterate over all possible user pairs and calculate match quality
    for i in range(user_count):
        for j in range(i + 1, user_count):
            user1 = users[i]
            user2 = users[j]

            distance = get_distance(user1, user2)
            availability_score = get_availability_score(user1, user2)

            # If the distance between the users is within 0.25 miles and they have common availability
            if distance <= 0.25 and availability_score > 0:
                player1 = players[i]
                player2 = players[j]

                match_quality_value = match_quality(player1, player2)
                matches.append((user1, user2, match_quality_value))

    # Sort matches by match quality in descending order
    matches.sort(key=lambda x: x[2], reverse=True)
    return matches
