# Base on official NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy NGINX configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose the listening port
EXPOSE 8443

# Launch NGINX
CMD ["nginx", "-g", "daemon off;"]
