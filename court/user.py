import math

class User:
    def __init__(self, user_id, name, availability, location, ntrp=None):
        self.user_id = user_id
        self.name = name
        self.ntrp = ntrp
        self.mmr = self.ntrp_to_mmr(ntrp) if ntrp is not None else None
        self.availability = availability
        self.location = location

    # Convert NTRP rating to MMR (matchmaking rating)
    def ntrp_to_mmr(self, ntrp):
        # Feel free to adjust this formula, this is just a placeholder
        return (ntrp - 1) * 500

    # String representation of a User object
    def __str__(self):
        return f"{self.name} (NTRP: {self.ntrp}, MMR: {self.mmr}, Location: {self.location}, Availability: {self.availability})"
