import re
from dataclasses import dataclass, field
from typing import List, Optional
from pathlib import Path


@dataclass
class TopicItem:
    line_index: int
    category_or_domain: str
    topic: str
    english_url_1: str
    english_url_2: str
    tamil_url: str
    raw_line: str
    num_columns: int = 4  # 4 or 5 for MD
    file_format: str = "md"  # "md" or "txt"
    status: str = "NEEDS_BOTH"  # COMPLETE, NEEDS_BOTH, NEEDS_URL1, NEEDS_URL2, NEEDS_REVIEW

    @property
    def has_url1(self) -> bool:
        return bool(self.english_url_1 and self.english_url_1.strip().startswith("http"))

    @property
    def has_url2(self) -> bool:
        return bool(self.english_url_2 and self.english_url_2.strip().startswith("http"))

    @property
    def needs_processing(self) -> bool:
        return not (self.has_url1 and self.has_url2)


class MarkdownParser:
    """
    Parses PathAI Markdown (.md) and Catalog Text (.txt) resource files
    while preserving comments, headers, and structure.
    """

    def __init__(self, file_path: Optional[Path] = None):
        self.file_path = file_path
        self.raw_lines: List[str] = []
        self.topics: List[TopicItem] = []

    def parse_file(self, file_path: Path) -> List[TopicItem]:
        self.file_path = file_path
        if not file_path.exists():
            raise FileNotFoundError(f"Input file not found at: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            self.raw_lines = f.readlines()

        self.topics = []
        ext = file_path.suffix.lower()

        if ext == ".txt":
            return self._parse_txt_file()
        else:
            return self._parse_md_file()

    def _parse_md_file(self) -> List[TopicItem]:
        current_category = "General"

        for idx, line in enumerate(self.raw_lines):
            stripped = line.strip()

            if stripped.startswith("#"):
                current_category = stripped.lstrip("#").strip()
                continue

            if stripped.startswith("|") and stripped.endswith("|"):
                parts = [p.strip() for p in stripped.split("|")[1:-1]]

                if not parts or any("---" in p for p in parts) or parts[0].lower() in ["topic", "category / domain", "category", "domain"]:
                    continue

                if len(parts) == 4:
                    topic_name = parts[0]
                    url1 = parts[1]
                    url2 = parts[2]
                    tamil_url = parts[3]
                    category = current_category
                    num_cols = 4
                elif len(parts) >= 5:
                    category = parts[0]
                    topic_name = parts[1]
                    url1 = parts[2]
                    url2 = parts[3]
                    tamil_url = parts[4]
                    num_cols = 5
                else:
                    continue

                if not topic_name:
                    continue

                has_1 = bool(url1 and url1.startswith("http"))
                has_2 = bool(url2 and url2.startswith("http"))

                if has_1 and has_2:
                    status = "COMPLETE"
                elif has_1 and not has_2:
                    status = "NEEDS_URL2"
                elif not has_1 and has_2:
                    status = "NEEDS_URL1"
                else:
                    status = "NEEDS_BOTH"

                topic_item = TopicItem(
                    line_index=idx,
                    category_or_domain=category,
                    topic=topic_name,
                    english_url_1=url1,
                    english_url_2=url2,
                    tamil_url=tamil_url,
                    raw_line=line,
                    num_columns=num_cols,
                    file_format="md",
                    status=status
                )
                self.topics.append(topic_item)

        return self.topics

    def _parse_txt_file(self) -> List[TopicItem]:
        current_category = "General"
        current_domain = "General"
        i = 0
        total_lines = len(self.raw_lines)

        while i < total_lines:
            line = self.raw_lines[i].strip()

            if not line:
                i += 1
                continue

            if line.startswith("topic:"):
                topic_name = line.replace("topic:", "").strip()
                url1 = ""
                url2 = ""
                tamil_url = ""
                topic_line_idx = i

                j = i + 1
                while j < total_lines and j < i + 10:
                    sub = self.raw_lines[j].strip()
                    if sub.startswith("url1:"):
                        url1 = sub.replace("url1:", "").strip()
                    elif sub.startswith("url2:"):
                        url2 = sub.replace("url2:", "").strip()
                    elif sub.startswith("url:"):
                        tamil_url = sub.replace("url:", "").strip()
                    elif sub.startswith("topic:"):
                        break
                    j += 1

                has_1 = bool(url1 and url1.startswith("http"))
                has_2 = bool(url2 and url2.startswith("http"))

                if has_1 and has_2:
                    status = "COMPLETE"
                elif has_1 and not has_2:
                    status = "NEEDS_URL2"
                elif not has_1 and has_2:
                    status = "NEEDS_URL1"
                else:
                    status = "NEEDS_BOTH"

                topic_item = TopicItem(
                    line_index=topic_line_idx,
                    category_or_domain=f"{current_category} - {current_domain}",
                    topic=topic_name,
                    english_url_1=url1,
                    english_url_2=url2,
                    tamil_url=tamil_url,
                    raw_line=self.raw_lines[topic_line_idx],
                    file_format="txt",
                    status=status
                )
                self.topics.append(topic_item)
                i = j
            else:
                if not any(line.startswith(p) for p in ["url1:", "url2:", "tamil", "url:"]):
                    if i + 1 < total_lines and not self.raw_lines[i+1].strip().startswith("topic:"):
                        current_category = line
                    else:
                        current_domain = line
                i += 1

        return self.topics

    def get_summary_stats(self) -> dict:
        total = len(self.topics)
        complete = sum(1 for t in self.topics if t.status == "COMPLETE")
        partially = sum(1 for t in self.topics if t.status in ["NEEDS_URL1", "NEEDS_URL2"])
        pending = sum(1 for t in self.topics if t.status == "NEEDS_BOTH")
        needs_review = sum(1 for t in self.topics if t.status == "NEEDS_REVIEW")

        return {
            "total_topics": total,
            "completed": complete,
            "partially_completed": partially,
            "pending": pending,
            "needs_review": needs_review,
        }
