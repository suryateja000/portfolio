import os, re, glob, json, PyPDF2
from typing import List, Dict, Any

ALL_ENTRIES: List[Dict[str, Any]] = []

ENTRY_SPLIT = re.compile(r'(?m)^\s*##\s+ENTRY_\d+\s*$')

def _strip_bom_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")

def _fix_trailing_commas(text: str) -> str:
    return re.sub(r",\s*(\}|\])", r"\1", text)

def _jsonish_load(text: str):
    try:
        return json.loads(text)
    except Exception:
        pass
    try:
        return json.loads(_fix_trailing_commas(text))
    except Exception:
        return None

def _mk_entry(topic: str, section: str, system: str, tags: List[str], content: str, source_url: str = "") -> Dict[str, Any]:
    return {
        "source_url": source_url or "",
        "section": section or "",
        "system": system or "",
        "topic": topic or "",
        "tags": tags or [],
        "content": (content or "").strip(),
    }

def _flatten_list(values) -> List[str]:
    out = []
    for v in values or []:
        if isinstance(v, str):
            out.append(v)
        else:
            out.append(str(v))
    return out

def _entries_from_about(data: Dict[str, Any], path: str) -> List[Dict[str, Any]]:
    """Parse about.txt — dump the ENTIRE JSON so every field is searchable."""
    topic = data.get("title") or data.get("name") or "About"
    content = json.dumps(data, indent=2, ensure_ascii=False)
    name = data.get("name", "")
    title = data.get("title", "")
    tags = ["about", "profile", "education", "experience", "achievements", "contact", "cgpa"]
    if name:
        tags.append(name)
    if title:
        tags.append(title)
    return [_mk_entry(topic=topic, section="Profile", system="Portfolio", tags=tags, content=content, source_url=path)]

def _entries_from_skills(data: Dict[str, Any], path: str) -> List[Dict[str, Any]]:
    """Parse skills.txt — dump the ENTIRE JSON so every field is searchable."""
    topic = "Skills"
    content = json.dumps(data, indent=2, ensure_ascii=False)
    tags = ["skills", "technical", "competencies", "competitive", "programming", "leetcode", "codechef"]
    tech = data.get("technical_skills", {})
    for key in tech.keys():
        tags.append(key)
    return [_mk_entry(topic=topic, section="Capabilities", system="Portfolio", tags=tags, content=content, source_url=path)]

def _entries_from_projects(data: Dict[str, Any], path: str) -> List[Dict[str, Any]]:
    entries = []
    for proj in data.get("projects", []) or []:
        name = proj.get("name") or "Project"
        desc = proj.get("description") or ""
        techs = _flatten_list(proj.get("technologies", []))
        feats = _flatten_list(proj.get("key_features", []))
        content = desc + ("\nFeatures: " + ", ".join(feats) if feats else "")
        tags = ["project"] + techs + feats
        entries.append(_mk_entry(topic=name, section="Projects", system="Portfolio", tags=tags, content=content, source_url=path))
    if not entries:
        entries.append(_mk_entry(topic="Projects", section="Projects", system="Portfolio", tags=["projects"], content=json.dumps(data, ensure_ascii=False), source_url=path))
    return entries

