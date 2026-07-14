# Copyright 2024-2026 Bodapati Bharat Chandra
# Licensed under the Apache License, Version 2.0
# https://www.apache.org/licenses/LICENSE-2.0

from fastapi import Request
from fastapi.responses import JSONResponse
from loguru import logger


async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url}: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
