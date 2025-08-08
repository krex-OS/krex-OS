from __future__ import annotations

from pathlib import Path
from typing import Optional

from .templates import TemplatesManager
from ..providers.base import LLMProvider


class AppGenerator:
    def __init__(self, templates_manager: TemplatesManager, provider: Optional[LLMProvider] = None) -> None:
        self.templates_manager = templates_manager
        self.provider = provider

    def create_app(
        self,
        project_name: str,
        template_name: str,
        destination_root: Path,
        description: str = "",
    ) -> Path:
        project_dir = destination_root / project_name
        project_dir.mkdir(parents=True, exist_ok=True)

        context = {
            "project_name": project_name,
            "description": description,
        }

        self.templates_manager.render_to(template_name=template_name, destination_dir=project_dir, context=context)

        return project_dir

    def generate_readme_with_llm(self, project_path: Path, project_name: str, description: str) -> None:
        if self.provider is None:
            raise RuntimeError("No LLM provider configured")

        prompt = (
            "You are a senior software engineer. Create a concise, actionable README for a new project.\n"
            f"Project name: {project_name}\n"
            f"Description: {description}\n\n"
            "The README should include: Overview, Features, Quickstart, Run/Dev commands, and Next steps."
        )
        readme = self.provider.generate_text(prompt=prompt)
        (project_path / "README.md").write_text(readme, encoding="utf-8")