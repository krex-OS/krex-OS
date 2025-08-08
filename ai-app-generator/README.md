# AI App Generator

An opinionated, template-driven AI app generator with optional LLM-powered content generation. Create production-grade app skeletons (FastAPI, Streamlit, Next.js) with a single command, and optionally use an LLM to draft a README and feature plan.

## Features
- CLI built with Typer
- Template engine using Jinja2 (variables: `project_name`, `description`, `year`)
- Built-in templates: `fastapi`, `streamlit`, `nextjs`
- Optional LLM integration via providers (OpenAI supported) to generate README/feature plan
- Clean project scaffolding with sensible defaults

## Quickstart

1) Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2) List templates

```bash
python -m ai_app_generator list-templates
```

3) Create a new app from a template

```bash
python -m ai_app_generator new my-fastapi-app --template fastapi --path /workspace
```

4) Optional: Enable LLM (OpenAI)

```bash
cp .env.example .env
# Edit .env to add OPENAI_API_KEY
python -m ai_app_generator new my-ai-app --template fastapi --path /workspace --use-llm
```

## Environment
- `OPENAI_API_KEY`: API key for OpenAI when `--use-llm` is enabled

## Templates
Templates live under `ai_app_generator/templates/<template_name>`. Files ending in `.j2` are rendered through Jinja2 and the `.j2` suffix is removed.

Available context variables in templates:
- `project_name`: The new project name
- `description`: Short description. If `--use-llm` is enabled and a provider is configured, the README may be generated/refined by the model.
- `year`: Current year

## CLI
- `list-templates`: List available built-in templates
- `new <name>`: Generate a new app
  - `--template`: fastapi | streamlit | nextjs
  - `--path`: Destination directory (absolute path recommended)
  - `--description`: Optional description for README
  - `--use-llm`: Use configured LLM provider to generate README content

## License
MIT