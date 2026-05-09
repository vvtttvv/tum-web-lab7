# Lab 7 - Back-end

## Role of this lab

Build the back-end API for the Pomodoro app and integrate it with the Lab 6 client.

## Requirements (summary)

- Create CRUD API for entities from Lab 6.
- Use REST, GraphQL, or gRPC.
- Protect CRUD endpoints with JWT.
- Store roles or permissions in the JWT, for example:
  - PERMISSIONS: ["READ", "WRITE", ...]
  - ROLE: "ADMIN" | "WRITER" | "VISITOR"
- JWT must have expiration (for demo: 1 minute).
- Provide Swagger UI (or similar) documentation.
- Use proper HTTP status codes.
- Support pagination for large datasets (skip/take).
- Provide a /token endpoint to obtain JWT (roles/permissions via JSON body or query).
- Integrate the API fully or partially with the Lab 6 front-end app.

## Back-end project dependency levels

Dependency chain implemented in csproj files:

1. Pomodoro.Domain (base types)
2. Pomodoro.Repositories (depends on Domain)
3. Pomodoro.Postgres (depends on Repositories and Domain)
4. Pomodoro.Services (depends on Repositories and Domain)
5. Pomodoro.API (depends on Services)
