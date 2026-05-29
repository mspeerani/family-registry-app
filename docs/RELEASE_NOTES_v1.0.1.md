# Release Notes - v1.0.1

## Release

```text
v1.0.1 - local browser origin fix
```

## Fixed

- Allows both `http://localhost:5173` and `http://127.0.0.1:5173` during local development.
- Uses the current browser hostname for the default API URL when `VITE_API_BASE_URL` is not set.

## Verification

- Confirmed API requests from `http://127.0.0.1:5173` no longer fail CORS.
- `npm run check` passed.
