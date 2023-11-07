import json
from typing import Any, Callable, Dict, List, Optional

from court.utils.db import CursorCommit, CursorRollback

DEFAULT_SESSION_TIME = 24


"""
TODO:
Rate Limiting: Even if you're protected against SQL-injections,
without some form of rate limiting in place, you're still susceptible to brute-force or flooding attacks.
Someone might try to overwhelm your service by sending a large number of requests in a short period.
AWS Lambda, for instance, will scale to meet demand, which could lead to higher costs.
It would be advisable to implement some form of rate limiting sooner rather than later to avoid unexpected spikes in costs.

Rate limiting can be set at various levels, but for Lambda, you can:

- Set a concurrent execution limit on the function.
  This will cap the number of instances of your function that can be run simultaneously.

- Use API Gateway's built-in rate limiting features.
  If your Lambdas are exposed via API Gateway,
  it offers built-in throttling settings which can be used to specify how many requests per second
  a caller can make and to set a standard rate and burst rate for all API methods.
"""



# import jwt  # You need a library to decode JWT tokens

"""
TODO: (a summary of work to be done in this area)

[x] Viability of Approach:

Yes, your approach is reasonable and could work well for a tennis matchmaking app.
You are correct that session history can provide valuable insights into user behavior.
It's also prudent to want to maintain agility and the ability to pivot without being too tied to third-party services.

[ ] Encrypting session_uuid:

If session_uuid is exposed to the client (e.g., in a cookie), encrypting it adds a layer of security.
An encrypted session token prevents easy hijacking if the token were ever exposed in logs or a database breach.
However, encryption isn't strictly necessary if you're confident in the security of your HTTPS transport, cookie flags (secure, HttpOnly), and overall application security.


[ ] Encryption Method:

AES (Advanced Encryption Standard) with a server-side secret is typically sufficient.
AWS offers services like KMS (Key Management Service) for handling encryption keys securely.
This service allows you to generate, use, rotate, and control access to encryption keys used to encrypt your data.

[ ] Enforcing HTTPS:

On AWS, you can enforce HTTPS at the load balancer (if using one), API Gateway, or within the application itself by setting up a redirect from HTTP to HTTPS.
If you're using API Gateway, it supports HTTPS by default and doesn't allow HTTP connections, so there’s nothing extra you need to do.

[x] Performance Concerns:

Given that your app will be making database calls for most operations,
adding session checks to these calls likely won’t introduce significant overhead.
The key is to ensure your session management is efficient, the queries are optimized, and the database is well-indexed.
Use connection pooling and caching strategies where appropriate.
"""

