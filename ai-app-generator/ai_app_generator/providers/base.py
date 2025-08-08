from __future__ import annotations

from abc import ABC, abstractmethod


class LLMProvider(ABC):
    @abstractmethod
    def generate_text(self, prompt: str) -> str:  # pragma: no cover - trivial abstraction
        raise NotImplementedError