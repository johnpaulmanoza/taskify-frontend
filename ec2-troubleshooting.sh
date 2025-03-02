#!/bin/bash
# This script helps troubleshoot 502 Bad Gateway issues on EC2

# Check if Docker is running
echo "Checking Docker status..."
sudo systemctl status docker

# Check running containers
echo -e "\nChecking running containers..."
sudo docker ps -a

# Check container logs
echo -e "\nChecking container logs..."
sudo docker logs taskify-app

# Check Nginx logs
echo -e "\nChecking Nginx logs inside container..."
sudo docker exec taskify-app cat /var/log/nginx/error.log

# Restart the container
echo -e "\nRestarting the container..."
sudo docker-compose down
sudo docker-compose up -d

# Check if ports are correctly exposed
echo -e "\nChecking port bindings..."
sudo netstat -tulpn | grep 80

# Check EC2 security group settings
echo -e "\nMake sure your EC2 security group allows inbound traffic on port 80 and 8080"
echo "You can check this in the AWS Console under EC2 > Security Groups"

echo -e "\nTroubleshooting complete. If the issue persists, try the following:"
echo "1. Check if your EC2 instance has enough resources (CPU/memory)"
echo "2. Verify that the build process completed successfully"
echo "3. Try rebuilding the Docker image with: sudo docker-compose build --no-cache"
echo "4. Check if your EC2 instance has the correct permissions to run Docker"