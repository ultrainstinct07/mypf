# Installation Guide

Detailed step-by-step installation instructions for the Kshitiz Kumar Portfolio website.

## Prerequisites

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`
   - Recommended: Use nvm (Node Version Manager)

2. **npm** (comes with Node.js) or enable npm via corepack
   - Verify installation: `npm --version`
   - Minimum version: 9.0.0

3. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Optional Tools

- **VS Code**: Recommended code editor
- **VS Code Extensions**:
  - ESLint
  - Tailwind CSS IntelliSense
  - Prettier
  - MDX

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /home/void999/Documents/mypf
```

### Step 2: Enable npm (if not available)

If npm is not available with your Node installation:

```bash
# For Arch Linux
sudo pacman -S npm

# For Ubuntu/Debian
sudo apt install npm

# Or enable via corepack (Node.js v16.10+)
corepack enable
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- And all other dependencies

**Expected duration**: 2-5 minutes depending on internet speed

### Step 4: Set Up Environment Variables (Optional)

```bash
cp .env.example .env.local
```

Edit `.env.local` with your specific configuration:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 5: Add Images

Follow the instructions in `/public/images/IMAGE_GUIDE.md` to add your images:

**Required images**:
1. `/public/images/hero-portrait.jpg` (800x800px)
2. `/public/images/about-portrait.jpg` (600x800px)
3. `/public/og-image.jpg` (1200x630px)
4. Project images in `/public/images/projects/`

**Temporary solution**: The site will work with placeholder URLs until you add real images.

### Step 6: Start Development Server

```bash
npm run dev
```

The site will be available at: **http://localhost:3000**

You should see:
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 1.2s
```

### Step 7: Verify Installation

Open your browser and check:
- [ ] Homepage loads without errors
- [ ] All sections are visible
- [ ] Navigation works
- [ ] Projects page accessible
- [ ] Individual project pages load

## Troubleshooting

### Issue: "npm: command not found"

**Solution 1** - Enable corepack:
```bash
corepack enable
```

**Solution 2** - Install npm separately:
```bash
# Arch Linux
sudo pacman -S npm

# Ubuntu/Debian
sudo apt install npm
```

**Solution 3** - Use alternative package managers:
```bash
# Install pnpm
npm install -g pnpm
pnpm install
pnpm dev

# Or install yarn
npm install -g yarn
yarn install
yarn dev
```

### Issue: "Module not found" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution 1** - Use a different port:
```bash
PORT=3001 npm run dev
```

**Solution 2** - Kill process on port 3000:
```bash
# Find process
lsof -i :3000

# Kill process (replace PID with actual process ID)
kill -9 PID
```

### Issue: TypeScript errors

**Solution**:
```bash
# Rebuild TypeScript
npm run build

# Or ignore errors temporarily (not recommended)
npm run dev -- --no-type-check
```

### Issue: Images not loading

**Possible causes**:
1. Image files don't exist in `/public/images/`
2. Image paths in code don't match actual files
3. File permissions issue

**Solution**:
```bash
# Check if image directories exist
ls -la public/images/
ls -la public/images/projects/

# Create directories if needed
mkdir -p public/images/projects

# Check file permissions
chmod -R 755 public/
```

### Issue: MDX content not showing

**Possible causes**:
1. MDX files don't exist in `/content/projects/`
2. Invalid frontmatter in MDX files
3. Missing required frontmatter fields

**Solution**:
```bash
# Check if content directory exists
ls -la content/projects/

# Create directory if needed
mkdir -p content/projects

# Validate MDX file structure
cat content/projects/ark-surveillance.mdx
```

## Build for Production

### Build Command

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Finalizing page optimization

Route (app)                      Size     First Load JS
┌ ○ /                           5.2 kB         100 kB
├ ○ /projects                   3.1 kB          98 kB
├ λ /projects/[slug]            2.8 kB          97 kB
└ ○ /sitemap.xml               0 B             0 B
```

### Test Production Build Locally

```bash
npm run build
npm start
```

Visit: http://localhost:3000

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project (Vercel auto-detects Next.js)
   - Click "Deploy"

3. **Configure custom domain** (optional):
   - Go to project settings
   - Add custom domain
   - Update DNS records

### Alternative Platforms

#### Netlify
```bash
# Build settings
Build command: npm run build
Publish directory: .next
```

#### Self-Hosted (VPS/Server)
```bash
# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "portfolio" -- start

# Or with systemd service
sudo systemctl enable portfolio.service
sudo systemctl start portfolio.service
```

## Development Workflow

### Recommended Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Code Quality

```bash
# Auto-fix linting issues
npm run lint -- --fix

# Format code (if Prettier is configured)
npx prettier --write .
```

## Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies (carefully!)
npm update

# Update specific package
npm install package-name@latest

# Major version updates
npx npm-check-updates -u
npm install
```

## Maintenance

### Regular Tasks

1. **Update dependencies** (monthly)
2. **Test production build** (before deploying)
3. **Check Lighthouse scores** (quarterly)
4. **Review analytics** (if configured)
5. **Update content** (as needed)

### Backup

```bash
# Backup important files
tar -czf portfolio-backup-$(date +%Y%m%d).tar.gz \
  content/ \
  public/images/ \
  lib/constants.ts
```

## Getting Help

### Resources
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **GitHub Issues**: Report bugs in your repository
- **Stack Overflow**: Ask development questions

### Common Issues
- Check the Troubleshooting section above
- Review browser console for errors
- Check terminal output for build errors
- Verify all files are saved

## Next Steps

After successful installation:
1. ✅ Customize `lib/constants.ts` with your information
2. ✅ Replace placeholder images with real ones
3. ✅ Update project content in MDX files
4. ✅ Test all pages and functionality
5. ✅ Deploy to Vercel or your platform of choice

## Support

For additional support:
- Email: bbruce670@gmail.com
- Review README.md for additional documentation
- Check IMAGE_GUIDE.md for image requirements

---

**Installation complete!** You're ready to build an amazing portfolio. 🚀

