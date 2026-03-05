# Clearwater Wellness Website

A minimal, editorial-inspired website design for a therapy and wellness practice.

## 📁 Project Structure

```
clearwater-website/
├── index.html          # Homepage
├── about.html          # About page
├── services.html       # Services page
├── team.html           # Team/staff page
├── contact.html        # Contact page with form
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── main.js         # JavaScript functionality
├── images/             # Image assets (add your own)
└── README.md           # This file
```

## 🎨 Design Features

- **Minimal Editorial Style**: Clean lines, sophisticated typography, magazine-inspired layout
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: Semantic HTML, keyboard navigation support
- **Fast**: No heavy frameworks, optimized CSS

## 🚀 Getting Started

### Local Development

1. Simply open `index.html` in a web browser
2. No build process required - it's all static HTML/CSS/JS

### Deploying

This site can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any standard web hosting

## ✏️ Customization

### Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
  --color-bg: #fafafa;
  --color-text: #1a1a1a;
  --color-text-light: #666666;
  --color-accent: #1a1a1a;
  /* ... more variables */
}
```

### Fonts

The site uses Google Fonts:
- **Playfair Display** - Headlines
- **Inter** - Body text

To change fonts, update the Google Fonts link in each HTML file's `<head>` section.

### Images

Replace the placeholder areas with your own images:
1. Add images to the `/images` folder
2. Update the HTML to reference your images

## 📝 Pages Overview

### Homepage (index.html)
- Hero section with headline and CTA
- Philosophy/intro section
- Services grid
- Process steps
- Call-to-action

### About (about.html)
- Company story
- Core values
- Approach to care

### Services (services.html)
- Individual therapy
- Couples counseling
- Family therapy
- Additional services
- Pricing/insurance info

### Team (team.html)
- Team member cards
- Bios and specialties
- Therapy dog feature

### Contact (contact.html)
- Contact form
- Location/hours/contact info
- FAQ section

## 🔧 JavaScript Features

- Smooth scroll navigation
- Header shadow on scroll
- Mobile menu toggle
- Form validation
- Scroll-triggered animations
- Phone number formatting
- Keyboard accessibility

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🎯 Next Steps

1. **Add Real Images**: Replace placeholders with professional photos
2. **Connect Form**: Integrate contact form with your email service (Formspree, Netlify Forms, etc.)
3. **SEO**: Add meta descriptions, Open Graph tags, sitemap
4. **Analytics**: Add Google Analytics or similar
5. **SSL**: Ensure HTTPS when deploying

## 📄 License

This template is provided for use by [Client Name]. 

---

Built with care ✨
