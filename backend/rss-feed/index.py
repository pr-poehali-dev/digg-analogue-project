"""
Загружает технологические новости из RSS-лент популярных изданий.
Парсит XML, нормализует данные и возвращает список статей.
"""
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import re
import time

RSS_FEEDS = [
    {"url": "https://feeds.arstechnica.com/arstechnica/technology-lab", "source": "Ars Technica", "category": "Tech"},
    {"url": "https://feeds.arstechnica.com/arstechnica/gadgets", "source": "Ars Technica", "category": "Hardware"},
    {"url": "https://www.theverge.com/rss/index.xml", "source": "The Verge", "category": "Tech"},
    {"url": "https://techcrunch.com/feed/", "source": "TechCrunch", "category": "Startups"},
    {"url": "https://feeds.feedburner.com/TechCrunch", "source": "TechCrunch", "category": "AI"},
    {"url": "https://www.wired.com/feed/rss", "source": "Wired", "category": "Science"},
]

NAMESPACES = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'media': 'http://search.yahoo.com/mrss/',
    'atom': 'http://www.w3.org/2005/Atom',
    'dc': 'http://purl.org/dc/elements/1.1/',
}

CATEGORY_KEYWORDS = {
    "AI": ["ai", "artificial intelligence", "machine learning", "openai", "gpt", "llm", "neural", "chatgpt", "gemini", "claude", "llama"],
    "Hardware": ["chip", "processor", "gpu", "cpu", "apple silicon", "m4", "m3", "hardware", "device", "iphone", "macbook"],
    "Space": ["space", "spacex", "nasa", "rocket", "satellite", "starship", "mars", "orbit", "launch"],
    "Security": ["hack", "security", "vulnerability", "breach", "malware", "ransomware", "cyber", "exploit"],
    "Browsers": ["chrome", "firefox", "safari", "browser", "edge", "web"],
    "Quantum": ["quantum", "qubit", "quantum computing"],
    "Robotics": ["robot", "robotics", "autonomous", "drone", "optimus"],
    "OS": ["windows", "macos", "linux", "android", "ios", "operating system"],
    "EV": ["electric vehicle", "tesla", "ev", "battery", "charging"],
}

def detect_category(text: str) -> str:
    text_lower = text.lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return cat
    return "Tech"

def clean_html(raw: str) -> str:
    if not raw:
        return ""
    clean = re.sub(r'<[^>]+>', '', raw)
    clean = re.sub(r'&amp;', '&', clean)
    clean = re.sub(r'&lt;', '<', clean)
    clean = re.sub(r'&gt;', '>', clean)
    clean = re.sub(r'&quot;', '"', clean)
    clean = re.sub(r'&#\d+;', '', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean[:300] if len(clean) > 300 else clean

def parse_date(date_str: str) -> str:
    if not date_str:
        return "недавно"
    try:
        formats = [
            "%a, %d %b %Y %H:%M:%S %z",
            "%a, %d %b %Y %H:%M:%S GMT",
            "%Y-%m-%dT%H:%M:%S%z",
            "%Y-%m-%dT%H:%M:%SZ",
        ]
        pub_date = None
        for fmt in formats:
            try:
                pub_date = datetime.strptime(date_str.strip(), fmt)
                break
            except ValueError:
                continue

        if not pub_date:
            return "недавно"

        if pub_date.tzinfo is None:
            pub_date = pub_date.replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)
        diff = now - pub_date
        minutes = int(diff.total_seconds() / 60)

        if minutes < 60:
            return f"{minutes} мин. назад"
        elif minutes < 1440:
            hours = minutes // 60
            return f"{hours} ч. назад"
        else:
            days = minutes // 1440
            return f"{days} д. назад"
    except Exception:
        return "недавно"

def fetch_rss(feed: dict) -> list:
    items = []
    try:
        req = urllib.request.Request(
            feed["url"],
            headers={"User-Agent": "Mozilla/5.0 (compatible; PulseNews/1.0)"}
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            content = resp.read()

        root = ET.fromstring(content)

        # RSS 2.0
        channel = root.find('channel')
        if channel is not None:
            entries = channel.findall('item')
        else:
            # Atom
            entries = root.findall('{http://www.w3.org/2005/Atom}entry')

        for entry in entries[:6]:
            # Title
            title_el = entry.find('title') or entry.find('{http://www.w3.org/2005/Atom}title')
            title = clean_html(title_el.text if title_el is not None else "")
            if not title:
                continue

            # Description/summary
            desc_el = (
                entry.find('description') or
                entry.find('{http://www.w3.org/2005/Atom}summary') or
                entry.find('{http://www.w3.org/2005/Atom}content') or
                entry.find('{http://purl.org/rss/1.0/modules/content/}encoded')
            )
            excerpt = clean_html(desc_el.text if desc_el is not None else "")

            # Link
            link_el = entry.find('link')
            if link_el is None:
                link_el = entry.find('{http://www.w3.org/2005/Atom}link')
            link = ""
            if link_el is not None:
                link = link_el.text or link_el.get('href', '')

            # Date
            date_el = (
                entry.find('pubDate') or
                entry.find('{http://www.w3.org/2005/Atom}updated') or
                entry.find('{http://www.w3.org/2005/Atom}published') or
                entry.find('{http://purl.org/dc/elements/1.1/}date')
            )
            pub_time = parse_date(date_el.text if date_el is not None else "")

            category = detect_category(title + " " + excerpt)

            items.append({
                "title": title,
                "excerpt": excerpt,
                "source": feed["source"],
                "sourceUrl": link,
                "category": category,
                "time": pub_time,
                "readTime": max(2, len(excerpt.split()) // 200 + 2),
                "upvotes": 0,
                "comments": [],
            })
    except Exception as e:
        pass

    return items

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    all_items = []
    seen_titles = set()

    for feed in RSS_FEEDS:
        items = fetch_rss(feed)
        for item in items:
            title_key = item['title'][:60].lower()
            if title_key not in seen_titles:
                seen_titles.add(title_key)
                item['id'] = len(all_items) + 1
                all_items.append(item)

    # Sort: newest items first (упрощённо — по индексу из feed)
    # Помечаем первые 3 как trending
    for i, item in enumerate(all_items[:3]):
        item['trending'] = True

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({'news': all_items, 'total': len(all_items)})
    }