def parse_file(filepath: str) -> List[Dict[str, Any]]:
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()
    text = _strip_bom_newlines(raw)

    # 1) Try ENTRY_* blocks
    blocks = ENTRY_SPLIT.split(text)[1:]
    if blocks:
        entries: List[Dict[str, Any]] = []
        for block in blocks:
            lines = [ln.strip() for ln in block.strip().split("\n") if ln.strip()]
            entry = {"source_url": "", "section": "", "system": "", "topic": "", "tags": [], "content": ""}
            content_lines = []
            for line in lines:
                if line.startswith("SOURCE_URL:"):
                    entry["source_url"] = line.split("SOURCE_URL:", 1)[1].strip()
                elif line.startswith("SECTION:"):
                    entry["section"]   = line.split("SECTION:", 1)[1].strip()
                elif line.startswith("SYSTEM:"):
                    entry["system"]    = line.split("SYSTEM:", 1)[1].strip()
                elif line.startswith("TOPIC:"):
                    entry["topic"]     = line.split("TOPIC:", 1)[1].strip()
                elif line.startswith("RETRIEVAL_TAGS:"):
                    rawtags = line.split("RETRIEVAL_TAGS:", 1)[1].strip()
                    entry["tags"] = [t.strip() for t in rawtags.split(",") if t.strip()]
                else:
                    content_lines.append(line)
            entry["content"] = "\n".join(content_lines).strip()
            if entry["content"]:
                entries.append(entry)
        return entries

    jsonish = _jsonish_load(text)
    if isinstance(jsonish, dict):
        lower_keys = {k.lower() for k in jsonish.keys()}
        fname = os.path.splitext(os.path.basename(filepath))[0].lower()
        # IMPORTANT: Check filename FIRST to avoid misrouting
        # (about.txt has 'projects' and 'technical_skills' keys too)
        if fname == "about":
            return _entries_from_about(jsonish, filepath)
        if fname == "skills":
            return _entries_from_skills(jsonish, filepath)
        if fname == "projects" or "projects" in lower_keys:
            return _entries_from_projects(jsonish, filepath)
        if "technical_skills" in lower_keys:
            return _entries_from_skills(jsonish, filepath)
        return _entries_from_about(jsonish, filepath)

    filename = os.path.splitext(os.path.basename(filepath))[0]
    topic = filename
    tags = [filename]
    lines = text.split("\n")
    if lines and lines[0].startswith("# "):
        topic = lines[0][2:].strip() or topic
    return [_mk_entry(topic=topic, section="Profile", system="Portfolio", tags=tags, content=text, source_url=filepath)]

def parse_pdf(filepath: str) -> List[Dict[str, Any]]:
    try:
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        filename = os.path.splitext(os.path.basename(filepath))[0]
        return [_mk_entry(topic=filename, section="Resume", system="Portfolio", tags=["resume", "pdf", filename], content=text, source_url=filepath)]
    except Exception as e:
        print(f"Error parsing PDF {filepath}: {e}")
        return []

def load_all(docs_dir: str) -> None:
    global ALL_ENTRIES
    ALL_ENTRIES = []
    paths = []
    for ext in ("*.md", "*.txt", "*.pdf"):
        paths.extend(glob.glob(os.path.join(docs_dir, ext)))
    for p in paths:
        if p.endswith(".pdf"):
            ALL_ENTRIES.extend(parse_pdf(p))
        else:
            ALL_ENTRIES.extend(parse_file(p))
    ALL_ENTRIES = [e for e in ALL_ENTRIES if (e.get("content") or "").strip()]

def retrieve(query: str, k: int = 8) -> List[Dict[str, Any]]:
    if not ALL_ENTRIES:
        return []
    q = (query or "").lower()
    words = [w for w in re.findall(r"[a-z0-9#+\\-]+", q) if len(w) > 1]
    scored = []
    for e in ALL_ENTRIES:
        blob = " ".join([
            e.get("system", ""), e.get("section", ""), e.get("topic", ""),
            " ".join(e.get("tags", [])), e.get("content", "")
        ]).lower()
        score = 0
        if e.get("system", "").lower() in q:
            score += 5
        if e.get("topic", "").lower() in q:
            score += 3
        for t in e.get("tags", []):
            if t in q:
                score += 3
        for w in words:
            if w in blob:
                score += 1
        scored.append((score, e))
    scored.sort(key=lambda x: x[0], reverse=True)
    hits = [e for s, e in scored[:k] if s > 0]
    if not hits:
        hits = [e for _, e in scored[:k]]
    return hits

def format_citation(e: Dict[str, Any]) -> str:
    topic = e.get("topic") or "Untitled"
    section = e.get("section") or "Unknown"
    src = e.get("source_url") or "Unknown"
    return f"{topic} | {section} | {src}"

def count_entries() -> int:
    return len(ALL_ENTRIES)

def list_topics(n: int = 10) -> List[str]:
    return [e.get("topic", "") for e in ALL_ENTRIES[:n]]
