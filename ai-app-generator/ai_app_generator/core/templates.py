from __future__ import annotations

import os
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List

from jinja2 import Environment, FileSystemLoader, StrictUndefined


@dataclass
class TemplatesManager:
    templates_base_dir: Path | None = None

    def __post_init__(self) -> None:
        if self.templates_base_dir is None:
            self.templates_base_dir = Path(__file__).resolve().parent.parent / "templates"

    def list_templates(self) -> List[str]:
        if not self.templates_base_dir.exists():
            return []
        return sorted([p.name for p in self.templates_base_dir.iterdir() if p.is_dir()])

    def render_to(self, template_name: str, destination_dir: Path, context: Dict[str, object]) -> None:
        src_dir = self.templates_base_dir / template_name
        if not src_dir.exists():
            raise ValueError(f"Template '{template_name}' not found under {self.templates_base_dir}")

        env = Environment(
            loader=FileSystemLoader(str(src_dir)),
            undefined=StrictUndefined,
            keep_trailing_newline=True,
            autoescape=False,
        )

        # Extra default context
        render_context = {**context, "year": datetime.utcnow().year}

        for root, dirs, files in os.walk(src_dir):
            rel_dir = Path(root).relative_to(src_dir)
            target_dir = destination_dir / rel_dir
            target_dir.mkdir(parents=True, exist_ok=True)

            # copy non-templated files as-is and render .j2 files
            for file_name in files:
                source_path = Path(root) / file_name

                if file_name.endswith(".j2"):
                    target_file_name = file_name[:-3]
                    target_path = target_dir / target_file_name

                    template = env.get_template(str(Path(rel_dir) / file_name) if rel_dir != Path(".") else file_name)
                    rendered = template.render(**render_context)
                    target_path.write_text(rendered, encoding="utf-8")
                else:
                    # Copy binary/special files as-is
                    shutil.copy2(source_path, target_dir / file_name)