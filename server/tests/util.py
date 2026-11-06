from api.auth import AUTH_COOKIE_KEY


def unpack_token(headers: dict[str, str]) -> str:
    """
    From a headers object that might look like this:
        Headers({
        ...
        'set-cookie': 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqdWR5cm9iZXJzb25AZXhhbXBsZS5jb20iLCJleHAiOjE3OTMxMTI4MTd9.MaFKwI8ndKHuMMpMx_wsIGVH0UGFuhvni6ssLqniUfw; HttpOnly; Path=/; SameSite=strict; Secure'
        })
    This extracts the token string:
        eyJhb...niUfw
    """
    token = headers.get("set-cookie").split(";")[0][
        len(AUTH_COOKIE_KEY) + 1 :
    ]  # cut off the "access_token="
    return token