def handle_session_creation(func: Callable) -> Callable:
    """
    TODO:
    Please note that this code is for illustration purposes and requires further refinement for production use.
    Specifically:

    - The JWT decoding process needs to verify the signature against the secret or public key that was used to sign the token.
    - Error handling should be robust to account for all potential JWT-related issues,
        including expired tokens, incorrect signing, and more.
    - You may need to use your own secret or public/private key pair depending on your JWT strategy.
    """

    def wrapper(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        headers = event.get('headers', {})
        device_identifier = headers.get('User-Agent', 'unknown')
        token = headers.get('Authorization', None)

        if not token:
            return {
                "statusCode": 401,
                "body": json.dumps({"message": "Authorization token is missing."})
            }

        # Decode the JWT token to get user's identity
        try:
            payload = jwt.decode(token, options={"verify_signature": False})  # Make sure to verify the signature in production
            user_id = payload['sub']  # 'sub' is a commonly used key to store user identity in JWT claims
        except jwt.DecodeError:
            return {
                "statusCode": 401,
                "body": json.dumps({"message": "Invalid token."})
            }

        active_session = get_prune_active_or_create_session(user_id, device_identifier)

        if not active_session:
            return {
                "statusCode": 401,
                "body": json.dumps({"message": "Unable to create or retrieve an active session."})
            }

        # Modify the event to pass session data to the lambda
        event['session_uuid'] = active_session

        return func(event, context)

    return wrapper


def require_session(func: Callable) -> Callable:
    def wrapper(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        headers = event.get('headers', {})
        session_uuid = headers.get('Authorization', None)
        device_identifier = headers.get('User-Agent', 'unknown')

        # Note: Consider how you're setting and extracting the user's identity. The example provided assumes AWS Cognito with API Gateway.
        user_id = headers.get('Authorization', '').split(':')[0]

        sessions = get_prune_active_sessions(user_id, device_identifier)

        if not sessions or session_uuid not in sessions:
            return {
                "statusCode": 401,
                "body": json.dumps({"message": "Unauthorized: Invalid or expired session."})
            }

        return func(event, context)

    return wrapper

def get_prune_active_or_create_session(user_id: int, device_identifier: str) -> str:
    active_session = get_prune_active_sessions(user_id, device_identifier)

    if not active_session:
        active_session = [_create_user_session(user_id, device_identifier)]

    return active_session[0]

def _create_user_session(user_id: int, device_identifier: str, session_time: int = DEFAULT_SESSION_TIME) -> str:
    with CursorCommit() as curs:
        query = """
            insert into user_session (user_id, device_identifier, platform, expires_at)
            values (%s, %s, %s, now() + interval '%s hour')
            returning session_uuid;
        """
        curs.execute(query, (user_id, device_identifier, "mobile" if "expo" in device_identifier else "web", session_time))
        session_uuid = curs.fetchone()[0]
        return session_uuid

def get_prune_active_sessions(user_id: int, device_identifier: str) -> List[str]:
    _prune_sessions(user_id)

    with CursorRollback() as curs:
        query = """
            select session_uuid
              from public.user_session
             where user_id = %s
               and device_identifier = %s
               and is_active is true
        """
        curs.execute(query, (user_id,device_identifier))
        user_session_id = curs.fetchall()

    return user_session_id

def extend_session(session_uuid: str, extension_reason: str, extend_hours: int = DEFAULT_SESSION_TIME) -> None:
    """ extend session & log this in the user session history """
    with CursorCommit() as curs:
        query = """
            update user_session
               set expires_at = now() + interval '%s hour'
             where session_uuid = %s;
        """
        curs.execute(query, (extend_hours, session_uuid,))

        query = """
            insert into user_session_history
                (session_uuid, previous_expires_at, new_expires_at, extension_reason)
            values
                (%s, now(), now() + interval '%s hour', %s);
        """
        curs.execute(query, (session_uuid, extend_hours, extension_reason))

def _prune_sessions(user_id: int) -> None:
    """ prune expired sessions & make user there is max 1 active session per user & device identifier """
    _prune_expired_sessions(user_id)
    _prune_extra_user_device_sessions(user_id)

def _prune_extra_user_device_sessions(user_id: int) -> None:
    """ for some user, enforce a max of 1 active session per user-device pair """
    with CursorCommit() as curs:
        query = """
            update public.user_session
               set is_active = false
             where user_id = %s
               and is_active = true
               and session_uuid NOT IN (
                    select distinct on (device_identifier) session_uuid
                      from public.user_session
                     where user_id = %s
                       and is_active = true
                  order by device_identifier, created_at desc
               )
        """
        curs.execute(query, (user_id, user_id))

def _prune_expired_sessions(user_id: int) -> None:
    """ mark expired sessions as inactive for some user """
    with CursorCommit() as curs:
        query = """
            update user_session
               set is_active = false
             where user_id = %s
               and expires_at <= now()
               and is_active = true
        """
        curs.execute(query, (user_id,))

def remove_all_user_sessions(user_id: int) -> None:
    with CursorCommit() as curs:
        query = """
            update user_session
               set is_active = false
             where user_id = %s
        """
        curs.execute(query, (user_id,))
