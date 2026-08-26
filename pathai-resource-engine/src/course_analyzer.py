import json
import re
import hashlib
from typing import Dict, Any, List, Optional
from pathlib import Path

from src.config import (
    GEMINI_API_KEY,
    CACHE_DIR,
    TOPIC_SUBTOPICS,
    HINDI_CHANNEL_DENYLIST,
    ENGLISH_CHANNEL_ALLOWLIST,
    INDIAN_NAME_PATTERNS,
)

# Import official google-genai SDK
try:
    from google import genai
    from google.genai import types
    HAS_GOOGLE_GENAI = True
except ImportError:
    HAS_GOOGLE_GENAI = False


class CourseAnalyzer:
    """
    Evaluates candidate learning resources using Gemini API for semantic completeness,
    relevance, difficulty, and quality scoring.
    """

    def __init__(self, api_key: str = GEMINI_API_KEY, cache_dir: Path = CACHE_DIR):
        self.api_key = api_key
        self.cache_dir = cache_dir
        self.client = None

        if HAS_GOOGLE_GENAI and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[WARN] Failed to initialize Gemini Client: {e}")

    def _get_cache_key(self, candidate_id: str, topic: str) -> str:
        safe_id = re.sub(r"[^a-zA-Z0-9]", "_", candidate_id)
        topic_hash = hashlib.md5(topic.encode("utf-8")).hexdigest()[:6]
        return f"eval_{safe_id}_{topic_hash}.json"

    def evaluate_candidate(
        self, topic: str, domain: str, candidate: Dict[str, Any]
    ) -> Dict[str, Any]:
        channel = candidate.get("channel_title", "").lower().strip()
        title = candidate.get("title", "").lower().strip()
        desc = candidate.get("description", "").lower().strip()

        # 1. Check Explicit Denylist
        if any(h in channel for h in HINDI_CHANNEL_DENYLIST) or any(h in title or h in desc for h in ["in hindi", "hindi tutorial", "hinglish", "hindi medium"]):
            return {
                "is_relevant": False,
                "is_complete_course": False,
                "coverage_score": 0,
                "difficulty": "beginner",
                "resource_quality": 0,
                "reason": f"Rejected: Channel/video '{channel}' is on the Hindi/Hinglish denylist.",
            }

        # 2. Check Indian Creator Name Patterns (Default to Hindi audio unless 'english' is in channel/title)
        is_known_english = any(ec in channel for ec in ENGLISH_CHANNEL_ALLOWLIST)
        has_english_tag = "english" in channel or "english" in title

        if not is_known_english and not has_english_tag:
            if any(p in channel for p in INDIAN_NAME_PATTERNS):
                return {
                    "is_relevant": False,
                    "is_complete_course": False,
                    "coverage_score": 0,
                    "difficulty": "beginner",
                    "resource_quality": 0,
                    "reason": f"Rejected: Channel '{channel}' detected as individual Indian creator without explicit English tag.",
                }

        cid = candidate.get("id", candidate.get("url", ""))
        cache_filename = self._get_cache_key(cid, topic)
        cache_file = self.cache_dir / cache_filename

        # 1. Check cache
        if cache_file.exists():
            try:
                with open(cache_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass

        # 2. Get explicit subtopics if available
        subtopics = TOPIC_SUBTOPICS.get(topic, [])

        # 3. Call Gemini if available
        if self.client:
            evaluation = self._evaluate_with_gemini(topic, domain, subtopics, candidate)
        else:
            evaluation = self._evaluate_with_heuristics(topic, domain, subtopics, candidate)

        # 4. Save to cache
        try:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(evaluation, f, indent=2)
        except Exception:
            pass

        return evaluation

    def _evaluate_with_gemini(
        self, topic: str, domain: str, subtopics: List[str], candidate: Dict[str, Any]
    ) -> Dict[str, Any]:
        subtopics_str = ", ".join(subtopics) if subtopics else "General foundational to advanced concepts"

        prompt = f"""
You are an expert technical curriculum evaluator for PathAI.
Evaluate the following YouTube resource candidate to determine if it is a complete, high-quality, structured learning course/playlist for the topic: "{topic}".

CRITICAL LANGUAGE REQUIREMENT:
- The course MUST be taught in pure ENGLISH audio.
- Strictly REJECT any video/playlist where the spoken audio language is Hindi, Hinglish, Tamil, Telugu, or any non-English language.
- If the title, description, or channel mentions "Hindi", "in Hindi", "Hinglish", "Lec in Hindi", "Hindi tutorial", or regional phrases, set `is_relevant: false` and `coverage_score: 0`.

Topic Category / Domain: {domain}
Expected Subtopics: {subtopics_str}

Candidate Details:
- Title: {candidate.get('title')}
- Type: {candidate.get('type')}
- Channel: {candidate.get('channel_title')}
- Description: {candidate.get('description', '')[:500]}
- Item Count / Duration: {candidate.get('duration')}

Rules for Evaluation:
1. MUST be taught in clear ENGLISH audio.
2. Reject unrelated resources, promotional trailers, shorts, news clips, or partial fragments.
3. Complete playlists or long-form comprehensive courses should be marked `is_complete_course: true`.
4. Provide a `coverage_score` (0-100) indicating how thoroughly it covers the topic/subtopics in English.
5. Provide a `resource_quality` score (0-100) based on content structure, educational clarity, and channel reputation.
6. Determine `difficulty` as "beginner", "intermediate", or "advanced".
7. Return STRICT JSON ONLY without markdown fences or extra commentary.

Return format:
{{
  "is_relevant": true,
  "is_complete_course": true,
  "coverage_score": 90,
  "difficulty": "beginner",
  "resource_quality": 88,
  "reason": "Detailed explanation of coverage and quality."
}}
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            raw_text = response.text
            return self._parse_json_response(raw_text, topic, candidate)
        except Exception as e:
            # Fallback if Gemini API call fails
            return self._evaluate_with_heuristics(topic, domain, subtopics, candidate)

    def _parse_json_response(self, text: str, topic: str, candidate: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = text.strip()
        # Remove markdown code fences if present
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\n?", "", cleaned)
            cleaned = re.sub(r"\n?```$", "", cleaned)
        
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(0)

        try:
            data = json.loads(cleaned)
            return {
                "is_relevant": bool(data.get("is_relevant", True)),
                "is_complete_course": bool(data.get("is_complete_course", True)),
                "coverage_score": int(data.get("coverage_score", 75)),
                "difficulty": str(data.get("difficulty", "beginner")).lower(),
                "resource_quality": int(data.get("resource_quality", 80)),
                "reason": str(data.get("reason", "Evaluated via Gemini model.")),
            }
        except Exception:
            return self._evaluate_with_heuristics(topic, "", [], candidate)

    def _evaluate_with_heuristics(
        self, topic: str, domain: str, subtopics: List[str], candidate: Dict[str, Any]
    ) -> Dict[str, Any]:
        title = candidate.get("title", "").lower()
        desc = candidate.get("description", "").lower()
        topic_lower = topic.lower()

        # Reject non-English / Hindi / Hinglish indicators
        hindi_indicators = ["hindi", "hinglish", "in hindi", "hindi medium", "lecture in hindi", "hindi tutorial", "bhasha"]
        if any(ind in title or ind in desc for ind in hindi_indicators):
            return {
                "is_relevant": False,
                "is_complete_course": False,
                "coverage_score": 0,
                "difficulty": "beginner",
                "resource_quality": 0,
                "reason": "Rejected due to Hindi/non-English language indicators.",
            }

        # Check relevance
        words = topic_lower.split()
        matches = sum(1 for w in words if w in title or w in desc)
        is_relevant = matches >= max(1, len(words) // 2)

        # Check completeness keywords
        complete_keywords = ["complete", "full course", "masterclass", "tutorial", "zero to hero", "bootcamp", "playlist", "learn"]
        is_complete = any(kw in title for kw in complete_keywords) or candidate.get("type") == "playlist"

        # Calculate heuristic scores
        coverage_score = 85 if is_complete else 65
        quality_score = 80 if candidate.get("type") == "playlist" else 70

        return {
            "is_relevant": is_relevant,
            "is_complete_course": is_complete,
            "coverage_score": coverage_score,
            "difficulty": "beginner" if "beginner" in title or "intro" in title else "intermediate",
            "resource_quality": quality_score,
            "reason": "Evaluated using fallback structural heuristics.",
        }
