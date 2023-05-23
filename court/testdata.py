from user import UserProfile, UserAuth
import random
from faker import Faker
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import requests
import datetime

fake = Faker()
geolocator = Nominatim(user_agent="myGeocoder")

def get_denver_streets():
    print("Fetching Denver streets...")
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = """
    [out:json];
    area[name="Denver"][admin_level=6];
    way(area)[highway~"^(primary|secondary)$"];
    out tags;
    """
    response = requests.get(overpass_url, params={'data': overpass_query})
    data = response.json()

    streets = set()
    for element in data['elements']:
        if 'name' in element['tags']:
            streets.add(element['tags']['name'])

    return list(streets)

denver_streets = get_denver_streets()
print(f"Found {len(denver_streets)} streets in Denver.")

def generate_address():
    street = random.choice(denver_streets)
    address = f"{fake.building_number()} {street}, Denver, CO"

    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except GeocoderTimedOut:
        return generate_address()

    return None

# Generate a list of test users with random data
def generate_test_users(num_users):
    test_users = []
    unique_addresses = set()

    while len(unique_addresses) < num_users:
        address = generate_address()
        if address:
            unique_addresses.add(address)
        print(f"Generated {len(unique_addresses)}/{num_users} unique addresses", flush=True)

    for i, location in enumerate(unique_addresses):
        user_id = i + 1
        name = fake.name()
        email = fake.email()
        password = fake.password()
        user_auth = UserAuth(user_id, email, password)
        bio = fake.text(max_nb_chars=200)
        ntrp = round(random.uniform(1.0, 7.0) * 2) / 2
        availability = random.sample(range(1, 8), random.randint(1, 7))
        created_at = datetime.datetime.now()
        gender = random.choice(["Male", "Female"])
        DOB = fake.date_of_birth(minimum_age=20, maximum_age=60)
        walkthrough = random.choice([True, False])
        test_users.append(UserProfile(user_auth, name, availability, location, bio, [], ntrp, None, False, created_at, gender, DOB, walkthrough))
        print(f"Generated {i + 1}/{num_users} users", flush=True)

    return test_users

# def generate_test_users(num_users):
#     test_users = []
#     unique_addresses = set()

#     while len(unique_addresses) < num_users:
#         address = generate_address()
#         if address:
#             unique_addresses.add(address)
#         print(f"Generated {len(unique_addresses)}/{num_users} unique addresses", flush=True)

#     for i, location in enumerate(unique_addresses):
#         user_id = i + 1
#         name = fake.name()
#         ntrp = round(random.uniform(1.0, 7.0) * 2) / 2
#         availability = random.sample(range(1, 8), random.randint(1, 7))
#         test_users.append(User(user_id, name, availability, location, ntrp))
#         print(f"Generated {i + 1}/{num_users} users", flush=True)
# return test_users


