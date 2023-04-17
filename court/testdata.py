from user import User
import random
from faker import Faker
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import requests

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

    for i in range(num_users):
        user_id = i + 1
        name = fake.name()
        ntrp = round(random.uniform(2.5, 5.5), 1) if random.random() < 0.9 else None
        availability = random.sample(range(1, 8), random.randint(1, 7))
        location = generate_address()

        if location:
            test_users.append(User(user_id, name, availability, location, ntrp))

        print(f"Generated {i + 1}/{num_users} users")

    return test_users
