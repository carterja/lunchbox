# Docker deploy (e.g. food.carterfamily.top)

## First-time setup on the server (e.g. 10.0.1.40)

1. **On the server**, clone the repo and start the app:

   ```bash
   git clone https://github.com/carterja/lunchbox food
   cd food
   docker compose up -d --build
   ```

3. **Port:** The app listens on **9515**. The compose file publishes `9515:9515`. Point your reverse proxy at `http://127.0.0.1:9515`.

4. **Reverse proxy:** Configure `food.carterfamily.top` to proxy to that host/port. The app uses relative URLs (`/api`, `/uploads`), so no extra config is needed.

5. **Data:** DB and uploads live in Docker volumes `food-data` and `food-uploads` and persist across restarts.

---

## Updating the app after deploy

Whenever you push changes to GitHub, on the server run:

```bash
cd food   # the directory you cloned into
./deploy
```

Or manually:

```bash
cd food
git pull
docker compose up -d --build
```

On first deploy, make the script executable: `chmod +x deploy`.
