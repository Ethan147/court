from user import User
import random
from faker import Faker

fake = Faker()

# Generate a list of test users with random data
def generate_test_users(num_users):
    test_users = []
    locations = [(37.7749, -122.4194), (40.7128, -74.0060), (41.8781, -87.6298), (34.0522, -118.2437)]

    for i in range(num_users):
        user_id = i + 1
        name = fake.name()
        ntrp = round(random.uniform(2.5, 5.5), 1) if random.random() < 0.9 else None
        availability = random.sample(range(1, 8), random.randint(1, 7))
        location = random.choice(locations)
        test_users.append(User(user_id, name, availability, location, ntrp))

    return test_users
