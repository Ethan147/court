import json
import os

from pydantic import BaseModel, ValidationError


class GooglePlacesRequest(BaseModel):
    input_text: str

def lambda_google_places_proxy(event, _):
    try:
        # Parse request body
        request_data = GooglePlacesRequest(**json.loads(event['body']))

        # Static response for testing
        response = {'this is my': 'response'}


        # google_api_key = os.environ.get('apikey')
        # google_places_url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={request_data.input_text}&key={google_api_key}"

        # response = requests.get(google_places_url)
    except ValidationError as e:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"message": str(e)})
        }

    # Return the static response
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(response)
    }
