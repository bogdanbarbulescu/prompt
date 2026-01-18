# 🎯 Ultimate LLM Prompts Collection

A curated collection of the most effective and battle-tested prompts for ChatGPT, Claude, Gemini, and other LLMs. Sourced from the best community resources including [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) (143k+ stars), [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) (66k+ stars), and expert practitioner insights.

---

## Table of Contents

1. [🧠 Thinking & Problem Solving](#-thinking--problem-solving)
2. [💻 Coding & Development](#-coding--development)
3. [✍️ Writing & Content Creation](#️-writing--content-creation)
4. [📊 Data Analysis & Research](#-data-analysis--research)
5. [📱 Social Media & Marketing](#-social-media--marketing)
6. [🚀 Productivity & Work](#-productivity--work)
7. [🎭 Personas & Role-Playing](#-personas--role-playing)
8. [🔧 Advanced Techniques](#-advanced-techniques)

---

## 🧠 Thinking & Problem Solving

### Strategic Thought Partner
```
You are my thought partner. Help me map out possible approaches to {complex_problem}, compare trade-offs, and suggest a decision-making framework I can use.
```

### Root Cause Analysis
```
Act like a senior engineer doing a bug triage. List the top 5 most likely root causes for this issue, ranked by probability. Explain how you'd test each one fast.

Symptoms:
- {symptom_1}
- {symptom_2}

Stack: {frameworks_and_versions}
```

### Critical Document Analysis
```
Read this technical document and extract:
a) Implicit assumptions
b) Unstated dependencies
c) Potential edge cases

Then, suggest where this plan might break under real-world pressure.

Document:
{paste_document}
```

### Decision Matrix Builder
```
I'm deciding between {option_1}, {option_2}, and {option_3} for {context}.

Create a weighted decision matrix with these criteria:
- Cost
- Time to implement
- Risk level
- Long-term scalability
- Team expertise required

Rate each option 1-5 and provide a recommendation with reasoning.
```

### First Principles Breakdown
```
Break down {complex_concept} from first principles. Assume I understand the basics but want to truly understand why things work the way they do. Use concrete examples.
```

---

## 💻 Coding & Development

### Code Generation (Detailed)
```
Generate a {language} function named '{function_name}' that:
1. Accepts the following parameters: {param_1 (type)}, {param_2 (type)}
2. Performs the following logic: {describe_detailed_logic}
3. Returns {return_type_and_description}
4. Handles edge cases: {list_edge_cases}
5. Includes inline comments explaining key decisions
```

### Debugging Expert
```
I'm getting an error in my {language} code.

Error message:
{paste_error_message}

My code:
{paste_code_snippet}

Goal: {what_the_code_should_do}

Please:
1. Explain the error in simple terms
2. Identify the root cause
3. Suggest a fix with explanation
4. Recommend how to prevent similar errors
```

### Code Review (Production Quality)
```
Review this PR like a tough but fair reviewer. Focus on:
- Maintainability
- Edge cases
- Long-term risks
- Security vulnerabilities

Skip style nitpicks unless they matter.

{paste_pr_diff_or_code}
```

### Architecture Design
```
Design a {system_type} architecture for {use_case} that handles:
- {requirement_1}
- {requirement_2}
- Expected scale: {scale_info}

Include:
1. Component diagram (describe textually)
2. Data flow
3. Technology recommendations with rationale
4. Potential bottlenecks and mitigations
```

### Refactoring Guide
```
Refactor the following {language} code to improve its:
- Readability
- Maintainability
- Adherence to {SOLID/DRY/KISS} principles

Current code:
{paste_code}

Explain each change you make and why.
```

### Documentation Writer
```
Write documentation for this code like the next developer is smart but impatient.
- Use examples
- Explain why decisions were made
- Focus on "why" not just "what"

Code:
{paste_code}
```

### Learning Roadmap
```
Act as a senior engineer. Help me plan my learning path to become a {role} in {timeframe}.

Include:
1. Must-learn concepts in priority order
2. Tools I should master
3. Real-world projects to build
4. Resources (free when possible)
5. Milestones to track progress
```

---

## ✍️ Writing & Content Creation

### Blog Post Framework
```
Create an engaging blog post about {topic} for {target_audience}.

Requirements:
- Attention-grabbing headline
- Hook in the first paragraph
- 3-5 main sections with H2 headers
- Practical examples or case studies
- Call-to-action at the end
- Word count: approximately {word_count}
- Tone: {professional/conversational/technical}
```

### Content Outline (SEO-Optimized)
```
Create an SEO content outline for a {word_count}-word article on "{topic}".

Include:
- Primary keyword: {primary_keyword}
- Secondary keywords: {keyword_2}, {keyword_3}
- Headers from H1 to H4
- Key points under each section
- Suggested internal/external links
- Meta description (155 chars max)
```

### Email Copywriting
```
Write a {type} email for {purpose}.

Context:
- Audience: {target_audience}
- Goal: {desired_action}
- Tone: {formal/friendly/urgent}
- Previous interaction: {context_if_any}

Include:
- Subject line (A/B test two versions)
- Preview text
- Body with clear CTA
```

### Rewrite for Clarity
```
Rewrite the following text to be clearer and more concise. Remove jargon and make it accessible to someone without background in {field}. Keep the core message intact.

Original:
{paste_text}
```

### Storytelling Hook
```
Generate 5 different opening hooks for a story/article about {topic}. Each hook should use a different technique:
1. Surprising statistic
2. Provocative question
3. Vivid scene-setting
4. Personal anecdote format
5. Contrarian statement
```

---

## 📊 Data Analysis & Research

### Data Summary
```
Provide a comprehensive summary of this dataset:
- Key statistics (mean, median, std dev, range)
- Data types and missing values
- Distribution characteristics
- Notable outliers or anomalies
- Initial insights worth exploring

Dataset:
{paste_or_describe_data}
```

### Research Synthesis
```
Summarize the key findings from this research on {topic}:
1. Main conclusions
2. Methodology strengths/weaknesses
3. Practical implications
4. Gaps for future research
5. How this relates to {my_context}

Research:
{paste_abstract_or_findings}
```

### Executive Summary Generator
```
Create an executive summary of this report for {audience_type}.

Focus on:
- 3-5 key findings
- Business implications
- Recommended actions with priority levels
- Risks if no action taken

Keep it under 300 words.

Report:
{paste_report}
```

### Trend Analysis
```
Analyze these trends in {industry/topic}:

Data points:
{paste_data}

Provide:
1. Pattern identification
2. Likely drivers behind trends
3. Predictions for next {timeframe}
4. Confidence level in predictions
5. Key assumptions made
```

### Literature Review Helper
```
Help me structure a literature review on {topic}.

Based on these sources:
{list_sources_or_key_points}

Organize by:
1. Key themes/theories
2. Chronological development
3. Methodological approaches
4. Gaps in existing research
5. How my research fits in
```

---

## 📱 Social Media & Marketing

### Social Media Post Generator
```
Create {number} social media posts for {platform} about {topic}.

Requirements:
- Target audience: {audience}
- Tone: {brand_voice}
- Include relevant hashtags
- Character limit: {limit}
- Include a call-to-action
- Emoji usage: {light/moderate/heavy}
```

### LinkedIn Thought Leadership
```
Write a LinkedIn post that establishes expertise in {topic}.

Structure:
1. Hook (first line that stops scrolling)
2. Personal insight or experience
3. 3-5 actionable takeaways
4. Conversation starter question
5. Relevant hashtags (max 5)

Tone: Professional but personable
Length: 1300 characters max
```

### Ad Copy (Multiple Platforms)
```
Write ad copy for {product/service} targeting {audience}.

Create versions for:
1. Facebook/Instagram (125 chars headline, 125 chars body)
2. Google Ads (30 char headlines x3, 90 char descriptions x2)
3. LinkedIn (150 char intro, 70 char headline)

USP: {unique_selling_point}
CTA: {desired_action}
```

### Content Calendar
```
Create a {duration} content calendar for {brand/product} on {platforms}.

Goals: {primary_goal}
Themes to cover: {theme_1}, {theme_2}, {theme_3}

For each post include:
- Date
- Platform
- Content type (carousel, video, text, etc.)
- Topic/hook
- Key message
- CTA
```

### Competitor Content Analysis
```
Act as a content strategist. I'm targeting "{keyword}" in {industry}.

Analyze what competitors might be doing and suggest:
1. 5 content gaps they're likely missing
2. Unique angles I can take
3. Content formats that would stand out
4. Distribution strategy recommendations
```

---

## 🚀 Productivity & Work

### Task Prioritization
```
Analyze this task list and organize it by:
1. Deep work vs. shallow work vs. collaborative work
2. Urgency and importance (Eisenhower matrix)
3. Energy level required

Then create an optimized weekly schedule with:
- Time blocks
- Buffer time between tasks
- Realistic estimates

Tasks:
{paste_task_list}
```

### Meeting Agenda Builder
```
Create a focused meeting agenda for: {meeting_purpose}

Attendees: {list_attendees}
Duration: {time_available}

Include:
1. Clear objectives (max 3)
2. Discussion topics with time allocations
3. Pre-work required from attendees
4. Decision items vs. discussion items
5. Action items template for notes
```

### Project Breakdown
```
Break down this project into manageable tasks over {timeframe}:

Project: {project_description}
Goal: {end_goal}
Constraints: {budget/time/resources}

Provide:
1. Milestone list with dates
2. Dependencies between tasks
3. Risk factors and mitigations
4. Quick wins in first week
5. Definition of done for each phase
```

### Email Templates
```
Create reusable email templates for these common scenarios:
1. Follow-up after no response (polite)
2. Declining a request professionally
3. Asking for feedback
4. Introducing yourself to a new contact
5. Scheduling a meeting

Make them customizable with [PLACEHOLDERS].
```

### Weekly Review Questions
```
Generate a set of weekly review questions that help me:
1. Assess what went well
2. Identify what needs improvement
3. Clarify priorities for next week
4. Track progress on long-term goals
5. Maintain work-life balance

Make them specific and actionable, not generic.
```

---

## 🎭 Personas & Role-Playing

### Linux Terminal Simulator
```
I want you to act as a Linux terminal. I will type commands and you will reply with what the terminal should show. Only reply with the terminal output inside one unique code block, nothing else. Do not write explanations. My first command is: {command}
```

### Tech Interviewer
```
I want you to act as an interviewer for a {position} role. You will ask me technical questions one at a time and evaluate my answers. Don't ask all questions at once. Wait for my response before moving to the next question. Start with an introduction.
```

### Socratic Tutor
```
You are a Socratic tutor. Help me understand {topic} by asking probing questions rather than giving direct answers. Guide me to discover insights myself. If I'm stuck, give hints not solutions. Start with an opening question.
```

### Devil's Advocate
```
Take the opposing view on {topic/idea}. Argue against it as convincingly as possible, pointing out:
1. Logical flaws in the reasoning
2. Potential negative consequences
3. Alternative interpretations
4. Historical examples that contradict it

Be respectful but rigorous. Don't hold back.
```

### Subject Matter Expert
```
You are a world-renowned expert in {field} with {years} years of experience. I will ask you questions about {topic}. Answer with the depth and nuance of a true expert, including:
- Cutting-edge developments
- Common misconceptions
- Practical applications
- Areas of ongoing debate

If something is outside your expertise, say so.
```

---

## 🔧 Advanced Techniques

### Chain of Thought
```
Solve this problem step by step, showing your reasoning at each stage:

Problem: {describe_problem}

Before giving the final answer:
1. Identify what type of problem this is
2. List relevant information
3. Consider multiple approaches
4. Work through the most promising approach
5. Verify the answer makes sense
```

### Self-Consistency Check
```
Generate 3 independent solutions to this problem, using different approaches each time. Then compare them and identify:
1. Where they agree (high confidence)
2. Where they disagree (needs review)
3. The most robust answer and why

Problem: {describe_problem}
```

### Prompt Improvement
```
Improve this prompt to get better results from an LLM:

Original prompt:
{paste_prompt}

Make it:
1. More specific
2. Include clear output format
3. Add relevant constraints
4. Include examples if helpful
5. Define success criteria

Explain why each change improves it.
```

### Meta-Prompting
```
Design a prompt template for {use_case} that I can reuse.

The template should:
1. Have clear [PLACEHOLDERS] for customization
2. Include role/persona assignment
3. Specify output format
4. Handle edge cases
5. Be optimized for {model_name}

Test it with an example use case.
```

### Multi-Agent Simulation
```
Simulate a discussion between {expert_1} and {expert_2} debating {topic}.

Each should:
- Stay in character
- Reference their expertise
- Challenge each other's points
- Build on good ideas

After 4-5 exchanges, provide a synthesis of the key insights from both perspectives.
```

---

## 📚 Best Practices

### The R.A.I.L. Framework

For any prompt, consider:
- **R**ole: Assign a specific persona/expertise
- **A**ction: Clearly state what you want
- **I**nput: Provide all necessary context
- **L**imits: Specify constraints and format

### Example
```
[R] You are a senior technical writer at a Fortune 500 company.
[A] Create documentation for this API endpoint.
[I] Here's the code: {code}
[L] Use markdown format, keep it under 500 words, focus on practical usage.
```

### Tips for Better Results

1. **Be specific** - Vague prompts = generic answers
2. **Provide examples** - Show don't tell
3. **Iterate** - Treat it as a conversation
4. **Set constraints** - Word limits, format, tone
5. **Ask for reasoning** - "Explain your thinking"

---

## 🔗 Resources

- [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) - 143k+ stars
- [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) - 66k+ stars
- [Claude Prompting Guide](https://docs.anthropic.com/claude/docs/prompting-guide)
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

---

> **Note**: Prompts work best when customized to your specific context. Use these as starting points and iterate based on your results.

*Last updated: January 2026*
