# Image Replacement Guide

This guide explains which images you need to add to complete your portfolio website.

## Required Images

### 1. Hero Portrait (`hero-portrait.jpg`)
**Location**: `/public/images/hero-portrait.jpg`
**Dimensions**: 800x800px (1:1 aspect ratio)
**Description**: Your professional headshot for the hero section
**Tips**:
- Use a circular crop or high-quality square portrait
- Good lighting and professional attire
- Plain or slightly blurred background
- File size: < 200KB after optimization

### 2. About Portrait (`about-portrait.jpg`)
**Location**: `/public/images/about-portrait.jpg`
**Dimensions**: 600x800px (3:4 aspect ratio, portrait)
**Description**: Full portrait for the About section
**Tips**:
- Professional or casual professional style
- Good composition and lighting
- Shows personality while maintaining professionalism
- File size: < 300KB after optimization

### 3. OG Image (`og-image.jpg`)
**Location**: `/public/og-image.jpg`
**Dimensions**: 1200x630px (1.91:1 aspect ratio)
**Description**: Social media preview image (Open Graph)
**Tips**:
- Include your name and role
- Use brand colors (cyan on dark)
- Keep text readable at small sizes
- Test on Facebook, Twitter, LinkedIn
- File size: < 500KB

## Project Images

All project images should be placed in `/public/images/projects/`

### Required Project Images

1. **Ark Surveillance** (`ark-surveillance.jpg`)
   - Screenshot of surveillance interface or system architecture
   - 1200x630px (16:9 aspect ratio)

2. **Collegia** (`collegia.jpg`)
   - Chat interface or dashboard screenshot
   - 1200x630px (16:9 aspect ratio)

3. **Phishing Detector** (`phishing-detector.jpg`)
   - Detection results or analysis interface
   - 1200x630px (16:9 aspect ratio)

4. **E-Voting Prototype** (`e-voting.jpg`)
   - Voting interface or workflow diagram
   - 1200x630px (16:9 aspect ratio)

5. **Mobile Pentest** (`mobile-pentest.jpg`)
   - Testing tools or findings visualization
   - 1200x630px (16:9 aspect ratio)

6. **Windows Internals** (`windows-internals.jpg`)
   - WinDbg screenshot or system architecture
   - 1200x630px (16:9 aspect ratio)

## Image Optimization

### Tools
- **TinyPNG**: https://tinypng.com/ (PNG/JPG compression)
- **Squoosh**: https://squoosh.app/ (advanced optimization)
- **ImageOptim**: https://imageoptim.com/ (Mac application)
- **GIMP**: Free image editor for resizing

### Optimization Checklist
- [ ] Resize to exact dimensions
- [ ] Convert to WebP if possible (Next.js handles this automatically)
- [ ] Compress to reduce file size (aim for < 200KB for project images)
- [ ] Test loading speed
- [ ] Verify image quality after compression

## Placeholder Images (Temporary)

If you don't have images ready, you can use placeholder services:

### Temporary Placeholder URLs

```bash
# Create placeholder images using a service
# Hero portrait (800x800)
https://placehold.co/800x800/0A0A0A/00D9FF?text=Kshitiz+Kumar

# About portrait (600x800)
https://placehold.co/600x800/0A0A0A/00D9FF?text=Professional+Photo

# Project images (1200x630)
https://placehold.co/1200x630/0A0A0A/00D9FF?text=Ark+Surveillance
https://placehold.co/1200x630/0A0A0A/00D9FF?text=Collegia
# ... and so on
```

### Creating Placeholder Images Locally

You can also create simple placeholder images with your favorite image editor:
1. Create a canvas with the required dimensions
2. Fill with a dark background (#0A0A0A)
3. Add cyan text with project name
4. Export as JPG

## Image Format Recommendations

| Image Type | Recommended Format | Alternative |
|------------|-------------------|-------------|
| Portraits | JPG | WebP |
| Screenshots | PNG | WebP |
| Diagrams | PNG | SVG |
| Icons | SVG | PNG |
| Photos | JPG | WebP |

## File Naming Convention

- Use lowercase letters
- Use hyphens for spaces
- Use descriptive names
- Examples:
  - ✅ `hero-portrait.jpg`
  - ✅ `ark-surveillance.jpg`
  - ❌ `IMG_1234.jpg`
  - ❌ `Photo 1.JPG`

## Copyright & Licensing

**Important**: Only use images you have rights to use!

- Personal photos: ✅ OK to use
- Screenshots of your own projects: ✅ OK to use
- Stock photos: ✅ OK with proper license
- Photos from Google Images: ❌ Likely copyright violation
- AI-generated images: ✅ OK (check specific service terms)

## Accessibility (Alt Text)

Each image in your components should have descriptive alt text. This is already implemented in the code:

```tsx
<Image
  src="/images/hero-portrait.jpg"
  alt="Kshitiz Kumar - Cybersecurity Analyst"
  // ... other props
/>
```

### Writing Good Alt Text
- Describe what's in the image
- Keep it concise (< 125 characters)
- Don't start with "Image of" or "Picture of"
- Include relevant context
- For decorative images, use empty alt: `alt=""`

## Testing Your Images

After adding images, verify:
1. [ ] Images load correctly on all pages
2. [ ] Images are properly sized (not stretched/distorted)
3. [ ] File sizes are optimized (< 500KB each)
4. [ ] Alt text is descriptive and helpful
5. [ ] Images look good on mobile devices
6. [ ] Images work in production build

## Quick Setup Script

Run this in your terminal to create the required directories:

```bash
# Create image directories
mkdir -p public/images/projects
mkdir -p public/images/companies

# List what images you need
echo "Required images:"
echo "1. public/images/hero-portrait.jpg"
echo "2. public/images/about-portrait.jpg"
echo "3. public/og-image.jpg"
echo "4. public/images/projects/ark-surveillance.jpg"
echo "5. public/images/projects/collegia.jpg"
echo "6. public/images/projects/phishing-detector.jpg"
echo "7. public/images/projects/e-voting.jpg"
echo "8. public/images/projects/mobile-pentest.jpg"
echo "9. public/images/projects/windows-internals.jpg"
```

## Need Help?

If you're not comfortable with image editing:
- Hire a photographer for professional portraits
- Use Canva (canva.com) for creating graphics
- Use Figma (figma.com) for design work
- Ask AI to generate project mockups
- Reach out to designer friends for help

Good luck with your portfolio! 🚀

