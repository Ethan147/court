import os

import requests
from pydantic import BaseModel, ValidationError


class GooglePlacesRequest(BaseModel):
    input_text: str

def lambda_google_places_proxy():
    try:
        request_data = GooglePlacesRequest(**request.json)
        google_api_key = os.environ.get('AIzaSyClwgKE5HDLlxvktWXNfnvJnRULpOicTcc')
        google_places_url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={request_data.input_text}&key={google_api_key}"

        response = requests.get(google_places_url)

    except ValidationError as e:
        return {"statusCode": 400, "body": json.dumps({"message": str(e)})}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 200, "body": response.json()}
