import os

import requests
from flask import Flask, jsonify, request
from pydantic import BaseModel, ValidationError

app = Flask(__name__)

class GooglePlacesRequest(BaseModel):
    input_text: str

@app.route('/google-places', methods=['POST'])
def google_places_proxy():
    try:
        request_data = GooglePlacesRequest(**request.json)
        google_api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
        google_places_url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={request_data.input_text}&key={google_api_key}"

        response = requests.get(google_places_url)
        return jsonify(response.json())

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
