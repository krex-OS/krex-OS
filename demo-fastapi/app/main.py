from fastapi import FastAPI

app = FastAPI(title="{{ project_name }}")


@app.get("/")
async def root() -> dict:
    return {"message": "Hello from {{ project_name }}"}