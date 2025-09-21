# Meerkato POS Device Agent

A lightweight security agent that validates authorized POS terminals for Meerkato applications.

## Overview

The Device Agent is a minimal Go service that runs on authorized POS terminals to validate device authenticity. It provides device fingerprinting, token management, and session validation for roles that require physical terminal access (Cashiers and Supervisors).

## Features

- **Device Fingerprinting**: Unique identification based on hardware characteristics
- **Token Management**: Rotating tokens with configurable expiry
- **Localhost-only Access**: Security through local-only API endpoints
- **Session Validation**: Validates user sessions for device-restricted roles
- **Lightweight**: Minimal resource footprint for POS environments

## API Endpoints

### GET /health
Returns device agent health status and basic information.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "device_id": "abc123def456",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GET /device-token
Returns the current device token for authentication.

```json
{
  "token": "uuid-token-string",
  "device_id": "abc123def456",
  "expires_at": "2024-01-01T12:15:00Z",
  "valid": true
}
```

### POST /validate
Validates a user session for device-restricted access.

Request:
```json
{
  "session_id": "session-uuid",
  "user_id": "user-uuid",
  "role": "CASHIER"
}
```

Response:
```json
{
  "valid": true,
  "device_id": "abc123def456",
  "message": "Device validation successful",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GET /device-info
Returns complete device information and fingerprint.

```json
{
  "device_id": "abc123def456",
  "fingerprint": "sha256-hash",
  "mac_address": "00:11:22:33:44:55",
  "hostname": "POS-Terminal-01",
  "os": "windows",
  "arch": "amd64",
  "token": "current-token",
  "last_seen": "2024-01-01T12:00:00Z"
}
```

## Security Features

- **Localhost-only**: Agent only accepts connections from 127.0.0.1
- **Token Rotation**: Tokens automatically expire and rotate every 15 minutes
- **Hardware Fingerprinting**: Device identity based on MAC address, hostname, and system info
- **CORS Protection**: Only allows requests from authorized POS application

## Installation and Setup

### Development
```bash
# Navigate to device-agent directory
cd device-agent

# Install dependencies
go mod tidy

# Run the agent
go run main.go
```

### Production Build
```bash
# Build for current platform
go build -o device-agent main.go

# Cross-compile for Windows
GOOS=windows GOARCH=amd64 go build -o device-agent.exe main.go

# Cross-compile for Linux
GOOS=linux GOARCH=amd64 go build -o device-agent main.go
```

### Running as Service

#### Windows (using NSSM)
```cmd
# Install NSSM and create service
nssm install MeerkatoDeviceAgent "C:\path\to\device-agent.exe"
nssm set MeerkatoDeviceAgent DisplayName "Meerkato Device Agent"
nssm set MeerkatoDeviceAgent Description "Security agent for Meerkato POS terminals"
nssm start MeerkatoDeviceAgent
```

#### Linux (using systemd)
Create `/etc/systemd/system/meerkato-agent.service`:
```ini
[Unit]
Description=Meerkato Device Agent
After=network.target

[Service]
Type=simple
User=meerkato
ExecStart=/usr/local/bin/device-agent
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable meerkato-agent
sudo systemctl start meerkato-agent
```

## Configuration

The agent runs with default settings but can be customized:

- **Port**: Default 8181 (modify `PORT` constant)
- **Token Expiry**: Default 15 minutes (modify `TOKEN_EXPIRY` constant)
- **Allowed Origins**: Default localhost:3001 (modify CORS middleware)

## Integration with POS Apps

The POS applications check for device agent presence during authentication:

1. **Check Agent Health**: Verify agent is running on localhost:8181
2. **Get Device Token**: Retrieve current device token
3. **Validate Session**: Send user session for validation
4. **Token Refresh**: Automatically handle token rotation

## Troubleshooting

### Agent not starting
- Check if port 8181 is available
- Verify no firewall blocking localhost connections
- Check system permissions

### Authentication failing
- Verify agent is running: `curl http://localhost:8181/health`
- Check token validity: `curl http://localhost:8181/device-token`
- Review agent logs for validation attempts

### Network connectivity
- Agent only accepts localhost connections
- Verify POS app is connecting to 127.0.0.1:8181
- Check CORS settings if using different ports

## Development Notes

- Agent uses Gin framework for HTTP routing
- Device fingerprinting uses hardware characteristics
- All connections restricted to localhost for security
- Minimal dependencies for easy deployment
- Cross-platform compatibility (Windows, Linux, macOS)