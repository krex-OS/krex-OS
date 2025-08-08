import os
from pathlib import Path
from typing import Optional
import typer
from rich import print as rprint
from dotenv import load_dotenv

from .core.templates import TemplatesManager
from .core.generator import AppGenerator
from .providers.openai_provider import OpenAIProvider

app = typer.Typer(add_completion=False, help="AI App Generator CLI")


@app.command("list-templates")
def list_templates() -> None:
    tm = TemplatesManager()
    templates = tm.list_templates()
    if not templates:
        rprint("[yellow]No templates found[/yellow]")
        raise typer.Exit(code=1)
    for name in templates:
        rprint(f"- {name}")


@app.command("new")
def new_app(
    name: str = typer.Argument(..., help="Project name (directory will be created)"),
    template: str = typer.Option("fastapi", "--template", "-t", help="Template name"),
    path: str = typer.Option(".", "--path", "-p", help="Destination base path"),
    description: Optional[str] = typer.Option(None, "--description", "-d", help="Short project description"),
    use_llm: bool = typer.Option(False, "--use-llm", help="Generate/Enhance README via LLM provider"),
) -> None:
    load_dotenv()

    destination_root = Path(path).expanduser().resolve()
    destination_root.mkdir(parents=True, exist_ok=True)

    tm = TemplatesManager()
    provider = None

    if use_llm:
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            rprint("[yellow]OPENAI_API_KEY missing; proceeding without LLM[/yellow]")
        else:
            provider = OpenAIProvider(api_key=openai_key)

    generator = AppGenerator(templates_manager=tm, provider=provider)

    project_path = generator.create_app(
        project_name=name,
        template_name=template,
        destination_root=destination_root,
        description=description or "",
    )

    rprint(f"[green]Created[/green] {project_path}")

    if use_llm and provider is not None:
        try:
            generator.generate_readme_with_llm(project_path=project_path, project_name=name, description=description or "")
            rprint("[green]README generated via LLM[/green]")
        except Exception as exc:
            rprint(f"[yellow]LLM README generation failed: {exc}[/yellow]")


def main() -> None:
    app()


if __name__ == "__main__":
    main()