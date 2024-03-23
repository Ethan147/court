import json
import os

import boto3
import requests
from pydantic import BaseModel, ValidationError


class GooglePlacesRequest(BaseModel):
    input_text: str

def lambda_google_places_proxy(event, _):
    try:
        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # or specify your domain
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                'body': None
            }

        # Parse request body
        request_data = GooglePlacesRequest(**json.loads(event['body']))

        google_api_key = os.environ.get("PLACES_KEY")
        google_places_url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={request_data.input_text}&key={google_api_key}"

        response_body = requests.get(google_places_url)
        response_data = response_body.json()
        serialized_response_data = json.dumps(response_data)

        # Static response for testing
        response = {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*","Content-Type": "application/json"},
            "body": serialized_response_data
        }

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

    return response
