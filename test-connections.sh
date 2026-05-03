#!/bin/bash
echo "🧪 Testing Infrastructure..."

# Test RabbitMQ
echo -e "\n1. RabbitMQ:"
RABBITMQ_URL="amqps://khfkynkj:3Qr2oS_S-Y8k3-DjAvE7_N3b_GBLQT_b@chameleon.lmq.cloudamqp.com/khfkynkj"
if curl -s -u "khfkynkj:3Qr2oS_S-Y8k3-DjAvE7_N3b_GBLQT_b" "https://chameleon.lmq.cloudamqp.com/api/vhosts" > /dev/null 2>&1; then
    echo "✅ RabbitMQ Connected"
else
    echo "❌ RabbitMQ Failed"
fi

# Test Redis
echo -e "\n2. Redis:"
REDIS_URL="redis://default:gQAAAAAAAbbpAAIgcDE0ODYwNWFhMDMyMmY0NDYzOGEzOTlkZTdiODEwMDI4NQ@sacred-tetra-112361.upstash.io:6379"
if curl -s "https://sacred-tetra-112361.upstash.io" > /dev/null 2>&1; then
    echo "✅ Redis Endpoint Reachable"
else
    echo "❌ Redis Failed"
fi

echo -e "\n3. Testing on Render:"
curl -s "https://food-delevery-app-g73l.onrender.com/health" | head -c 100
echo ""
