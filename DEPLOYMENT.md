# FractalFlow VPS Deployment Guide

## Server Information
- **VPS IP**: 72.61.243.152
- **Port**: 3005
- **Access URL**: http://72.61.243.152:3005

## Prerequisites on VPS

Ensure Docker and Docker Compose are installed on your VPS:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

## Deployment Steps

### 1. Transfer Files to VPS

```bash
# From your local machine, copy project to VPS
scp -r /path/to/"System Architecture builder" root@72.61.243.152:/opt/fractalflow

# Or use rsync (recommended)
rsync -avz --exclude 'node_modules' --exclude 'dist' \
  "/path/to/System Architecture builder/" root@72.61.243.152:/opt/fractalflow/
```

### 2. SSH into VPS

```bash
ssh root@72.61.243.152
cd /opt/fractalflow
```

### 3. Build and Deploy

```bash
# Build the Docker image
docker-compose build

# Start the application
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### 4. Verify Deployment

```bash
# Check if container is running
docker-compose ps

# Test the application
curl http://localhost:3005

# Or visit in browser
# http://72.61.243.152:3005
```

## Management Commands

### View Logs
```bash
docker-compose logs -f fractalflow
```

### Restart Application
```bash
docker-compose restart
```

### Stop Application
```bash
docker-compose down
```

### Rebuild and Restart (after code changes)
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Remove Everything (including volumes)
```bash
docker-compose down -v
```

## Firewall Configuration

Ensure port 3005 is open on your VPS:

```bash
# For UFW (Ubuntu/Debian)
sudo ufw allow 3005/tcp
sudo ufw reload

# For firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3005/tcp
sudo firewall-cmd --reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 3005 -j ACCEPT
sudo iptables-save
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs fractalflow

# Check container status
docker-compose ps

# Inspect container
docker inspect fractalflow-app
```

### Port already in use
```bash
# Find what's using port 3005
sudo lsof -i :3005

# Or
sudo netstat -tulpn | grep 3005

# Stop conflicting service or change port in docker-compose.yml
```

### Can't access from browser
```bash
# Verify container is listening
docker-compose exec fractalflow netstat -tulpn

# Check firewall
sudo ufw status
# or
sudo firewall-cmd --list-all

# Test locally first
curl http://localhost:3005
```

## SSL/HTTPS Setup (Optional but Recommended)

For production, consider adding HTTPS:

### Option 1: Nginx Reverse Proxy + Let's Encrypt

1. Install Nginx and Certbot on VPS
2. Configure Nginx as reverse proxy to port 3005
3. Use Certbot to get SSL certificate

```nginx
# /etc/nginx/sites-available/fractalflow
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Cloudflare Tunnel (No port forwarding needed)

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Create tunnel
cloudflared tunnel login
cloudflared tunnel create fractalflow
cloudflared tunnel route dns fractalflow yourdomain.com

# Configure tunnel
# Create config.yml pointing to http://localhost:3005
cloudflared tunnel run fractalflow
```

## Auto-start on Reboot

Create systemd service:

```bash
# Create service file
sudo nano /etc/systemd/system/fractalflow.service
```

```ini
[Unit]
Description=FractalFlow Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/fractalflow
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable fractalflow
sudo systemctl start fractalflow

# Check status
sudo systemctl status fractalflow
```

## Monitoring

### Check resource usage
```bash
docker stats fractalflow-app
```

### Check disk space
```bash
docker system df
```

### Cleanup unused images
```bash
docker system prune -a
```

## Backup

```bash
# No database to backup since data is client-side
# Just backup the docker-compose.yml and code if needed
tar -czf fractalflow-backup-$(date +%Y%m%d).tar.gz /opt/fractalflow
```

## Updates

To update the application:

```bash
# Pull latest code (if using git)
git pull origin main

# Or upload new files via scp/rsync

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```
