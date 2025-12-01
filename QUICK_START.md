# Quick Start Guide

Get your portfolio up and running in 5 minutes!

## Prerequisites

Ensure you have Node.js 18+ installed. Check with:
```bash
node --version
```

## Installation (3 steps)

### 1. Install Dependencies

```bash
cd /home/void999/Documents/mypf
npm install
```

If npm is not available:
```bash
# Enable corepack
corepack enable

# Or install npm on Arch Linux
sudo pacman -S npm
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to: **http://localhost:3000**

## ✅ What You Should See

- Hero section with animated text and portrait placeholder
- About section with bio
- Expertise cards (4 circular cards)
- Projects gallery (6 projects)
- Testimonials section
- FAQ accordion
- CTA section with contact buttons
- Footer with links

## ⚠️ Expected Placeholders

Some images will show placeholders until you add real images:
- Hero portrait
- About portrait  
- Project screenshots

**This is normal!** Follow the IMAGE_GUIDE.md to add your images.

## 🎨 Customization

### Update Your Info

Edit `lib/constants.ts`:
```typescript
export const SITE_CONFIG = {
  name: 'Kshitiz Kumar',
  email: 'bbruce670@gmail.com',
  // Update these values
};
```

### Add Your Images

Place images in:
- `public/images/hero-portrait.jpg` (800x800px)
- `public/images/about-portrait.jpg` (600x800px)
- `public/images/projects/*.jpg` (1200x630px each)

See `public/images/IMAGE_GUIDE.md` for details.

## 🚀 Deploy

### Vercel (Easiest)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

**Done!** Your site is live.

## 📚 Full Documentation

- **README.md** - Complete documentation
- **INSTALL.md** - Detailed installation guide
- **PROJECT_SUMMARY.md** - What's been built
- **IMAGE_GUIDE.md** - Image requirements

## ❓ Issues?

### Port Already in Use
```bash
PORT=3001 npm run dev
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### Images Not Loading
- Make sure images exist in `public/images/`
- Check file names match exactly

## 🎉 Next Steps

1. ✅ Site is running
2. ✅ Add your images
3. ✅ Customize content
4. ✅ Test on mobile
5. ✅ Deploy to production

**You're ready to go!** 🚀

