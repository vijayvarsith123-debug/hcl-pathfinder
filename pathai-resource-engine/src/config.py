import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory Resolution
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")

# API Keys & Run Parameters
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MAX_TOPICS_PER_RUN = int(os.getenv("MAX_TOPICS_PER_RUN", "10"))
START_FROM_TOPIC = os.getenv("START_FROM_TOPIC", "").strip()

# Default Paths
if (BASE_DIR / "PathAI_Career_Catalog.txt").exists():
    INPUT_MARKDOWN_PATH = BASE_DIR / "PathAI_Career_Catalog.txt"
    OUTPUT_MARKDOWN_PATH = BASE_DIR / "PathAI_Career_Catalog_UPDATED.txt"
else:
    INPUT_MARKDOWN_PATH = BASE_DIR / "PathAI_Updated_Course_Resource_List.md"
    OUTPUT_MARKDOWN_PATH = BASE_DIR / "PathAI_Updated_Course_Resource_List_UPDATED.md"

CACHE_DIR = BASE_DIR / "data" / "cache"
LOG_DIR = BASE_DIR / "data" / "logs"

# Ensure runtime directories exist
CACHE_DIR.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)

# Deterministic Ranking Weights (Must total 1.0)
RANKING_WEIGHTS = {
    "coverage": 0.35,
    "completeness": 0.20,
    "quality": 0.15,
    "difficulty": 0.10,
    "playlist_structure": 0.10,
    "recency": 0.05,
    "channel_quality": 0.05,
}

# Known Hindi / Hinglish Channels Denylist
HINDI_CHANNEL_DENYLIST = [
    "gate smashers", "neso academy", "jenny's lectures", "jennys lectures",
    "codewithharry", "code with harry", "college wallah", "gate wallah", "physics wallah", "wallah", "pw",
    "apna college", "knowledge gate", "codehelp", "love babbar", "striver", "take u forward",
    "engineering funda", "unacademy", "great learning hindi", "edureka hindi",
    "simplilearn hindi", "geeksforgeeks hindi", "mycsgiris", "learn coding",
    "ws-cube tech", "wscubetech", "thapa technical", "codeforwin", "programmingknowledge hindi",
    "zeenat hasan", "5 minutes engineering", "tech gun", "code in hindi", "sanchit jain",
    "education 4u", "ravindrababu ravula", "gatecse", "riti kumari", "kunal kushwaha",
    "anuj bhaiya", "shradha khapra", "alpha", "amulya's academy", "amulyas academy",
    "last moment tuitions", "lmt", "easytuts", "all about cse", "gate smasher"
]

# Indian Name Surnames & Indicators that default to Hindi unless 'english' is explicitly in channel name
INDIAN_NAME_PATTERNS = [
    "kumari", "kumar", "babbar", "wallah", "shradha", "singh", "sharma", "gupta",
    "verma", "yadav", "jain", "mishra", "pandey", "bhaiya", "babu", "thapa",
    "dutta", "banerjee", "patel", "shah", "reddy", "nair", "rao", "chowdhury",
    "choudhary", "goswami", "das", "sen", "roy", "sarkar", "dube", "tiwari",
    "tripathi", "joshi", "agarwal", "kushwaha", "khatri", "kapoor", "malhotra",
    "khanna", "bhatia", "arora", "sood", "mehta", "seth", "chopra"
]

# Trusted 100% Pure English Educational Channels
ENGLISH_CHANNEL_ALLOWLIST = [
    "freecodecamp", "freecodecamp.org", "mit opencourseware", "mit", "harvard", "cs50",
    "stanford", "stanford online", "uc berkeley", "programming with mosh", "mosh hamedani",
    "traversy media", "fireship", "corey schafer", "bro code", "tech with tim", "caleb curry",
    "abdul bari", "academind", "maximilian schwarzmüller", "the net ninja", "net ninja",
    "derek banas", "coursera", "edx", "khan academy", "ibm technology", "google developers",
    "google cloud tech", "web dev simplified", "kevin powell", "dave gray", "hussein nasser",
    "bytebytego", "arjancodes", "neetcode", "nick white", "sentdex", "daniel bourke",
    "computerphile", "crashcourse", "simon dev", "sebastian lague", "the cherno", "cherno",
    "javidx9", "one lone coder", "edureka", "simplilearn", "geeksforgeeks gate english",
    "geeksforgeeks english", "great learning", "kurt kaiser", "programmingknowledge",
    "thenewboston", "amigoscode", "laurie wired", "liveoverflow", "networkchuck",
    "david bombal", "john hammond", "ippsec", "hak5", "tryhackme", "the cyber mentor", "tcm security"
]

