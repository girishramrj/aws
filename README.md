# AWS Application Deployment Guide

This guide explains how to deploy the application to the server with IP 13.60.156.93.

## Prerequisites

- Access to the server via SSH (using PuTTY or another SSH client)
- Basic knowledge of Linux commands

## Deployment Steps

### 1. Connect to the server

Using PuTTY, connect to the server:
- Host: 13.60.156.93
- Port: 22
- Username: ec2-user (or the appropriate username)

### 2. Transfer files to the server

From your local machine, transfer the application files to the server:

```bash
# Using PSCP (PuTTY SCP) on Windows
pscp -r C:\Users\GirishramRJ\aws\* ec2-user@13.60.156.93:/home/ec2-user/aws-app/
```

### 3. Run the deployment script

After connecting to the server and transferring files:

```bash
cd /home/ec2-user/aws-app
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Install required dependencies (Node.js, SQLite, PM2, Nginx)
- Set up the backend with PM2
- Build the frontend
- Configure Nginx to serve the application

### 4. Using SQLite instead of MySQL

If you're having issues with MySQL, the application is configured to use SQLite as an alternative:

1. Rename or copy the SQLite configuration file:
```bash
cd /home/ec2-user/aws-app/backend
cp db.sqlite.js db.js
```

2. Install SQLite dependencies:
```bash
sudo dnf install -y sqlite sqlite-devel || sudo yum install -y sqlite sqlite-devel
```

3. Restart the backend:
```bash
pm2 restart aws-backend
```

### 5. Accessing the application

After successful deployment:
- Frontend: http://13.60.156.93
- Backend API: http://13.60.156.93/api

## Troubleshooting

### Check if the backend is running
```bash
pm2 status
pm2 logs aws-backend
```

### Check Nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
sudo cat /var/log/nginx/error.log
```

### Firewall/Security Groups
Ensure that ports 22 (SSH), 80 (HTTP), and 3000 (Backend API) are open in the AWS Security Group for the instance. 