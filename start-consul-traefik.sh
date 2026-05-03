#!/bin/bash

echo "🚀 Starting Consul + Traefik Infrastructure"
echo "==========================================="
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p traefik/letsencrypt traefik/logs consul/data

# Set permissions
echo "🔒 Setting permissions..."
chmod 600 traefik/letsencrypt 2>/dev/null || true

# Start services
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.consul-traefik.yml up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# Check status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.consul-traefik.yml ps

# Display access information
echo ""
echo "✅ Infrastructure Started!"
echo "==========================================="
echo ""
echo "🌐 Access Points:"
echo "  Traefik Dashboard: http://localhost:8080"
echo "  Consul UI:         http://localhost:8500"
echo ""
echo "📝 Next Steps:"
echo "  1. Check Traefik dashboard for routing status"
echo "  2. Verify Consul UI shows no services yet (normal)"
echo "  3. Start your microservices to register with Consul"
echo ""
echo "🔍 View Logs:"
echo "  docker-compose -f docker-compose.consul-traefik.yml logs -f"
echo ""
echo "🛑 Stop Services:"
echo "  docker-compose -f docker-compose.consul-traefik.yml down"
echo ""
