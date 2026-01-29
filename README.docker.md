# Docker Production

Build and run the optimized production image:

```bash
# Build the production image
docker build -t petitions .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:password@host:5432/petitions \
  -e BETTER_AUTH_SECRET=your-secure-secret \
  -e BETTER_AUTH_URL=https://your-domain.com \
  -e NEXT_PUBLIC_BETTER_AUTH_URL=https://your-domain.com \
  petitions
```

