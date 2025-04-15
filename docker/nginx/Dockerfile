FROM nginx:alpine

# Copy Nginx config
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Create directories for static and media files
RUN mkdir -p /static /media

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]