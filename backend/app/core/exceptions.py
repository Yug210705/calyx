from fastapi import Request
from fastapi.responses import JSONResponse

class AtlasException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

async def atlas_exception_handler(request: Request, exc: AtlasException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                # In a real app, request_id would be injected via middleware
            }
        },
    )
