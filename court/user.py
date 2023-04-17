import math

class User:
    def __init__(self, user_id, name, availability, location, ntrp=None):
        self.user_id = user_id
        self.name = name
        self.ntrp = ntrp
        self.mmr = self.ntrp_to_mmr(ntrp) if ntrp is not None else self.determine_mmr()
        self.availability = availability
        self.location = location

    # Convert NTRP rating to MMR (matchmaking rating)
    def ntrp_to_mmr(self, ntrp):
        # Feel free to adjust this formula, this is just a placeholder
        return (ntrp - 1) * 500

    # Determine MMR based on user responses to questions
    def determine_mmr(self):
        # Example questions to determine a user's skill level
        questions = [
            "How many years have you been playing tennis?",
            "How often do you play tennis in a month?",
            "On a scale of 1 to 10, how would you rate your serve?",
            "On a scale of 1 to 10, how would you rate your groundstrokes?",
            "On a scale of 1 to 10, how would you rate your net game?",
        ]

        total_score = 0
        for question in questions:
            response = float(input(f"{question} "))
            total_score += response

        # Normalize the total score to a value between 1 and 7 to mimic the NTRP range
        normalized_score = 1 + (total_score / (len(questions) * 10)) * 6

        # Convert the normalized score to MMR
        return self.ntrp_to_mmr(normalized_score)

    # String representation of a User object
    def __str__(self):
        return f"{self.name} (NTRP: {self.ntrp}, MMR: {self.mmr}, Location: {self.location}, Availability: {self.availability})"
