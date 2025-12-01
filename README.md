# Kshitiz Kumar - Cybersecurity Analyst Portfolio

A high-performance, responsive portfolio website showcasing cybersecurity projects, skills, and experience. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

![Portfolio Preview](./public/og-image.jpg)

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Stunning Animations**: Framer Motion for smooth, performant animations
- **MDX Content**: Git-backed content management for projects
- **Accessible**: WCAG AA compliant with keyboard navigation
- **SEO Optimized**: Server-side rendering, structured data, sitemap
- **Performance**: Lighthouse score ≥90, optimized images with next/image
- **Dark Theme**: Cyan accent colors with dark background
- **Responsive**: Mobile-first design, fluid typography

## 🎨 Design System

### Colors
- **Dark Background**: `#0A0A0A`
- **Cyan Accent**: `#00D9FF`
- **Secondary Cyan**: `#0EA5E9`
- **Card Background**: `#1F1F1F`

### Typography
- **Display Font**: Space Grotesk (hero sections, headings)
- **Body Font**: Inter (paragraphs, UI elements)

## 📁 Project Structure

```
/portfolio-kshitiz
├── app/
│   ├── components/          # React components
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── ExpertiseGrid.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGallery.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── projects/
│   │   ├── page.tsx         # All projects page
│   │   └── [slug]/page.tsx  # Dynamic project pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── not-found.tsx        # 404 page
│   ├── sitemap.ts           # Dynamic sitemap
│   └── globals.css          # Global styles
├── content/
│   └── projects/            # MDX project files
│       ├── ark-surveillance.mdx
│       ├── collegia.mdx
│       ├── phishing-detector.mdx
│       ├── e-voting.mdx
│       ├── mobile-pentest.mdx
│       └── windows-internals.mdx
├── lib/
│   ├── mdx.ts              # MDX utilities
│   └── constants.ts        # Site configuration
├── public/
│   ├── images/             # Images and assets
│   └── robots.txt
├── types/
│   └── index.ts            # TypeScript types
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Radix UI**: Accessible component primitives

### Content Management
- **Git-backed MDX**: Markdown with JSX for project content
- **gray-matter**: Frontmatter parsing
- **next-mdx-remote**: Server-side MDX rendering

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ installed. This project uses npm for package management.

### Installation

1. **Clone the repository** (or navigate to your project directory):
   ```bash
   cd /path/to/portfolio-kshitiz
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

The page auto-updates as you edit files.

## 📝 Content Management

### Adding a New Project

1. Create a new MDX file in `content/projects/`:
   ```bash
   touch content/projects/my-new-project.mdx
   ```

2. Add frontmatter and content:
   ```mdx
   ---
   title: "My New Project"
   description: "A brief description of the project"
   tags: ["Security", "Python"]
   image: "/images/projects/my-new-project.jpg"
   repoUrl: "https://github.com/username/repo"
   liveUrl: "https://project-demo.com"
   techStack: ["Python", "Flask", "PostgreSQL"]
   featured: true
   ---

   ## Overview
   
   Your project content here...
   ```

3. Add a project image to `public/images/projects/`

4. The project will automatically appear on the homepage and projects page!

### Frontmatter Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Project title |
| `description` | string | ✅ | Short description |
| `tags` | string[] | ✅ | Technology tags |
| `image` | string | ✅ | Path to project image |
| `repoUrl` | string | ❌ | GitHub repository URL |
| `liveUrl` | string | ❌ | Live demo URL |
| `techStack` | string[] | ✅ | Technologies used |
| `featured` | boolean | ❌ | Show on homepage |

## 🖼️ Image Management

### Required Images

1. **Hero Portrait**: `public/images/hero-portrait.jpg`
   - Dimensions: 800x800px
   - Circular crop recommended

2. **About Portrait**: `public/images/about-portrait.jpg`
   - Dimensions: 600x800px
   - Portrait orientation

3. **Project Images**: `public/images/projects/[project-name].jpg`
   - Dimensions: 1200x630px (16:9 aspect ratio)
   - Optimize for web (< 200KB)

4. **OG Image**: `public/og-image.jpg`
   - Dimensions: 1200x630px
   - Used for social media sharing

### Image Optimization Tips

- Use WebP or AVIF format when possible
- Compress images using tools like TinyPNG or Squoosh
- Next.js automatically optimizes images via `next/image`
- Provide meaningful alt text for accessibility

## 🎯 Customization

### Update Personal Information

Edit `lib/constants.ts`:

```typescript
export const SITE_CONFIG = {
  name: 'Your Name',
  role: 'Your Role',
  email: 'your.email@example.com',
  linkedin: 'https://linkedin.com/in/yourprofile',
  location: 'Your City, Country',
  // ... more fields
};
```

### Modify Color Scheme

Edit `tailwind.config.ts`:

```typescript
colors: {
  dark: {
    DEFAULT: '#0A0A0A',
    lighter: '#1F1F1F',
  },
  cyan: {
    DEFAULT: '#00D9FF',  // Change this!
    secondary: '#0EA5E9',
  },
}
```

### Adjust Animations

Modify animation settings in `tailwind.config.ts` or component-level Framer Motion configurations.

## 🏗️ Building for Production

### Build the project:
```bash
npm run build
```

### Test the production build locally:
```bash
npm start
```

### Build output:
- Static HTML pages (SSG)
- Optimized JavaScript bundles
- Compressed CSS
- Optimized images

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and configures everything
4. Deploy with one click!

### Netlify

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy!

### Other Platforms

- **AWS Amplify**: Supports Next.js SSR
- **Cloudflare Pages**: Static site deployment
- **Railway**: Full-stack deployment
- **DigitalOcean App Platform**: Managed deployment

## ⚡ Performance Optimization

### Current Metrics
- Lighthouse Performance: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Optimization Techniques
- Server-side rendering (SSR) for homepage
- Incremental Static Regeneration (ISR) for projects
- Image optimization with next/image
- Font preloading
- Code splitting
- Lazy loading for offscreen images
- Efficient caching strategies

## ♿ Accessibility

### Features
- Semantic HTML5 elements
- ARIA labels for interactive components
- Keyboard navigation support
- Focus-visible styles
- Skip-to-content link
- Alt text for all images
- 4.5:1 color contrast ratio
- Reduced motion support

### Testing
- Use WAVE browser extension
- Test with keyboard-only navigation
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify color contrast with tools like Contrast Checker

## 🔒 Security

### Implemented Measures
- Content Security Policy (CSP) headers
- X-Frame-Options header
- X-Content-Type-Options header
- Referrer Policy
- Secure HTTPS only
- No inline scripts
- Input sanitization for MDX content

### Security Headers (next.config.js)
```javascript
headers: [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // ... more headers
]
```

## 🐛 Troubleshooting

### Build Errors

**Error**: "Module not found"
- **Solution**: Run `npm install` to ensure all dependencies are installed

**Error**: "Cannot find module '@/...'
- **Solution**: Check `tsconfig.json` paths configuration

### MDX Issues

**Error**: Projects not showing
- **Solution**: Ensure `content/projects/` directory exists with .mdx files
- Verify frontmatter is valid YAML

### Image Issues

**Error**: Images not loading
- **Solution**: Check image paths in `public/images/`
- Verify next.config.js image configuration

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [MDX Documentation](https://mdxjs.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

**Kshitiz Kumar**
- Email: bbruce670@gmail.com
- LinkedIn: [Kshitiz Kumar](https://www.linkedin.com/in/kshitiz-kumar)
- Location: Faridabad, Haryana, India

---

Built with ❤️ and ☕ by Kshitiz Kumar

