import math

class User:
    questions = [
        "How many years have you been playing tennis?",
        "How often do you play tennis in a month?",
        "On a scale of 1 to 10, how would you rate your serve?",
        "On a scale of 1 to 10, how would you rate your groundstrokes?",
        "On a scale of 1 to 10, how would you rate your net game?",
    ]

    def __init__(self, user_id, name, availability, location, ntrp=None, responses=None):
        self.user_id = user_id
        self.name = name
        self.ntrp = ntrp
        self.mmr = self.ntrp_to_mmr(ntrp) if ntrp is not None else self.determine_mmr(responses)
        self.availability = availability
        self.location = location

    # Convert NTRP rating to MMR (matchmaking rating)
    def ntrp_to_mmr(self, ntrp):
        # Feel free to adjust this formula, this is just a placeholder
        return (ntrp - 1) * 500

    # Determine MMR based on user responses to questions
    def determine_mmr(self, responses):
        if responses is None:
            return None

        total_score = sum(responses)

        # Normalize the total score to a value between 1 and 7 to mimic the NTRP range
        normalized_score = 1 + (total_score / (len(responses) * 10)) * 6

        # Convert the normalized score to MMR
        return self.ntrp_to_mmr(normalized_score)

    # String representation of a User object
    def __str__(self):
        return f"{self.name} (NTRP: {self.ntrp}, MMR: {self.mmr}, Location: {self.location}, Availability: {self.availability})"

'''
1.0 Player is just starting to play tennis.
1.5 Player has limited experience and is working primarily on getting the ball in play. Player needs to coordinate moving when hitting the ball and is still concentrating on getting the ball over the net from a stationary position. Player is learning to serve and keep score.
2.0 This player has little experience playing tennis, needs stroke development, is still working on getting the ball into play and is learning basic scoring and rules.
2.5 Can sustain a short rally at a slow pace with other players of similar ability. Strokes are developing, but player is often blocking or pushing the ball. Player knows the basic rules of tennis, can play a singles or doubles match and is ready to play social matches, beginner USTA Junior Team Tennis and/or entry-level tournaments.
3.0 Improved consistency on medium-paced shots. Forehand is more reliable than backhand. Player is developing the ability to control the direction of the ball but majority of shots are directed toward the middle of the court. Developing the ability to add spin on serves, though second serve is often considerably slower than the first serve. Increasing teamwork in doubles; common doubles formation is one up and one back. This player may play in lower-level tournaments and/or an intermediate USTA Junior Team Tennis team.
3.5 Consistent on ground strokes with depth and directional control. Developing placement on second serves. The effective use of lobs, overheads, approach shots and volleys is limited. This player plays on an advanced USTA Junior Team Tennis team.
4.0 This player has dependable strokes with directional control and the ability to alter depth of shots on both the forehand and backhand sides during moderately paced play. This player also has the ability to use lobs, overheads, approach shots and volleys with success. Player is developing good consistency with increased power on ground strokes and serves. Aggressive net play is common in doubles. Unable to sustain a long rally at a fast pace. This player regularly competes in sectional tournaments, on a high school tennis team and/or on an advanced USTA Junior Team Tennis team.
4.5 This player is very consistent at good pace or power hitter, can vary the use of pace and spins, has effective court coverage, can control depth of shots and is able to develop game plans according to strengths and weaknesses. Second serve can be hit with offense. This player tends to over-hit on difficult shots. Aggressive net play in doubles is common. Player has high-level sectional tournament experience and/or plays on an advanced USTA Junior Team Tennis.
5.0 This player has good shot anticipation and frequently has an outstanding shot around which his/her game is built. Player can hit dependable shots in defensive situations and can regularly hit winners or force errors off short balls and puts away volleys. He or she can successfully execute lobs, drop shots, half volleys, overheads and has good depth and spin on most second serves. Player has high level sectional and national tournament experience.
5.5 This player can hit offensively at any time and has developed pace and/or consistency as a major weapon. This player can vary strategies and styles of play in competitive situations and hit dependable shots in stress situations. This player has obtained a top sectional and/or national ranking and/or play Division I college tennis.
6.0 This player has had extensive tournament training for national tournaments and/or top-level Division I collegiate competition.
6.5 This player is a world-class player and has a history of national and international rankings and success in top Division I collegiate play, International Tennis Federation (ITF) and/or professional circuit events.
7.0 This player is a world-class player and will have ATP/WTA points and a world ranking in the Top 50.
'''