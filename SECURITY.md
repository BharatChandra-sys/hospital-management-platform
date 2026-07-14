# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| main branch | Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please do not open a public GitHub issue.

Report vulnerabilities privately by emailing the maintainer. Include:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix if you have one

You will receive a response within 48 hours. If the vulnerability is confirmed, a fix will be prioritised and released as soon as possible.

## Security Best Practices for Deployment

- Never commit `.env` files to version control
- Use a strong, randomly-generated `SECRET_KEY` (minimum 32 characters) in production
- Set `DEBUG=False` in production to disable Swagger UI
- Use Razorpay live keys only in production environments
- Always verify Razorpay payment signatures server-side before marking bills as paid
- Use HTTPS in production for all frontend and backend communication
- Restrict `ALLOWED_ORIGINS` to only your known frontend domains

## Copyright

Copyright 2024-2026 Bodapati Bharat Chandra

Licensed under the Apache License, Version 2.0.
