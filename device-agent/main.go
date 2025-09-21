package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shirou/gopsutil/v3/host"
)

type DeviceInfo struct {
	DeviceID    string    `json:"device_id"`
	Fingerprint string    `json:"fingerprint"`
	MacAddress  string    `json:"mac_address"`
	Hostname    string    `json:"hostname"`
	OS          string    `json:"os"`
	Arch        string    `json:"arch"`
	Token       string    `json:"token"`
	LastSeen    time.Time `json:"last_seen"`
}

type TokenResponse struct {
	Token     string    `json:"token"`
	DeviceID  string    `json:"device_id"`
	ExpiresAt time.Time `json:"expires_at"`
	Valid     bool      `json:"valid"`
}

type HealthResponse struct {
	Status    string    `json:"status"`
	Version   string    `json:"version"`
	DeviceID  string    `json:"device_id"`
	Timestamp time.Time `json:"timestamp"`
}

type ValidationRequest struct {
	SessionID string `json:"session_id"`
	UserID    string `json:"user_id"`
	Role      string `json:"role"`
}

type ValidationResponse struct {
	Valid     bool      `json:"valid"`
	DeviceID  string    `json:"device_id"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

const (
	VERSION     = "1.0.0"
	TOKEN_EXPIRY = 15 * time.Minute
	PORT        = "8181"
)

var (
	deviceInfo DeviceInfo
	currentToken string
	tokenExpiry  time.Time
)

func main() {
	// Initialize device information
	if err := initializeDevice(); err != nil {
		log.Fatalf("Failed to initialize device: %v", err)
	}

	// Generate initial token
	generateNewToken()

	// Set Gin to release mode in production
	gin.SetMode(gin.ReleaseMode)

	// Create router
	router := gin.New()
	router.Use(gin.Recovery())

	// Middleware to ensure only localhost connections
	router.Use(func(c *gin.Context) {
		clientIP := c.ClientIP()
		if clientIP != "127.0.0.1" && clientIP != "::1" && !strings.HasPrefix(clientIP, "127.") {
			log.Printf("Unauthorized access attempt from: %s", clientIP)
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Access denied. Only localhost connections allowed.",
			})
			c.Abort()
			return
		}
		c.Next()
	})

	// CORS middleware for localhost only
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3001")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Routes
	router.GET("/health", handleHealth)
	router.GET("/device-token", handleGetDeviceToken)
	router.POST("/validate", handleValidate)
	router.GET("/device-info", handleDeviceInfo)

	log.Printf("Device Agent v%s starting on port %s", VERSION, PORT)
	log.Printf("Device ID: %s", deviceInfo.DeviceID)
	log.Printf("Only accepting connections from localhost")

	// Start server
	if err := router.Run("127.0.0.1:" + PORT); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func initializeDevice() error {
	// Get hostname
	hostname, err := os.Hostname()
	if err != nil {
		return fmt.Errorf("failed to get hostname: %v", err)
	}

	// Get MAC address
	macAddr, err := getMACAddress()
	if err != nil {
		return fmt.Errorf("failed to get MAC address: %v", err)
	}

	// Generate device fingerprint
	fingerprint := generateFingerprint(hostname, macAddr)

	// Generate or load device ID
	deviceID := generateDeviceID(fingerprint)

	deviceInfo = DeviceInfo{
		DeviceID:    deviceID,
		Fingerprint: fingerprint,
		MacAddress:  macAddr,
		Hostname:    hostname,
		OS:          runtime.GOOS,
		Arch:        runtime.GOARCH,
		LastSeen:    time.Now(),
	}

	return nil
}

func getMACAddress() (string, error) {
	interfaces, err := net.Interfaces()
	if err != nil {
		return "", err
	}

	for _, iface := range interfaces {
		// Skip loopback and non-ethernet interfaces
		if iface.Flags&net.FlagLoopback != 0 || iface.Flags&net.FlagUp == 0 {
			continue
		}

		mac := iface.HardwareAddr.String()
		if mac != "" && mac != "00:00:00:00:00:00" {
			return mac, nil
		}
	}

	return "", fmt.Errorf("no valid MAC address found")
}

func generateFingerprint(hostname, macAddr string) string {
	// Get additional system info
	hostInfo, _ := host.Info()

	data := fmt.Sprintf("%s:%s:%s:%s:%s",
		hostname,
		macAddr,
		runtime.GOOS,
		runtime.GOARCH,
		hostInfo.HostID,
	)

	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

func generateDeviceID(fingerprint string) string {
	// Use first 16 chars of fingerprint as device ID
	if len(fingerprint) >= 16 {
		return fingerprint[:16]
	}
	return fingerprint
}

func generateNewToken() {
	currentToken = uuid.New().String()
	tokenExpiry = time.Now().Add(TOKEN_EXPIRY)
	deviceInfo.Token = currentToken
	deviceInfo.LastSeen = time.Now()

	log.Printf("Generated new token, expires at: %s", tokenExpiry.Format(time.RFC3339))
}

func isTokenValid() bool {
	return time.Now().Before(tokenExpiry)
}

func handleHealth(c *gin.Context) {
	response := HealthResponse{
		Status:    "healthy",
		Version:   VERSION,
		DeviceID:  deviceInfo.DeviceID,
		Timestamp: time.Now(),
	}

	c.JSON(http.StatusOK, response)
}

func handleGetDeviceToken(c *gin.Context) {
	// Rotate token if expired
	if !isTokenValid() {
		generateNewToken()
	}

	response := TokenResponse{
		Token:     currentToken,
		DeviceID:  deviceInfo.DeviceID,
		ExpiresAt: tokenExpiry,
		Valid:     true,
	}

	c.JSON(http.StatusOK, response)
}

func handleValidate(c *gin.Context) {
	var req ValidationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ValidationResponse{
			Valid:     false,
			DeviceID:  deviceInfo.DeviceID,
			Message:   "Invalid request format",
			Timestamp: time.Now(),
		})
		return
	}

	// For now, validation is based on token validity and device presence
	valid := isTokenValid()
	message := "Device validation successful"

	if !valid {
		message = "Device token expired or invalid"
	}

	// Log validation attempt
	log.Printf("Validation request - User: %s, Role: %s, Session: %s, Valid: %t",
		req.UserID, req.Role, req.SessionID, valid)

	response := ValidationResponse{
		Valid:     valid,
		DeviceID:  deviceInfo.DeviceID,
		Message:   message,
		Timestamp: time.Now(),
	}

	c.JSON(http.StatusOK, response)
}

func handleDeviceInfo(c *gin.Context) {
	// Update last seen
	deviceInfo.LastSeen = time.Now()

	c.JSON(http.StatusOK, deviceInfo)
}