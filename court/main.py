from matchmaking import matchmake
from testdata import generate_test_users

def main():
    num_test_users = 20
    test_users = generate_test_users(num_test_users)
    matches = matchmake(test_users)

    print(f"Total users: {num_test_users}")
    print(f"\nTop matches:")
    for i, match in enumerate(matches, start=1):
        user1, user2, availability_score, distance, match_quality_value = match
        print(f"{i}. {user1} vs {user2} (Match quality: {match_quality_value:.2f}, Distance: {distance:.2f}, Availability score: {availability_score})")


    # Find users without matches
    matched_user_ids = {user.user_id for match in matches for user in match[:2]}
    unmatched_users = [user for user in test_users if user.user_id not in matched_user_ids]

    print(f"\nUnmatched users ({len(unmatched_users)}):")
    for user in unmatched_users:
        print(user)

if __name__ == "__main__":
    main()
