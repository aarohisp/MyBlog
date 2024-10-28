# Use an official Nginx image from the Docker Hub
FROM nginx:alpine

# Copy the current directory contents into the Nginx default directory
COPY . /usr/share/nginx/html

# Expose port 80 to allow access to the Nginx server
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
