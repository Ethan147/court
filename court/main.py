import random
from matchmaking import matchmake
from testdata import generate_test_users

def main():
    num_test_users = random.randint(100, 500)
    test_users = generate_test_users(num_test_users)
    matches = matchmake(test_users)

    print(f"Total users: {num_test_users}")
    print(f"\nTop matches:")
    for i, (user1, user2, match_quality) in enumerate(matches, start=1):
        print(f"{i}. {user1} vs {user2} (Match quality: {match_quality:.2f})")

    # Find users without matches
    matched_user_ids = {user.user_id for match in matches for user in match[:2]}
    unmatched_users = [user for user in test_users if user.user_id not in matched_user_ids]

    print(f"\nUnmatched users ({len(unmatched_users)}):")
    for user in unmatched_users:
        print(user)

if __name__ == "__main__":
    main()
