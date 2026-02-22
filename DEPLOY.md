# Deployment notes

## In place

- **Persistence:** `docker-compose` uses named volumes `food-data` (SQLite) and `food-uploads`. Data survives container restarts and image updates.
- **Reverse proxy:** Use your proxy (e.g. Nginx Proxy Manager, Traefik, Caddy) so only HTTPS is exposed at `lunchbox.carterfamily.top`. Don’t expose port 9515 directly to the internet.
- **App security:** Rate limiting, 5MB upload limit, SSRF protection, XSS escaping and safe image URLs.
- **Healthcheck:** Docker hits `https://lunchbox.carterfamily.top/health` so the container can be restarted if the app or proxy stops responding.
- **Resource limits:** Container is limited to 512MB RAM.
- **PWA:** `site.webmanifest` is referenced; the app is installable on supported browsers.
- **Image optimization:** Uploaded recipe images are resized (max 1200px) and converted to WebP to save storage and bandwidth.
