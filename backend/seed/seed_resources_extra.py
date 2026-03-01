
import os
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dreamatic_cms")

TECH_IMAGES = [
    "photo-1677442136019-21780ecad995",
    "photo-1620712943543-bcc4628c6a20",
    "photo-1550751827-4bd374c3f58b",
    "photo-1485827404703-89b55fcc595e",
    "photo-1581091226825-a6a2a5aee158",
    "photo-1614741118887-7a4ee193a5fa",
    "photo-1531297484001-80022131f5a1",
    "photo-1451187580459-43490279c0fa",
    "photo-1639762681485-074b7f938ba0",
    "photo-1518770660439-4636190af475",
]

def img(idx):
    key = TECH_IMAGES[idx % len(TECH_IMAGES)]
    return f"https://images.unsplash.com/{key}?auto=format&fit=crop&w=1200&q=80"

# ====================== 4 EVEN MORE BLOG POSTS ======================
EXTRA_BLOG_POSTS = [
    {
        "title": "Quantum-Classical Hybrid Networks for Edge Inference",
        "excerpt": "Exploring the feasibility of deploying hybrid quantum-classical neural networks at the edge for real-time sensor fusion in autonomous systems.",
        "content": """As we push the boundaries of edge intelligence, the computational requirements for complex sensor fusion—combining lidar, radar, and vision data in real-time—often exceed the thermals and power envelopes of mobile platforms. Hybrid quantum-classical networks offer a potential resolution to this bottleneck.

In this analysis, we detail our experiments with parameterized quantum circuits (PQCs) integrated into standard transformer architectures. By offloading high-dimensional feature mapping to quantum layers while maintaining classical logic for decision-making, we observed a significant reduction in total parameter count for equivalent accuracy markers.

The primary challenge remains the coherence time of current-generation NISQ (Noisy Intermediate-Scale Quantum) processors. However, through adaptive error mitigation and localized qubits, we have prototyped a system that maintains operational stability in simulated mobile environments. The transition from purely classical edge compute to quantum-assisted edge compute is no longer a matter of if, but when.""",
        "author": "DREAMATIC Quantum Lab",
        "page": "blog",
        "category": "Engineering",
        "date": "Mar 10, 2026",
        "imageUrl": img(7),
        "published": True,
    },
    {
        "title": "Natural Language to Workflow: The Future of Internal Tooling",
        "excerpt": "Why the next generation of internal enterprise tools won't involve buttons or dashboards, but dynamic agents that construct UI on the fly.",
        "content": """For decades, internal tooling has been defined by the 'Dashboard Paradigm'—static layouts with fixed buttons and forms. This paradigm is breaking under the weight of enterprise complexity. The future is 'Agentic Tooling,' where the interface is a conversation and the software is ephemeral.

Imagine a procurement manager who doesn't navigate three different ERP screens to approve a vendor but simply asks an agent to 'Audit the top 5 vendors for compliance and prepare approval drafts.' The agent doesn't just return text; it constructs a temporary dashboard specifically for this task, pulling in data from disparite APIs and presenting only the relevant controls.

This shift requires a fundamental re-architecture of the frontend. We are moveing from component-based UI to generative-UI, where agents utilize a DSL (Domain Specific Language) to describe the interface requires for a specific reasoning step. This ensures that the user is never overwhelmed by complexity and always has exactly the information they need.""",
        "author": "DREAMATIC UX Research",
        "page": "blog",
        "category": "Product",
        "date": "Mar 05, 2026",
        "imageUrl": img(8),
        "published": True,
    },
    {
        "title": "Sovereign Data: Navigating AI Training in a Post-GDPR World",
        "excerpt": "How enterprises can leverage their dark data for AI training while maintaining absolute compliance with increasingly strict global privacy regulations.",
        "content": """Data privacy is the single largest hurdle to enterprise AI adoption. Companies are sitting on mountaints of 'dark data'—proprietary, high-value information locked in silos because of privacy concerns. Unlocking this data for AI training without creating regulatory exposure is the holy grail of enterprise strategy.

DREAMATIC's Sovereign Learning framework utilizes federated learning and differential privacy to ensure that no raw sensitive data ever leaves the secure entity environment. Instead, models are trained locally within encrypted enclaves, and only anonymized gradient updates are shared with the global model.

This ensures that the enterprise benefits from the collective intelligence of its entire organization without ever compromising the privacy of individual records. As global regulations like the AI Act and GDPR evolve, sovereign data architectures will become the only viable path for high-performance enterprise intelligence.""",
        "author": "DREAMATIC Compliance Group",
        "page": "blog",
        "category": "Strategy",
        "date": "Feb 28, 2026",
        "imageUrl": img(9),
        "published": True,
    },
    {
        "title": "The 100-Agent Company: A New Organizational Blueprint",
        "excerpt": "What does a company look like when every human employee is supported by 10 specialized AI agents? Rethinking departmental structure for the agentic age.",
        "content": """We are entering the age of the 'Augmented Enterprise.' The old organizational charts—defined by human headcount and reporting lines—are becoming obsolete. The new blueprint is defined by 'Agent Density.'

In the 100-agent company, departments are not silos of people, but clusters of agent-human teams. A single marketing manager might coordinate a swarm of 20 agents handling everything from SEO optimization to real-time ad bidding and content localization. This isn't about job replacement; it's about scope expansion.

The challenge for leadership in this era is not managing tasks, but managing agentic orchestration. The ability to design, deploy, and audit swarms of agents will be the defining leadership skill of the next decade. Companies that embrace this blueprint early will achieve a scale of operation that was previously impossible for organizations of their size.""",
        "author": "DREAMATIC Executive Team",
        "page": "blog",
        "category": "Strategy",
        "date": "Feb 20, 2026",
        "imageUrl": img(0),
        "published": True,
    },
]

