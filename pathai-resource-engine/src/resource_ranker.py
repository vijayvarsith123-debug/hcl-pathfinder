from typing import List, Dict, Any, Tuple
from src.config import (
    RANKING_WEIGHTS,
    HINDI_CHANNEL_DENYLIST,
    ENGLISH_CHANNEL_ALLOWLIST,
    INDIAN_NAME_PATTERNS,
)


class ResourceRanker:
    """
    Ranks candidate resources using a deterministic weighted scoring system.
    Selects top 2 high-quality distinct resources per topic in pure English.
    """

    def __init__(self, weights: Dict[str, float] = RANKING_WEIGHTS):
        self.weights = weights

    def calculate_score(self, candidate: Dict[str, Any], evaluation: Dict[str, Any]) -> float:
        if not evaluation.get("is_relevant", True):
            return 0.0

        channel = candidate.get("channel_title", "").lower().strip()
        title = candidate.get("title", "").lower().strip()

        # Hard reject Hindi / Non-English channels or titles
        if any(h in channel for h in HINDI_CHANNEL_DENYLIST) or "in hindi" in title or "hindi tutorial" in title:
            return 0.0

        # Hard reject Indian individual creator names without explicit English tag
        is_known_english = any(ec in channel for ec in ENGLISH_CHANNEL_ALLOWLIST)
        has_english_tag = "english" in channel or "english" in title

        if not is_known_english and not has_english_tag:
            if any(p in channel for p in INDIAN_NAME_PATTERNS):
                return 0.0

        # 1. Coverage Score (35%)
        coverage_score = float(evaluation.get("coverage_score", 70))

        # 2. Course Completeness (20%)
        completeness_score = 100.0 if evaluation.get("is_complete_course", False) else 50.0

        # 3. Resource Quality (15%)
        quality_score = float(evaluation.get("resource_quality", 75))

        # 4. Difficulty Match (10%)
        difficulty = evaluation.get("difficulty", "beginner")
        difficulty_score = 90.0 if difficulty in ["beginner", "intermediate"] else 70.0

        # 5. Structured Course / Playlist (10%)
        is_playlist = candidate.get("type") == "playlist"
        playlist_score = 100.0 if is_playlist else 65.0

        # 6. Recency (5%)
        pub_date = candidate.get("published_at", "")
        recency_score = 80.0
        if pub_date:
            year = pub_date[:4]
            if year in ["2026", "2025", "2024"]:
                recency_score = 100.0
            elif year in ["2023", "2022"]:
                recency_score = 90.0
            elif year in ["2021", "2020"]:
                recency_score = 80.0
            else:
                recency_score = 65.0

        # 7. Channel / Educational Quality (5%)
        channel_score = 75.0
        if any(ec in channel for ec in ENGLISH_CHANNEL_ALLOWLIST):
            channel_score = 100.0

        # Calculate Final Weighted Score
        score = (
            coverage_score * self.weights.get("coverage", 0.35)
            + completeness_score * self.weights.get("completeness", 0.20)
            + quality_score * self.weights.get("quality", 0.15)
            + difficulty_score * self.weights.get("difficulty", 0.10)
            + playlist_score * self.weights.get("playlist_structure", 0.10)
            + recency_score * self.weights.get("recency", 0.05)
            + channel_score * self.weights.get("channel_quality", 0.05)
        )

        return round(score, 2)

    def select_best_two_resources(
        self, candidates: List[Dict[str, Any]], evaluations: List[Dict[str, Any]]
    ) -> Tuple[List[Dict[str, Any]], str]:
        """
        Ranks candidates and selects up to 2 top distinct resources.
        Returns: (selected_candidates, status)
        """
        scored_items = []
        for cand, ev in zip(candidates, evaluations):
            score = self.calculate_score(cand, ev)
            if score >= 55.0 and ev.get("is_relevant", True):
                scored_items.append((cand, ev, score))

        # Sort by score descending
        scored_items.sort(key=lambda x: x[2], reverse=True)

        selected = []
        seen_channels = set()
        seen_urls = set()

        for cand, ev, score in scored_items:
            url = cand.get("url", "")
            channel = cand.get("channel_title", "").strip().lower()

            if url in seen_urls:
                continue

            # Prefer distinct channels if possible
            if len(selected) == 1 and channel in seen_channels and len(scored_items) > 2:
                # Try finding another candidate from a different channel first
                continue

            cand["final_score"] = score
            cand["evaluation"] = ev
            selected.append(cand)
            seen_urls.add(url)
            seen_channels.add(channel)

            if len(selected) == 2:
                break

        # Fallback if channel filter was too strict and we only have 1 candidate
        if len(selected) == 1 and len(scored_items) > 1:
            for cand, ev, score in scored_items:
                url = cand.get("url", "")
                if url not in seen_urls:
                    cand["final_score"] = score
                    cand["evaluation"] = ev
                    selected.append(cand)
                    break

        if len(selected) == 2:
            return selected, "COMPLETE"
        elif len(selected) == 1:
            return selected, "NEEDS_REVIEW"
        else:
            return [], "NEEDS_REVIEW"
