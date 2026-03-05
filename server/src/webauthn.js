const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

const RP_NAME = process.env.RP_NAME || 'DREAMACTIC';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || (process.env.FRONTEND_URL || 'http://localhost:3000');

function getRegistrationOptions(username, userId, existingCredentials = []) {
    const excludeCredentials = existingCredentials.map(cred => ({
        id: cred.credential_id, // assuming it's base64url encoded
        type: 'public-key',
    }));

    return generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: userId,
        userName: username,
        excludeCredentials,
        authenticatorSelection: {
            authenticatorAttachment: 'cross-platform',
            residentKey: 'discouraged',
            userVerification: 'preferred',
        },
        attestationType: 'direct',
    });
}

async function verifyRegistration(challenge, registrationResponse) {
    return verifyRegistrationResponse({
        response: registrationResponse,
        expectedChallenge: challenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        requireUserVerification: false,
    });
}

function getAuthenticationOptions(existingCredentials = []) {
    const allowCredentials = existingCredentials.map(cred => ({
        id: cred.credential_id, // base64url encoded
        type: 'public-key',
        transports: cred.transports || [],
    }));

    return generateAuthenticationOptions({
        rpID: RP_ID,
        allowCredentials,
        userVerification: 'preferred',
    });
}

async function verifyAuthentication(
    credentialId,
    publicKey, // base64url
    signCount,
    challenge,
    authenticationResponse
) {
    return verifyAuthenticationResponse({
        response: authenticationResponse,
        expectedChallenge: challenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        authenticatorItem: {
            credentialID: credentialId,
            credentialPublicKey: Buffer.from(publicKey, 'base64url'),
            counter: signCount,
            transports: authenticationResponse.response.transports || []
        },
        requireUserVerification: false,
    });
}

module.exports = {
    getRegistrationOptions,
    verifyRegistration,
    getAuthenticationOptions,
    verifyAuthentication,
};
