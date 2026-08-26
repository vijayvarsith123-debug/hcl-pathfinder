import json
import hashlib
import re
import requests
from typing import List, Dict, Any, Optional
from pathlib import Path
from src.config import YOUTUBE_API_KEY, CACHE_DIR


class YouTubeQuotaExhaustedError(Exception):
    """Raised when the YouTube API quota limit has been reached."""
    pass


class YouTubeSearchEngine:
    """
    Handles YouTube Data API v3 searching for playlists and videos with query variation,
    caching, quota detection, and URL construction.
    """

    SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
    PLAYLISTS_URL = "https://www.googleapis.com/youtube/v3/playlists"
    VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"

    def __init__(self, api_key: str = YOUTUBE_API_KEY, cache_dir: Path = CACHE_DIR):
        self.api_key = api_key
        self.cache_dir = cache_dir

    def _get_cache_key(self, topic: str, domain: str) -> str:
        slug = re.sub(r"[^a-zA-Z0-9]", "_", f"{domain}_{topic}".lower())
        hash_digest = hashlib.md5(f"{domain}:{topic}".encode("utf-8")).hexdigest()[:8]
        return f"youtube_search_{slug}_{hash_digest}.json"

    def generate_search_queries(self, topic: str, domain: str = "") -> List[str]:
        queries = [
            f"{topic} complete course English",
            f"{topic} full course English",
            f"{topic} complete playlist English",
            f"{topic} tutorial English",
            f"{topic} course English for beginners",
        ]
        if domain and domain.strip().lower() not in ["general", "software engineering"]:
            clean_domain = domain.split("-")[-1].strip()
            queries.append(f"{topic} course English for {clean_domain}")

        return queries

    def search_candidates_for_topic(self, topic: str, domain: str = "") -> List[Dict[str, Any]]:
        cache_filename = self._get_cache_key(topic, domain)
        cache_file = self.cache_dir / cache_filename

        # Check Cache
        if cache_file.exists():
            try:
                with open(cache_file, "r", encoding="utf-8") as f:
                    cached_data = json.load(f)
                    return cached_data.get("candidates", [])
            except Exception:
                pass

        if not self.api_key:
            raise ValueError(
                "YOUTUBE_API_KEY is missing! Please set YOUTUBE_API_KEY=your_key in pathai-resource-engine/.env to retrieve real YouTube course URLs."
            )

        queries = self.generate_search_queries(topic, domain)
        candidates_map: Dict[str, Dict[str, Any]] = {}
        playlist_ids = set()
        video_ids = set()

        # Step 1: Search PLAYLISTS first
        for query in queries:
            if len(candidates_map) >= 15:
                break

            params = {
                "key": self.api_key,
                "q": query,
                "type": "playlist",
                "part": "snippet",
                "maxResults": 10,
                "relevanceLanguage": "en",
                "order": "relevance",
            }
            res = requests.get(self.SEARCH_URL, params=params, timeout=15)
            if res.status_code == 403:
                err_data = res.json().get("error", {})
                reason = err_data.get("errors", [{}])[0].get("reason", "")
                if "quota" in reason.lower() or "limit" in reason.lower():
                    raise YouTubeQuotaExhaustedError("YouTube Data API v3 quota exhausted.")
                raise Exception(f"YouTube API 403 Error: {err_data.get('message')}")

            if res.ok:
                items = res.json().get("items", [])
                for item in items:
                    pid = item.get("id", {}).get("playlistId")
                    if pid:
                        playlist_ids.add(pid)

        # Step 2: Search VIDEOS if playlist candidates < 10
        if len(playlist_ids) < 10:
            for query in queries[:3]:
                params = {
                    "key": self.api_key,
                    "q": query,
                    "type": "video",
                    "videoDuration": "long",  # Prefer long-form videos (>20 mins)
                    "part": "snippet",
                    "maxResults": 5,
                    "relevanceLanguage": "en",
                    "order": "relevance",
                }
                res = requests.get(self.SEARCH_URL, params=params, timeout=15)
                if res.status_code == 403:
                    raise YouTubeQuotaExhaustedError("YouTube Data API v3 quota exhausted.")
                if res.ok:
                    items = res.json().get("items", [])
                    for item in items:
                        vid = item.get("id", {}).get("videoId")
                        if vid:
                            video_ids.add(vid)

        # Step 3: Fetch metadata details for Playlists
        if playlist_ids:
            pid_list = list(playlist_ids)[:20]
            params = {
                "key": self.api_key,
                "part": "snippet,contentDetails",
                "id": ",".join(pid_list),
            }
            res = requests.get(self.PLAYLISTS_URL, params=params, timeout=15)
            if res.ok:
                items = res.json().get("items", [])
                for item in items:
                    pid = item["id"]
                    snippet = item.get("snippet", {})
                    content_details = item.get("contentDetails", {})
                    item_count = content_details.get("itemCount", 0)

                    url = f"https://www.youtube.com/playlist?list={pid}"
                    candidates_map[url] = {
                        "id": pid,
                        "type": "playlist",
                        "url": url,
                        "title": snippet.get("title", ""),
                        "description": snippet.get("description", ""),
                        "channel_title": snippet.get("channelTitle", ""),
                        "published_at": snippet.get("publishedAt", ""),
                        "item_count": item_count,
                        "duration": f"{item_count} videos",
                    }

        # Step 4: Fetch metadata details for Videos
        if video_ids:
            vid_list = list(video_ids)[:15]
            params = {
                "key": self.api_key,
                "part": "snippet,contentDetails,statistics",
                "id": ",".join(vid_list),
            }
            res = requests.get(self.VIDEOS_URL, params=params, timeout=15)
            if res.ok:
                items = res.json().get("items", [])
                for item in items:
                    vid = item["id"]
                    snippet = item.get("snippet", {})
                    content_details = item.get("contentDetails", {})
                    stats = item.get("statistics", {})

                    url = f"https://www.youtube.com/watch?v={vid}"
                    candidates_map[url] = {
                        "id": vid,
                        "type": "video",
                        "url": url,
                        "title": snippet.get("title", ""),
                        "description": snippet.get("description", ""),
                        "channel_title": snippet.get("channelTitle", ""),
                        "published_at": snippet.get("publishedAt", ""),
                        "duration": content_details.get("duration", ""),
                        "view_count": stats.get("viewCount", "0"),
                    }

        candidates = list(candidates_map.values())

        # Save to Cache
        try:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump({"topic": topic, "domain": domain, "candidates": candidates}, f, indent=2)
        except Exception:
            pass

        return candidates