# ====================== 4 EVEN MORE HUB RESOURCES ======================
EXTRA_HUB_RESOURCES = [
    {
        "title": "Agentic DevOps: The Engineering Manager's Guide",
        "excerpt": "Moving beyond CI/CD to autonomous infrastructure—how to deploy agents that manage your cloud spend, optimize kubernetes, and self-heal production environments.",
        "content": """DevOps has traditionally been about automation. Agentic DevOps is about agency. This resource details how to move from static YAML pipelines to dynamic agents that perceive infrastructure state and take autonomous corrective action.

Key sections include: 
1. Real-time Cloud Cost Optimization Agents
2. Autonomous Incident Root Cause Analysis
3. Self-Healing Kubernetes clusters with LLM-based logic
4. Scaling Developer Productivity with Agent-Assisted Code Review""",
        "author": "DREAMATIC Cloud Team",
        "page": "hub",
        "type": "GUIDE",
        "imageUrl": img(1),
        "published": True,
    },
    {
        "title": "Healthcare AI Framework: High-Stakes Decision Support",
        "excerpt": "A white paper on the technical and ethical requirements for deploying AI agents in clinical settings, with a focus on auditability and physician-in-the-loop.",
        "content": """Deploying AI in healthcare requires a 'Safety-First, Always' architecture. This white paper outlines the DREAMATIC Clinical Safety Framework, which ensures that every agentic decision in a triage or diagnostic workflow is backed by peer-reviewed evidence and high-confidence uncertainty markers.

We explore the use of Conformal Prediction in medical triage and the implementation of immutable reasoning logs for regulatory audit. This is the roadmap for safe, effective, and compliant healthcare AI.""",
        "author": "DREAMATIC Healthcare Research",
        "page": "hub",
        "type": "WHITE PAPER",
        "imageUrl": img(2),
        "published": True,
    },
    {
        "title": "Building the Autonomous Legal Department",
        "excerpt": "A case study on how a global tech firm automated 60% of contract review and compliance monitoring using a swarm of specialized legal agents.",
        "content": """Contract review is the ultimate bottleneck for agile enterprises. In this case study, we document how a Fortune 500 company deployed a network of 15 specialized legal agents to handle NDAs, MSAs, and international compliance filings.

The results: 
- 85% reduction in NDA turnaround time
- 40% reduction in external legal spend
- 100% compliance coverage for new regional regulations""",
        "author": "DREAMATIC Legal Solutions",
        "page": "hub",
        "type": "CASE STUDY",
        "imageUrl": img(3),
        "published": True,
    },
    {
        "title": "Production-Grade RAG: From Prototype to Enterprise Scale",
        "excerpt": "A technical masterclass on building Retrieval-Augmented Generation systems that don't hallucinate and can handle millions of documents with sub-second latency.",
        "content": """RAG is easy to prototype, but notoriously hard to scale. This tutorial covers the advanced engineering techniques required for production grade performance: 
- Multi-Stage Re-ranking
- Dynamic Context Injection
- Hypothetical Document Embeddings (HyDE)
- Automated Evaluation with RAGAS""",
        "author": "DREAMATIC Engineering",
        "page": "hub",
        "type": "TUTORIAL",
        "imageUrl": img(4),
        "published": True,
    },
]

