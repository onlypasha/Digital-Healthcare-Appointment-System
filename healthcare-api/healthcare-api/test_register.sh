#!/bin/bash
curl -X POST http://localhost:5246/api/auth/register/doctor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Test",
    "email": "drtest@example.com",
    "password": "Password123!",
    "phone": "081234567890",
    "specializationId": 1
  }'
echo ""
