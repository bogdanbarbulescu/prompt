# 💡 LLM Prompt Library

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)

A professional, modern web application for storing, organizing, searching, and utilizing prompts for Large Language Models. Built with React, TypeScript, and a premium dark theme.

![App Screenshot](https://github.com/bogdanbarbulescu/prompt/blob/main/LLM-Prompt-Lib.jpg)

## ✨ Features

### Core Functionality
- **📊 Dashboard Overview** - Total prompt and category counts with quick access cards
- **📁 37 Prompt Categories** - Comprehensive organization from coding to marketing
- **🔍 Powerful Search** - Live search with type-ahead suggestions
- **📋 One-Click Copy** - Copy any prompt instantly to clipboard

### Interactive Features
- **⭐ Favorites System** - Save your most-used prompts for quick access
- **🕐 Recently Used** - Track and access your prompt history
- **🎯 Variable Fill Modal** - Smart form for prompts with `{placeholders}`
  - Auto-detects variables in prompts
  - Live preview as you fill values
  - Copy filled or raw version

### Prompt Categories

| Category | Description |
|----------|-------------|
| **General** | Summarization, explanation, brainstorming |
| **Problem Solving** | Decision frameworks, root cause analysis |
| **Writing** | Blog posts, emails, SEO content |
| **Coding** | Code generation, debugging, reviews |
| **Image Creation** | AI art prompts for DALL-E, Midjourney, Stable Diffusion |
| **Workflows** | Full-stack development with Antigravity (idea → production) |
| **Claude Code** | CLI-based autonomous development prompts |
| **Data Analysis** | Reports, insights, visualization |
| **Marketing** | Campaigns, social media, SEO |
| **Project Management** | Planning, tracking, retrospectives |
| *...and 27 more* | UX/UI, Sales, Research, Education, etc. |

### Design
- **🌙 Premium Dark Theme** - Glassmorphism, gradients, modern aesthetics
- **📱 Fully Responsive** - Desktop, tablet, and mobile optimized
- **✨ Smooth Animations** - Polished micro-interactions

## 🚀 Live Demo

[**View Live Demo →**](https://bogdanbarbulescu.github.io/prompt/)

## 🛠️ Tech Stack

- **React 18** - Component-based UI
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **CSS3** - Custom properties, Grid, Flexbox
- **LocalStorage** - Persist favorites and history

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/bogdanbarbulescu/prompt.git
cd prompt

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
prompt/
├── public/
│   └── prompts.json        # All prompts data
├── src/
│   ├── components/
│   │   ├── Header.tsx      # Search bar, navigation
│   │   ├── Sidebar.tsx     # Categories, favorites
│   │   ├── Dashboard.tsx   # Overview stats
│   │   ├── PromptList.tsx  # Category view
│   │   ├── PromptCard.tsx  # Individual prompt
│   │   └── VariableFillModal.tsx  # Placeholder editor
│   ├── hooks/
│   │   └── useFavorites.ts # Favorites & history logic
│   ├── App.tsx
│   └── main.tsx
├── best-prompts.md         # Curated prompts reference
└── README.md
```

## ➕ Adding Prompts

Edit `public/prompts.json`:

```json
{
  "category_name": [
    {
      "title": "Your Prompt Title",
      "prompt": "The prompt text with {placeholder} variables.",
      "language": "text"
    }
  ]
}
```

### Variable Syntax
Use `{variable_name}` for fillable placeholders:
```json
{
  "title": "Code Review",
  "prompt": "Review this {language} code for {focus_areas}:\n\n{code}",
  "language": "text"
}
```

## 🎯 Special Categories

### Workflows (Antigravity)
25 prompts for building full-stack web apps with AI assistance:
- 🎯 Ideation & MVP definition
- 📋 Architecture & database design
- 💻 Frontend & backend development
- ✅ Testing & deployment

### Claude Code
25 prompts optimized for CLI-based autonomous development:
- 🏁 Project initialization with CLAUDE.md
- 🔨 End-to-end feature building
- 🤖 Headless automation commands

### Image Creation
30+ prompts for AI image generation:
- Cinematic portraits & photography
- 3D renders & isometric assets
- UI mockups, icons, logos
- Anime, watercolor, steampunk styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

Made by [Bogdan Barbulescu](https://github.com/bogdanbarbulescu)

---

**Found this useful?** ⭐ Star the repo to show support!