# ====================== 4 EVEN MORE RESEARCH PUBLICATIONS ======================
EXTRA_RESEARCH_PUBLICATIONS = [
    {
        "title": "Zero-Shot Cross-Lingual Policy Transfer in Agentic Swarms",
        "excerpt": "A new approach to training agents that can transfer complex operational policies across human languages without retraining, using a shared semantic logic layer.",
        "content": """Abstract: We introduce Zero-Shot Policy Transfer (ZSPT), a method for training multi-agent systems where operational logic is decoupled from linguistic expression. By mapping agent intent to a high-dimensional, language-agnostic latent space, we demonstrate that agents trained exclusively in English can execute complex workflows on non-English interfaces with only a 4.2% drop in completion accuracy.

This represents a significant leap forward for global enterprise deployments, where localized training data is often scarce but operational requirements are consistent across regions.""",
        "author": "Chen, J., Singh, A.",
        "page": "research",
        "journal": "CVPR 2026",
        "year": "2026",
        "pdfUrl": "https://arxiv.org/abs/2026.00005",
        "imageUrl": img(5),
        "published": True,
    },
    {
        "title": "Scaling Laws for Autonomous Agent Reasoning Horizons",
        "excerpt": "Empirical analysis of the relationship between model size, context window density, and the maximum reasoning steps an agent can take before policy collapse.",
        "content": """Abstract: We identify a 'Reasoning Horizon Wall' in current-generation LLM agents, where the probability of task success decays exponentially relative to the number of sequential reasoning steps. We provide a mathematical model for this decay and propose a 'Context Refreshment' algorithm that extends the effective reasoning horizon by 5x through dynamic state compression.

This research has direct implications for the design of long-horizon enterprise workflows, such as multi-week financial audits or complex product engineering cycles.""",
        "author": "Williams, T., Martinez, R.",
        "page": "research",
        "journal": "NeurIPS 2025",
        "year": "2025",
        "pdfUrl": "https://arxiv.org/abs/2025.00006",
        "imageUrl": img(6),
        "published": True,
    },
    {
        "title": "Privacy-Preserving Federated Reinforcement Learning for Enterprise AI",
        "excerpt": "A novel framework for training high-performance agents across siloed enterprise data using Sharded Differential Privacy and Secure Multi-Party Computation.",
        "content": """Abstract: We address the challenge of training multi-agent systems in environments where data cannot be centralized due to regulatory or security constraints. We introduce Federated S-PPO (Proximal Policy Optimization), which enables agents to learn from diverse, distributed datasets while guaranteeing that individual records remain private to their home silo.

Our benchmarks show that Federated S-PPO achieves 96% of the performance of centralized training with a provable privacy budget of ε=1.0. This framework is already in pilot with multiple global banking institutions.""",
        "author": "Okonkwo, S., Singh, A.",
        "page": "research",
        "journal": "KDD 2025",
        "year": "2025",
        "pdfUrl": "https://arxiv.org/abs/2025.00007",
        "imageUrl": img(7),
        "published": True,
    },
    {
        "title": "Neuro-Symbolic Planning for Complex Industrial Orchestration",
        "excerpt": "Combining the creative reasoning of LLMs with the rigid logic of symbolic solvers to create agents that are both flexible and architecturally safe in industrial settings.",
        "content": """Abstract: We present NSP-Agent, an architecture that combines Large Language Models with SMT (Satisfiability Modulo Theories) solvers. The LLM acts as the creative planner, while the symbolic solver acts as the 'Physics Engine' that validates every plan against hard architectural constraints before execution.

In industrial robotics and hazardous environment monitoring, NSP-Agent eliminates 'hallucinatory actions' that could lead to physical safety violations, while maintaining the flexibility to handle novel, unscripted scenarios.""",
        "author": "Martinez, R., Williams, T.",
        "page": "research",
        "journal": "AISTATS 2026",
        "year": "2026",
        "pdfUrl": "https://arxiv.org/abs/2026.00008",
        "imageUrl": img(8),
        "published": True,
    },
]

def seed_extra_resources():
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    collection = db["insights"]

    all_items = EXTRA_BLOG_POSTS + EXTRA_HUB_RESOURCES + EXTRA_RESEARCH_PUBLICATIONS
    from datetime import timezone
    now = datetime.now(timezone.utc)
    inserted = 0

    for item in all_items:
        doc = {**item, "createdAt": now, "updatedAt": now}
        collection.insert_one(doc)
        print(f"  ✅ [{item['page'].upper()}]: {item['title'][:65]}...")
        inserted += 1

    print(f"\n🎉 Seeded {inserted} EXTRA resource entries!")
    client.close()

if __name__ == "__main__":
    seed_extra_resources()
