---
title: 2026 - The Year We need Operators - (Autonomous Worker Operators)
date: "2026-01-07T00:05:25.169Z"
description: I recently wrote about how [ProteusAI is moving from building a tool to an Operator](https://medium.com/@walecloud/2025-reflection-we-stopped-building-a-tool-and-started-building-an-operator-26a55f3da9ac) and OnBuddy being the Autonomous Worker Operator that the world truly needed to get past the frenzy of merely AI assisted softwares and tools.
featuredImage: ./img/autonomous-worker-operator.png
category: ["tech", "artificial-intelligence"]
---

**After building AI systems at ProteusAI, I've come to a realization that challenges the current trajectory of AI development.**

I recently wrote about how [ProteusAI is moving from building a tool to an Operator](https://medium.com/@walecloud/2025-reflection-we-stopped-building-a-tool-and-started-building-an-operator-26a55f3da9ac), with OnBuddy being the Autonomous Worker Operator that will move us past the frenzy of merely AI-assisted software and closer to genuine [AI Agency](#ai-agency) in daily work activities.

 **It's not enough that AI knows the goal of a task or the finished outcome of an existing system.** It needs to know the *reasoning* behind the choices that were made to get to that point, how those choices came about, who debated them, and why alternatives were rejected.

There has to be a stronger "context link" to achieve true AI Agency. Without it, we're building sophisticated tools, not autonomous operators.

I've concluded that this context-link is **presence**.
An ontology problem here. Time series event captured realtime, not the final state.

The AI "entity" has to be present at every intersection long before the action-from when the first debate (in-person, online) occurred, through subsequent ideas filtered out over a Slack thread and be intelligent enough to know how it all ties together.

There's an obvious problem here, having a sort of omnipresent entity in different places raises serious privacy, security concerns and also implementation challenges for physical and online world modelling.

Solving Data Fragmentation amongst tools today is a likely solution but you can't fix *presence* by more MCP or carrying-over context. ***Seems like the obvious current solution path at the time of this writing.***

****I don't have a complete solution yet—but I believe the critical first step is building an Autonomous Worker Operator****

## First, Let's define what we mean by Operator & AI Agency

- Operator:: I define an Operator as any entity (human, machine) with the ability and action of carrying out objectives defined clearly or not, across different key results and having the ability to measure, improve and report its outcome.

<a id="ai-agency"></a>

- AI Agency:: This is not so much different from AI agents except that AI agency is akin to human agency of using its initiative to solve problems without being prompted to do so in the first place.

Now with that in mind, lets get into Autonomous Worker Operator...

## Autonomous Worker Operator

This is an Operator with super high agency. This is an A-Player type team member that plans, executes, forecasts, future-proofs its work and continuously delivers quality outcomes wherever it is deployed with almost no supervision or retraining.

### What's the point of this you might ask?

Well, as AI models evolve and LLMs get better, we've seen how we struggle to get them to closely mimic human abilities beyond text prediction and generation, into the industry professions that go beyond some form of language processing. We've seen OpenAI with forms and functions, Anthropic with MCPs for tool calling.

We have gotten software to be able to do this via under-the-hood API calling.

What if the Models can understand tools without doing it via function calls, MCPs, etc.—its native, similar to how they can accurately predict and generate the next combination of a writeup. What if an AI system actually understands the current work environment of a human that isn't a software engineer? (I believe Claude Code is the closest thing to what I'm describing; it's still natively language-generating but with more smoothness to using the terminal, GitHub, etc.)

For a "classic profession" like in HR, Operations, Procurement, marketing, etc... what is the closest version of Claude Code for these functions? What would that look like? It can't live in the terminal obviously as these functions interact with real humans, external systems, humans from other organizations, disconnected tools and services, etc.

**This is the question I'm obsessed with solving.** If you're working in these spaces, I'd love to hear your thoughts on what an AWO would look like for your function.

I believe it's a gradual progression from specific AI agents, chaining multiple agent workflows to achieve a specific task. The problem is this type of agent isn't environment-aware and can't function outside the designed functions assigned to it.

An AI agent for recruiting will struggle to do procurement as the environment of such functions differ in both processes and tools involved.

An AWO should be able to function outside its pre-trained environment when faced with new work environments and do so with very little to no retraining.

## Let's examine a Classic Worker scenario

The average modern employee revolves around ~7 tools at least with each having some form of AI-assistance in there.

It's no longer a case of too many tools with no actual use case but a case of too many AI assistants with less context-link between them.

Think about it: You start drafting a proposal in Notion (AI suggests better phrasing), move to Slack to discuss with your team (AI summarizes threads), jump to your CRM (AI scores leads), schedule meetings in Calendar (AI finds optimal times), review documents in Google Docs (AI corrects grammar), analyze data in your BI tool (AI generates insights), and finally report in your project management tool (AI updates status).

Each AI thinks it's helping. None of them know what you're actually trying to accomplish.

**This fragmentation is precisely why we need AWOs, not more AI features.**

## So what's stopping us from building true AWOs?

I see three major blockers:

### 1. The Context Problem

Current AI agents operate on a snapshot. They see the final state, not the journey. It needs to understand not just *what* was decided, but *why* it was decided, *who* was involved, and *what alternatives* were considered.

### 2. The Environment Problem

Most AI agents are highly specialized. Train an agent for customer support, and it's useless in HR, rightfully so. Train it for procurement, and it can't do marketing. It needs to be environment-aware enough to transfer knowledge and abilities of functions across domains with minimal retraining.

*I think this is the hardest problem to solve, it titling towards AGI.*

### 3. The Agency Problem

AI assistants wait for prompts. They don't take initiative. They don't identify problems before you ask. They don't continuously improve their own performance. **An AWO needs true agency—the ability to act autonomously on objectives, not just respond to commands.**

At ProteusAI, we're tackling these problems head-on with OnBuddy. I don't have all the answers yet, but I'm convinced we're on the right path.

---

## Where I think this is headed

**Specialized AWOs**
We'll see the first wave of AWOs emerge in specific functions—probably starting with knowledge work that's highly digital and measurable. Think: customer success, content operations, data analysis.

**Cross-functional AWOs**
AWOs will start bridging functions. An AWO that handles customer success will begin to understand product feedback loops. An AWO for recruiting will start to grasp team dynamics and project staffing needs and planning for it in the Quarter.

**Adaptive AWOs**
This is where it gets interesting. AWOs that can enter completely new work environments and figure out how to be useful without extensive retraining. True generalists with deep contextual intelligence.

I know this sounds ambitious. Maybe overly so. But w've seen alot of exponential improvements in the space in the last 3 years, i'm not betting against it.

---

## An open question for builders

If you're building in this space or thinking about these problems, I genuinely want to know:

**What does presence mean in your domain?**

For software engineers, it's thr PRD doc, discoivery calls, terminal history, git commits, code reviews, CI/CD logs. For designers, it's figma comments, iteration history, design critiques. But what about HR? What about operations? What about sales?

Where does the context live, and how do we make an AI entity truly *present* without crossing ethical and privacy boundaries?

I'm still working through this. I suspect the answer isn't purely technical.

---

## Last note

The best team members don't wait to be told what to do. They understand context. They take initiative. They deliver outcomes, not just outputs. They continuously improve. They adapt to new challenges, the have High Agency.

At ProteusAI, we've spent the last year moving from "how do we build better AI tools?" to "how do we build AI that can truly work alongside humans? with its own ability to carry out work" OnBuddy is our answer to that question. It's early, it's ambitious, and honestly, we're learning as we build.

---

## Let's talk about this

This post is me thinking out loud, working through problems in public. I don't have all the answers. But I do have strong convictions about where we need to go, and I'm building towards that every day.

If you're a scaling organization, hiring and growing rapidly, or working on similar problems or if you think I'm completely wrong about this, please reach out, happy to have a chat over virtual a coffee.

- **CEOs, COOs, CHRO** Hiring, growing headcount, optimizing your people processess.
- **Builders** creating AI agents, operators, or autonomous systems
- **Operators** in HR, Ops, Procurement, Marketing, etc. who can help me understand what presence means in your domain
- **Researchers** working on context-aware AI, multi-agent systems, or AI agency
- **Skeptics** who think AWOs are overhyped or impossible—I learn the most from people who disagree

---

*If you found this interesting, you might also want to read my previous post on [why we stopped building a tool and started building an operator](https://medium.com/@walecloud/2025-reflection-we-stopped-building-a-tool-and-started-building-an-operator-26a55f3da9ac). And if you want to see OnBuddy in action or learn more about what we're building at ProteusAI, please reach out—I'd love to show you what we're working on.*
