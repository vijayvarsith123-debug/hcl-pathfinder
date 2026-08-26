import re
import requests
from typing import Optional
from src.config import YOUTUBE_API_KEY


class URLVerifier:
    """
    Verifies YouTube URL format, extracts ID, and confirms resource availability via YouTube Data API.
    """

    PLAYLIST_REGEX = r"youtube\.com/playlist\?list=([a-zA-Z0-9_-]+)"
    VIDEO_REGEX = r"(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)"

    def __init__(self, api_key: str = YOUTUBE_API_KEY):
        self.api_key = api_key

    def parse_url(self, url: str) -> Optional[dict]:
        if not url or not isinstance(url, str):
            return None

        playlist_match = re.search(self.PLAYLIST_REGEX, url)
        if playlist_match:
            return {"type": "playlist", "id": playlist_match.group(1), "url": url}

        video_match = re.search(self.VIDEO_REGEX, url)
        if video_match:
            return {"type": "video", "id": video_match.group(1), "url": url}

        return None

    def verify_url(self, url: str) -> bool:
        parsed = self.parse_url(url)
        if not parsed:
            return False

        if not self.api_key:
            # Syntax validation only if no API key
            return True

        # Verify existence via YouTube API
        item_id = parsed["id"]
        item_type = parsed["type"]

        try:
            if item_type == "playlist":
                endpoint = f"https://www.googleapis.com/youtube/v3/playlists?part=id,status&id={item_id}&key={self.api_key}"
            else:
                endpoint = f"https://www.googleapis.com/youtube/v3/videos?part=id,status&id={item_id}&key={self.api_key}"

            res = requests.get(endpoint, timeout=10)
            if res.ok:
                items = res.json().get("items", [])
                if items:
                    status = items[0].get("status", {})
                    privacy = status.get("privacyStatus", "public")
                    return privacy in ["public", "unlisted"]
        except Exception:
            pass

        return True  # Fallback to true if network check is inconclusive