# Domain & Topic Subtopics Dictionary for Enhanced Coverage Analysis
TOPIC_SUBTOPICS = {
    "SQL": [
        "SELECT", "WHERE", "ORDER BY", "GROUP BY", "Aggregate Functions",
        "JOINs (INNER, LEFT, RIGHT)", "Subqueries", "CTEs (With clause)",
        "Window Functions", "CASE Statements", "Indexes & Optimization", "Practical Exercises"
    ],
    "Python": [
        "Variables & Data Types", "Control Flow (If, Loops)", "Functions & Lambda",
        "Data Structures (Lists, Dicts, Sets)", "Object-Oriented Programming (OOP)",
        "File I/O & Exception Handling", "Modules & Package Management", "Virtual Environments"
    ],
    "Data Structures & Algorithms": [
        "Time & Space Complexity (Big O)", "Arrays & Strings", "Linked Lists",
        "Stacks & Queues", "Trees & Binary Search Trees", "Graphs & Traversal (BFS/DFS)",
        "Sorting & Searching", "Dynamic Programming", "Recursion"
    ],
    "Operating Systems": [
        "Process & Threads", "CPU Scheduling Algorithms", "Process Synchronization & Semaphores",
        "Deadlocks & Prevention", "Memory Management & Paging", "Virtual Memory & Page Replacement",
        "File System Architecture", "System Calls & I/O Hardware"
    ],
    "Git & GitHub": [
        "Version Control Basics", "Git Init, Add, Commit, Push", "Branching & Merging",
        "Pull Requests & Code Review", "Resolving Merge Conflicts", "Rebase vs Merge", "GitHub Actions & Workflows"
    ],
    "NumPy": [
        "NDArrays & Initialization", "Array Indexing & Slicing", "Broadcasting",
        "Vectorized Operations", "Linear Algebra Functions", "Random Sampling", "Performance Optimization"
    ],
    "Pandas": [
        "Series & DataFrames", "Data Reading & Writing (CSV, Excel, SQL)", "Data Cleaning & Missing Value Handling",
        "Filtering & Querying", "Groupby & Aggregation", "Merging, Joining & Concatenation", "Time Series Analysis"
    ],
    "Machine Learning": [
        "Supervised vs Unsupervised Learning", "Linear & Logistic Regression", "Decision Trees & Random Forests",
        "Gradient Boosting (XGBoost/LightGBM)", "Cross-Validation & Hyperparameter Tuning",
        "Model Evaluation Metrics (Accuracy, Precision, Recall, F1, ROC-AUC)", "Feature Engineering & Scaling"
    ],
    "Deep Learning": [
        "Artificial Neural Networks (ANN)", "Activation Functions", "Backpropagation & Gradient Descent",
        "Convolutional Neural Networks (CNN)", "Recurrent Neural Networks (RNN/LSTM)",
        "Transformers & Attention Mechanisms", "PyTorch or TensorFlow Framework Basics"
    ],
    "MLOps": [
        "ML Lifecycle Overview", "Experiment Tracking (MLflow/Weights & Biases)", "Feature Stores",
        "Model Registry & Versioning", "Containerization (Docker)", "Pipeline Orchestration (Airflow/Kubeflow)",
        "Model Monitoring & Drift Detection"
    ],
    "React": [
        "JSX & Components", "Props & State Management", "Hooks (useState, useEffect, useMemo, useCallback)",
        "Event Handling", "Conditional Rendering", "React Router", "API Integration & Async Data", "Performance Optimization"
    ],
    "Next.js": [
        "App Router Architecture", "Server & Client Components", "Data Fetching & Server Actions",
        "Routing & Dynamic Routes", "Static Site Generation (SSG) & SSR", "API Routes", "Middleware & Auth"
    ],
    "HTML": [
        "Semantic HTML Elements", "Forms & Input Types", "Head & Metadata", "Accessibility (ARIA Attributes)", "SEO Tags"
    ],
    "CSS": [
        "Box Model & Layout", "Flexbox", "CSS Grid", "Responsive Design & Media Queries",
        "CSS Variables", "Tailwind CSS Basics", "Animations & Transitions"
    ],
    "JavaScript": [
        "ES6+ Syntax", "Promises & Async/Await", "DOM Manipulation", "Event Loop & Closures",
        "Fetch API", "Functional Programming", "Modules"
    ],
    "TypeScript": [
        "Basic Types & Type Inference", "Interfaces & Type Aliases", "Generics",
        "Enums & Utility Types", "TypeScript with React/Node", "tsconfig Configuration"
    ],
    "Docker": [
        "Containers vs Virtual Machines", "Dockerfile Creation", "Images & Registry (Docker Hub)",
        "Docker Compose", "Volumes & Networking", "Multi-Stage Builds"
    ],
    "System Design": [
        "Scalability Principles", "Load Balancing", "Database Sharding & Replication",
        "Caching Strategies (Redis)", "Message Queues (Kafka/RabbitMQ)", "Microservices Architecture", "API Gateway"
    ],
    "Cybersecurity Fundamentals": [
        "CIA Triad", "Threat Vectors & Vulnerabilities", "Authentication & Access Control",
        "Network Security Basics", "Encryption & PKI", "Security Policies & Incident Response"
    ],
}
