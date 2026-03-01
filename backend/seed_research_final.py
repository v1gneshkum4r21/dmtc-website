
import os
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dreamatic_cms")

# Realistic Unsplash Tech Images
TECH_IMAGES = [
    "photo-1531297484001-80022131f5a1", # Circuit
    "photo-1451187580459-43490279c0fa", # Globe
    "photo-1639762681485-074b7f938ba0", # Data
    "photo-1518770660439-4636190af475", # Tech
    "photo-1581091226825-a6a2a5aee158", # Lab
    "photo-1550751827-4bd374c3f58b", # Security
]

def img(idx):
    key = TECH_IMAGES[idx % len(TECH_IMAGES)]
    return f"https://images.unsplash.com/{key}?auto=format&fit=crop&w=1200&q=80"

RESEARCH_DATA = [
    {
        "title": "Hierarchical Task Decomposition in Multi-Agent Reinforcement Learning",
        "authors": "Dr. Arvin Singh",
        "journal": "NeurIPS 2025",
        "year": "2025",
        "excerpt": "A study on breaking down complex global objectives into localized sub-tasks for scalable agent coordination.",
        "abstract": "We propose a novel hierarchical framework for MARL where a high-level manager agent decomposes long-term goals into short-term directives for a swarm of worker agents. Results show a 40% improvement in task completion speed in high-entropy environments.",
        "content": "Full manuscript content describing the hierarchical framework in detail...",
        "pdfUrl": "https://arxiv.org/pdf/2305.16291",
        "linkType": "download",
        "imageUrl": img(4),
        "published": True
    },
    {
        "title": "Quantum-Enhanced Search for Neural Architecture Optimization",
        "authors": "Chen, J., Martinez, R.",
        "journal": "CVPR 2026",
        "year": "2026",
        "excerpt": "Utilizing quantum annealing to navigate the massive search space of neural network topologies.",
        "abstract": "This paper explores the integration of quantum computing primitives into NAS pipelines. By offloading discrete optimization steps to a quantum annealer, we achieve valid architectures significantly faster than classical Bayesian methods.",
        "content": "Full manuscript content describing quantum NAS experiments...",
        "pdfUrl": "https://arxiv.org/abs/2303.12712",
        "linkType": "preview",
        "imageUrl": img(0),
        "published": True
    },
    {
        "title": "Ethical Alignment in Autonomous Decision Swarms",
        "authors": "Okonkwo, S.",
        "journal": "AAAI 2024",
        "year": "2024",
        "excerpt": "Proposing an immutable reasoning ledger for auditing and aligning multi-agent system decisions with human values.",
        "abstract": "Scaling agentic systems requires provable alignment. We introduce 'MoralSovereign', a system that uses zero-knowledge proofs to verify that agent decisions adhere to pre-defined ethical constraints without compromising operational speed.",
        "content": "Full manuscript content describing MoralSovereign ZK-proofs...",
        "pdfUrl": "https://arxiv.org/pdf/2210.03629",
        "linkType": "download",
        "imageUrl": img(5),
        "published": True
    },
    {
        "title": "Asynchronous Communication Protocols for Sub-Millisecond Agent Sync",
        "authors": "DREAMATIC Networking Group",
        "journal": "SIGCOMM 2025",
        "year": "2025",
        "excerpt": "Optimizing the fundamental layer of agent networking for low-latency, high-concurrency environments.",
        "abstract": "Communication overhead is the primary bottleneck in large-scale agent swarms. We present 'BlastSync', a UDP-based protocol that achieves 99.9% consistency with sub-millisecond jitter in localized clusters.",
        "content": "Full manuscript content describing BlastSync protocol metrics...",
        "pdfUrl": "",
        "linkType": "download",
        "imageUrl": img(2),
        "published": True
    },
    {
        "title": "Neural Constraint Solvers for Industrial Process Automation",
        "authors": "Williams, T.",
        "journal": "ICRA 2026",
        "year": "2026",
        "excerpt": "Bridging the gap between creative LLM reasoning and rigid industrial safety constraints.",
        "abstract": "We detail the implementation of neural solvers that translate natural language instructions into hard SAT constraints for robotic assembly lines.",
        "content": "Full manuscript content describing neural SAT constraint solver...",
        "pdfUrl": "https://arxiv.org/abs/2301.12597",
        "linkType": "preview",
        "imageUrl": img(3),
        "published": True
    }
]

def seed():
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Clear existing research from insights (old way)
    db["insights"].delete_many({"page": "research"})
    
    # Clear new research collection
    coll = db["research"]
    coll.delete_many({})
    
    now = datetime.now(timezone.utc)
    for doc in RESEARCH_DATA:
        doc["createdAt"] = now
        doc["updatedAt"] = now
        coll.insert_one(doc)
    
    print(f"🎉 Seeded {len(RESEARCH_DATA)} Research publications into 'research' collection.")
    client.close()

if __name__ == "__main__":
    seed()
