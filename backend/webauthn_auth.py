from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
    options_to_json,
)
from webauthn.helpers.structs import (
    AttestationPreference,
    AuthenticatorSelectionCriteria,
    AuthenticatorAttachment,
    UserVerificationRequirement,
    AuthenticatorTransport,
)
from webauthn.helpers import bytes_to_base64url, base64url_to_bytes
import os
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

RP_NAME = os.getenv("RP_NAME", "DREAMATIC")
RP_ID = os.getenv("RP_ID", "localhost")
ORIGIN = os.getenv("ORIGIN", "http://localhost:3000")

def get_registration_options(username: str, user_id: str, existing_credentials: List[dict] = []):
    exclude_credentials = [
        {
            "id": base64url_to_bytes(cred["credential_id"]),
            "type": "public-key",
        }
        for cred in existing_credentials
    ]

    options = generate_registration_options(
        rp_id=RP_ID,
        rp_name=RP_NAME,
        user_id=user_id,
        user_name=username,
        exclude_credentials=exclude_credentials,
        authenticator_selection=AuthenticatorSelectionCriteria(
            authenticator_attachment=AuthenticatorAttachment.CROSS_PLATFORM,
            user_verification=UserVerificationRequirement.PREFERRED,
        ),
        attestation=AttestationPreference.DIRECT,
    )
    return options

def verify_registration(username: str, challenge: str, registration_response: dict):
    verification = verify_registration_response(
        credential=registration_response,
        expected_challenge=base64url_to_bytes(challenge),
        expected_origin=ORIGIN,
        expected_rp_id=RP_ID,
        require_user_verification=False,
    )
    return verification

def get_authentication_options(existing_credentials: List[dict]):
    allow_credentials = [
        {
            "id": base64url_to_bytes(cred["credential_id"]),
            "type": "public-key",
            "transports": [AuthenticatorTransport(t) for t in cred.get("transports", [])]
        }
        for cred in existing_credentials
    ]

    options = generate_authentication_options(
        rp_id=RP_ID,
        allow_credentials=allow_credentials,
        user_verification=UserVerificationRequirement.PREFERRED,
    )
    return options

def verify_authentication(
    credential_id: str,
    public_key: str,
    sign_count: int,
    challenge: str,
    authentication_response: dict
):
    verification = verify_authentication_response(
        credential=authentication_response,
        expected_challenge=base64url_to_bytes(challenge),
        expected_origin=ORIGIN,
        expected_rp_id=RP_ID,
        credential_public_key=base64url_to_bytes(public_key),
        credential_current_sign_count=sign_count,
        require_user_verification=False,
    )
    return verification
