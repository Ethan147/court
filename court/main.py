from matchmaking import matchmake
from testdata import generate_test_users

def main():
    # Generate a list of 200 test users
    test_users = generate_test_users(200)
    # Generate a list of 200 test users
    matches = matchmake(test_users)

    # Generate a list of 200 test users
    print("Top 10 matches:")
    for i, (user1, user2, match_quality) in enumerate(matches[:10], start=1):
        print(f"{i}. {user1} vs {user2} (Match quality: {match_quality:.2f})")

if __name__ == "__main__":
    main()
