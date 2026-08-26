# PathAI Resource Engine

An automated Python tool designed to curate high-quality English learning course resources for every topic in the PathAI curriculum. It uses **YouTube Data API v3** for candidate search and the **Google GenAI SDK (Gemini API)** for semantic quality and coverage evaluation.

---

## 🌟 1. What the Tool Does
- Reads career topics from `PathAI_Updated_Course_Resource_List.md`.
- Finds the **BEST TWO COMPLETE ENGLISH COURSES** (playlists or long-form tutorials) for each topic.
- Evaluates candidate relevance, completeness, subtopic coverage, difficulty, and educational quality.
- Ranks candidates deterministically using a weighted scoring model.
- Verifies URL availability before saving.
- Modifies **ONLY** the English URL columns in the Markdown table (`English URL 1` and `English URL 2`).
- **NEVER modifies the Tamil URL column**.
- Automatically creates backups before updating files.
- Supports dry runs, topic filtering, quota management, and resumable execution.

---

## 📁 2. Project Structure

```text
pathai-resource-engine/
│
├── PathAI_Updated_Course_Resource_List.md   # Input Markdown document containing topics
├── PathAI_Updated_Course_Resource_List_UPDATED.md # Generated output with populated resources
├── resource_engine.py                        # Main CLI entry point
├── requirements.txt                          # Python package dependencies
├── .env.example                              # Environment variable configuration template
├── .gitignore                                # Git ignore file
├── README.md                                 # Complete documentation
│
├── src/
│   ├── __init__.py                           # Package initializer
│   ├── config.py                             # Settings, environment loading, scoring weights, & subtopics
│   ├── markdown_parser.py                    # Parses Markdown tables while preserving structure & Tamil URLs
│   ├── youtube_search.py                     # Queries YouTube API for playlists & videos with fallback & caching
│   ├── course_analyzer.py                    # Gemini API evaluation (google-genai SDK) with strict JSON parsing
│   ├── resource_ranker.py                    # Deterministic weighted ranking & top 2 distinct resource selector
│   ├── url_verifier.py                       # Validates YouTube URL syntax & verifies item existence via API
│   └── markdown_writer.py                    # Non-destructive file modifier with automatic backup creation
│
└── data/
    ├── cache/                                # Cached search queries & Gemini evaluations
    └── logs/                                 # Runtime logs (resource_engine.log)
```

---

## 🐍 3. Python Version & Requirements
- **Python**: `3.9+` (Recommended: Python 3.10, 3.11, or 3.12)
- **APIs Required**:
  1. **YouTube Data API v3**
  2. **Google Gemini API** (via official `google-genai` SDK)

---

## 📦 4. Installation

```bash
# Navigate to project folder
cd pathai-resource-engine

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## 🔑 5. How to Get a YouTube API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. In the sidebar, navigate to **APIs & Services > Library**.
4. Search for **YouTube Data API v3** and click **Enable**.
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials > API Key**.
7. Copy the generated API key.

---

## 🤖 6. How to Get a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API Key** or **Create API key in new project**.
4. Copy the generated API key.

---

## ⚙️ 7. How to Configure `.env`
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your keys:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   MAX_TOPICS_PER_RUN=10
   START_FROM_TOPIC=
   ```

---

## 🧪 8. How to Run a 10-Topic Test

### Dry Run (Preview results without modifying Markdown file):
```bash
python resource_engine.py --dry-run --limit 10
```

### Full Run (Populate the Markdown file):
```bash
python resource_engine.py --limit 10
```

This reads `PathAI_Updated_Course_Resource_List.md` and outputs the updated results to `PathAI_Updated_Course_Resource_List_UPDATED.md`.

---

## 🎯 9. How to Process One Specific Topic

To search and evaluate resources for a single topic (e.g. `SQL`):

```bash
python resource_engine.py --topic "SQL"
```

Or run a dry-run test for one topic:
```bash
python resource_engine.py --topic "Python" --dry-run
```

---

## 🔄 10. How to Resume Processing

If you interrupted processing or reached an API quota limit, run:

```bash
python resource_engine.py --resume
```

The engine automatically scans the document, skips topics that already have two English URLs, and resumes with the remaining pending topics.

---

## ⚡ 11. How Caching Works
- Search API query responses are saved in `data/cache/youtube_search_*.json`.
- Gemini evaluation outputs are saved in `data/cache/eval_*.json`.
- If you rerun the program for previously processed topics, cached data is reused immediately, preventing unnecessary API calls and conserving quota.

---

## 📊 12. How Quota Handling Works
- YouTube Data API v3 enforces daily quota limits (typically 10,000 units/day on free tier).
- Searching for playlists costs ~100 units per query.
- If YouTube returns HTTP 403 `quotaExhausted`:
  1. The engine catches the quota error gracefully.
  2. It immediately writes all completed work up to that point to `PathAI_Updated_Course_Resource_List_UPDATED.md`.
  3. It exits cleanly without losing progress.
  4. You can resume processing the next day using `--resume`.

---

## 📜 13. How to Inspect Logs

Runtime execution details, candidate scores, and errors are saved to `data/logs/resource_engine.log`.

To view log entries on Windows PowerShell:
```powershell
Get-Content -Path data/logs/resource_engine.log -Tail 50
```

On Linux/macOS:
```bash
tail -n 50 data/logs/resource_engine.log
```

---

## 🚀 14. How to Increase `MAX_TOPICS_PER_RUN`

To process more topics per run, edit `.env`:

```env
MAX_TOPICS_PER_RUN=50
```

Or pass the `--limit` command-line argument directly:

```bash
python resource_engine.py --limit 50
```
