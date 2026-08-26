import shutil
from pathlib import Path
from typing import List
from src.markdown_parser import TopicItem


class MarkdownWriter:
    """
    Safely updates PathAI Markdown (.md) and Catalog Text (.txt) resource files.
    Creates backups and modifies ONLY English URL cells/fields.
    """

    def create_backup(self, input_file: Path) -> Path:
        backup_file = input_file.parent / f"{input_file.stem}.backup{input_file.suffix}"
        shutil.copy2(input_file, backup_file)
        return backup_file

    def write_updated_markdown(
        self,
        input_file: Path,
        output_file: Path,
        topics: List[TopicItem],
        dry_run: bool = False
    ) -> bool:
        if dry_run:
            print(f"[DRY RUN] Would write updates for {len(topics)} topics to {output_file.name}")
            return True

        if not input_file.exists():
            raise FileNotFoundError(f"Input file not found: {input_file}")

        # 1. Create backup
        self.create_backup(input_file)

        # 2. Read raw lines
        with open(input_file, "r", encoding="utf-8") as f:
            lines = f.readlines()

        ext = input_file.suffix.lower()

        if ext == ".txt":
            self._update_txt_lines(lines, topics)
        else:
            self._update_md_lines(lines, topics)

        # 5. Write to output file
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            f.writelines(lines)

        return True

    def _update_md_lines(self, lines: List[str], topics: List[TopicItem]):
        topic_map = {t.line_index: t for t in topics}

        for idx, item in topic_map.items():
            if idx < len(lines):
                orig_line = lines[idx]
                if orig_line.strip().startswith("|") and orig_line.strip().endswith("|"):
                    parts = [p.strip() for p in orig_line.strip().split("|")[1:-1]]

                    if item.num_columns == 4 and len(parts) == 4:
                        new_line = f"| {parts[0]} | {item.english_url_1} | {item.english_url_2} | {parts[3]} |\n"
                        lines[idx] = new_line
                    elif item.num_columns == 5 and len(parts) >= 5:
                        new_line = f"| {parts[0]} | {parts[1]} | {item.english_url_1} | {item.english_url_2} | {parts[4]} |\n"
                        lines[idx] = new_line

    def _update_txt_lines(self, lines: List[str], topics: List[TopicItem]):
        topic_map = {t.line_index: t for t in topics}

        for idx, item in topic_map.items():
            if idx < len(lines):
                # We are at line `topic: <Topic Name>`
                # Update url1: and url2: in the subsequent lines
                j = idx + 1
                while j < len(lines) and j < idx + 10:
                    sub = lines[j].strip()
                    if sub.startswith("url1:"):
                        lines[j] = f"url1: {item.english_url_1}\n"
                    elif sub.startswith("url2:"):
                        lines[j] = f"url2: {item.english_url_2}\n"
                    elif sub.startswith("topic:") or sub.startswith("url:"):
                        break
                    j += 1
