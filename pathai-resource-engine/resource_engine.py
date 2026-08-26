#!/usr/bin/env python3
"""
PathAI Resource Engine — Main Entry Point
Automatically finds the best two English course/resource URLs for every PathAI topic.
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import List, Optional

from src.config import (
    INPUT_MARKDOWN_PATH,
    OUTPUT_MARKDOWN_PATH,
    MAX_TOPICS_PER_RUN,
    START_FROM_TOPIC,
    LOG_DIR,
)
from src.markdown_parser import MarkdownParser, TopicItem
from src.youtube_search import YouTubeSearchEngine, YouTubeQuotaExhaustedError
from src.course_analyzer import CourseAnalyzer
from src.resource_ranker import ResourceRanker
from src.url_verifier import URLVerifier
from src.markdown_writer import MarkdownWriter


def setup_logger() -> logging.Logger:
    logger = logging.getLogger("ResourceEngine")
    logger.setLevel(logging.INFO)

    # Formatter
    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")

    # File Handler
    log_file = LOG_DIR / "resource_engine.log"
    fh = logging.FileHandler(log_file, encoding="utf-8")
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    # Console Handler with safe UTF-8 encoding for Windows terminal
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ch = logging.StreamHandler(sys.stdout)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    return logger


def display_status(parser: MarkdownParser, logger: logging.Logger):
    stats = parser.get_summary_stats()
    print("\n==================================================")
    print("           PATHAI RESOURCE ENGINE STATUS          ")
    print("==================================================")
    print(f" Total Topics in Document : {stats['total_topics']}")
    print(f" Completed (2 English URLs) : {stats['completed']}")
    print(f" Partially Completed (1 URL): {stats['partially_completed']}")
    print(f" Pending (0 English URLs)  : {stats['pending']}")
    print(f" Needs Review              : {stats['needs_review']}")
    print("==================================================\n")
    logger.info(f"Status check requested. Total: {stats['total_topics']}, Completed: {stats['completed']}, Pending: {stats['pending']}")


def main():
    arg_parser = argparse.ArgumentParser(description="PathAI Automated English Course Resource Engine")
    arg_parser.add_argument("--limit", type=int, default=None, help="Limit number of topics to process in this run")
    arg_parser.add_argument("--topic", type=str, default=None, help="Process only a specific topic name")
    arg_parser.add_argument("--resume", action="store_true", help="Process topics that are missing English resources")
    arg_parser.add_argument("--dry-run", action="store_true", help="Perform searches & evaluations without saving markdown changes")
    arg_parser.add_argument("--status", action="store_true", help="Display summary status statistics and exit")
    arg_parser.add_argument("--input", type=str, default=str(INPUT_MARKDOWN_PATH), help="Path to input markdown file")
    arg_parser.add_argument("--output", type=str, default=str(OUTPUT_MARKDOWN_PATH), help="Path to output markdown file")

    args = arg_parser.parse_args()

    logger = setup_logger()
    logger.info("Initializing PathAI Resource Engine...")

    input_path = Path(args.input)
    output_path = Path(args.output)

    # Parse Markdown file
    md_parser = MarkdownParser()
    try:
        topics = md_parser.parse_file(input_path)
    except Exception as e:
        logger.error(f"Failed to read markdown file at {input_path}: {e}")
        sys.exit(1)

    # Status option
    if args.status:
        display_status(md_parser, logger)
        sys.exit(0)

    # Filter topics for processing
    topics_to_process: List[TopicItem] = []

    for t in topics:
        if args.topic:
            if t.topic.strip().lower() == args.topic.strip().lower():
                topics_to_process.append(t)
        elif args.resume or not (t.has_url1 and t.has_url2):
            topics_to_process.append(t)

    # Apply START_FROM_TOPIC if set
    if START_FROM_TOPIC and not args.topic:
        start_idx = 0
        for i, t in enumerate(topics_to_process):
            if t.topic.strip().lower() == START_FROM_TOPIC.strip().lower():
                start_idx = i
                break
        topics_to_process = topics_to_process[start_idx:]

    # Apply Limit
    limit = args.limit if args.limit is not None else MAX_TOPICS_PER_RUN
    if limit and limit > 0:
        topics_to_process = topics_to_process[:limit]

    if not topics_to_process:
        logger.info("No pending topics to process. All topics match your criteria!")
        sys.exit(0)

    logger.info(f"Targeting {len(topics_to_process)} topics for processing. (Dry Run: {args.dry_run})")

    # Initialize Engine Components
    search_engine = YouTubeSearchEngine()
    analyzer = CourseAnalyzer()
    ranker = ResourceRanker()
    verifier = URLVerifier()
    writer = MarkdownWriter()

    processed_count = 0
    quota_exhausted = False

    for item in topics_to_process:
        logger.info(f"--- Processing Topic: [{item.topic}] (Domain: {item.category_or_domain}) ---")

        try:
            # Step 1: Search YouTube API for candidates
            candidates = search_engine.search_candidates_for_topic(item.topic, item.category_or_domain)
            logger.info(f"Retrieved {len(candidates)} candidate resources for '{item.topic}'")

            if not candidates:
                logger.warning(f"No candidate resources found for topic: {item.topic}")
                item.status = "NEEDS_REVIEW"
                continue

            # Step 2: Evaluate each candidate with Gemini / Analyzer
            evaluations = []
            for cand in candidates:
                eval_res = analyzer.evaluate_candidate(item.topic, item.category_or_domain, cand)
                evaluations.append(eval_res)

            # Step 3: Rank & Select best 2 distinct resources
            selected, status = ranker.select_best_two_resources(candidates, evaluations)

            # Step 4: Verify selected URLs
            verified_resources = []
            for res_item in selected:
                if verifier.verify_url(res_item["url"]):
                    verified_resources.append(res_item)
                else:
                    logger.warning(f"Rejected unverified resource URL: {res_item['url']}")

            # Step 5: Update TopicItem URLs (Preserve existing URLs if one was already present!)
            if len(verified_resources) == 2:
                item.english_url_1 = verified_resources[0]["url"]
                item.english_url_2 = verified_resources[1]["url"]
                item.status = "COMPLETE"
                logger.info(f"Selected #1: {verified_resources[0]['title']} (Score: {verified_resources[0]['final_score']}) -> {item.english_url_1}")
                logger.info(f"Selected #2: {verified_resources[1]['title']} (Score: {verified_resources[1]['final_score']}) -> {item.english_url_2}")
                logger.info(f"Topic [{item.topic}] Status: COMPLETE")

            elif len(verified_resources) == 1:
                if not item.has_url1:
                    item.english_url_1 = verified_resources[0]["url"]
                elif not item.has_url2:
                    item.english_url_2 = verified_resources[0]["url"]

                item.status = "NEEDS_REVIEW"
                logger.info(f"Selected #1: {verified_resources[0]['title']} (Score: {verified_resources[0]['final_score']}) -> {verified_resources[0]['url']}")
                logger.warning(f"Topic [{item.topic}] Status: NEEDS_REVIEW (Only 1 suitable resource found)")
            else:
                item.status = "NEEDS_REVIEW"
                logger.warning(f"Topic [{item.topic}] Status: NEEDS_REVIEW (No suitable resources passed quality threshold)")

            processed_count += 1

        except YouTubeQuotaExhaustedError as eq:
            logger.error(f"YouTube API Quota Limit Exceeded: {eq}")
            logger.info("Saving progress made before stopping...")
            quota_exhausted = True
            break
        except Exception as ex:
            logger.error(f"Error processing topic '{item.topic}': {ex}", exc_info=True)
            continue

    # Step 6: Save updated markdown file
    if not args.dry_run:
        try:
            writer.write_updated_markdown(input_path, output_path, topics, dry_run=False)
            logger.info(f"Successfully saved updated Markdown output to: {output_path}")
        except Exception as e:
            logger.error(f"Failed to write output Markdown file: {e}")
    else:
        logger.info(f"[DRY RUN] Completed processing {processed_count} topics without modifying file.")

    if quota_exhausted:
        logger.warning("Engine stopped gracefully due to YouTube API quota limit. Resume later using python resource_engine.py --resume")
    else:
        logger.info(f"Resource Engine finished successfully! Processed {processed_count} topics.")


if __name__ == "__main__":
    main()
