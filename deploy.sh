#!/bin/bash

# Exit on error
set -e

echo "Starting deployment for IP 13.60.156.93"

# Update system packages
echo "Updating system packages..."
sudo dnf update -y || sudo yum update -y

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs || sudo yum install -y nodejs

# Install SQLite as a lightweight database alternative
echo "Installing SQLite..."
sudo dnf install -y sqlite sqlite-devel || sudo yum install -y sqlite sqlite-devel

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "Setting up application directory..."
sudo mkdir -p /var/www/aws-app
sudo chown -R $USER:$USER /var/www/aws-app

# Create .env file for backend
echo "Creating backend .env file..."
cat > backend/.env << EOF
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=aws_app
JWT_SECRET=your_secure_jwt_secret_key
EOF

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Modify backend to use SQLite instead of MySQL if needed
echo "Configuring backend..."
# This would require modifying db.js to use SQLite - manual step

# Start backend with PM2
echo "Starting backend with PM2..."
pm2 start server.js --name "aws-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frotend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Install Nginx
echo "Installing Nginx..."
sudo dnf install -y nginx || sudo yum install -y nginx || sudo amazon-linux-extras install nginx1 -y

# Configure Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/conf.d/aws-frontend.conf > /dev/null << EOF
server {
    listen 80;
    server_name 13.60.156.93;

    location / {
        root /var/www/aws-app/frotend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test and restart Nginx
echo "Testing Nginx configuration..."
sudo nginx -t
sudo systemctl start nginx || sudo systemctl restart nginx
sudo systemctl enable nginx

echo "Deployment completed!"
echo "Frontend should be accessible at: http://13.60.156.93"
echo "Backend API should be accessible at: http://13.60.156.93/api" 