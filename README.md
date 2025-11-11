# The Browning Archive - Interactive Historical Website

![Browning Archive](https://img.shields.io/badge/Status-Active-green) ![Version](https://img.shields.io/badge/Version-1.0-blue)

An interactive, story-driven digital archive that transforms The Browning School's 150+ years of history into an engaging narrative experience. This website serves as a living museum, showcasing digitized yearbooks, letters, photographs, and multimedia through curated exhibits and an interactive timeline.

## 🎯 Project Vision

This isn't just a database of old files—it's a **storytelling platform** designed to bring over 150 years of history to life. The website invites visitors to explore pivotal moments, influential figures, and the evolving culture that have defined The Browning School since 1870.

## ✨ Key Features

### 📅 Interactive Historical Timeline
- **Visual, scrollable timeline** from 1870 to present
- Click on events to reveal photos, documents, and stories
- Filter by category (academics, athletics, arts, etc.)
- Responsive design (horizontal on desktop, vertical on mobile)
- Smooth animations and transitions

### 🖼️ Curated Digital Exhibits
- Mini-documentary style collections
- Examples included:
  - "The Vision of John A. Browning" - Founder's philosophy through letters and documents
  - "A Day in the Life: Browning in the 1950s" - Student life post-war
  - "The Evolution of the Arts at Browning" - Multimedia arts showcase

### 🎙️ Voices from the Archive
- Handwritten letters with transcriptions
- Audio recordings of speeches and performances
- Video interviews and ceremonies
- Personal stories from across the decades

### 🔍 Thematic Exploration
- Browse by themes: Athletics, Academics, Student Traditions, Faculty Legacies
- Cross-decade comparisons
- Visual grid displays

## 🏗️ Project Structure

```
BrowningDistinction/
├── index.html                 # Homepage - immersive entry point
├── timeline.html              # Interactive historical timeline
├── exhibits.html              # Digital exhibits hub (to be built)
├── voices.html                # Voices from the Archive (to be built)
├── explore.html               # Thematic exploration (to be built)
├── search.html                # Search functionality (to be built)
│
├── assets/
│   ├── css/
│   │   ├── main.css          # Core design system
│   │   ├── timeline.css      # Timeline-specific styles
│   │   ├── exhibits.css      # Exhibit layouts
│   │   └── components.css    # Reusable UI components
│   │
│   ├── js/
│   │   ├── main.js           # Core functionality
│   │   ├── timeline.js       # Timeline interactions
│   │   ├── exhibits.js       # Exhibit viewer
│   │   ├── search.js         # Search functionality
│   │   └── media-viewer.js   # Image/audio/video handling
│   │
│   ├── images/               # Image assets
│   ├── audio/                # Audio files
│   ├── video/                # Video files
│   └── documents/            # PDF and document files
│
├── data/
│   ├── timeline-events.json  # Timeline data
│   ├── exhibits.json         # Digital exhibits metadata
│   ├── voices.json           # Personal stories
│   ├── themes.json           # Thematic categorization
│   └── archive-items.json    # Master archive inventory
│
├── exhibits/
│   ├── john-browning-vision/
│   ├── browning-1950s/
│   └── arts-evolution/
│
├── ARCHITECTURE.md           # Technical architecture documentation
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation

1. **Clone or download** this repository:
   ```bash
   git clone <repository-url>
   cd BrowningDistinction
   ```

2. **Start a local web server**:

   Using Python 3:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js (http-server):
   ```bash
   npx http-server -p 8000
   ```

   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

## 📝 Adding Content

### Adding Timeline Events

Edit `data/timeline-events.json` to add new events:

```json
{
  "id": "unique-event-id",
  "date": "1995-06-15",
  "year": 1995,
  "decade": "1990s",
  "title": "Event Title",
  "description": "Detailed description of the event...",
  "categories": ["academics", "athletics"],
  "media": [
    {
      "type": "image",
      "url": "assets/images/timeline/1995-event.jpg",
      "caption": "Photo caption",
      "credit": "Photo credit"
    }
  ],
  "relatedExhibits": ["exhibit-id"],
  "relatedItems": ["item-id-1", "item-id-2"]
}
```

### Adding Images

1. **Optimize images** for web (recommended: max 1920px wide, 80-90% JPEG quality)
2. Place in appropriate directory:
   - Timeline images: `assets/images/timeline/`
   - Exhibit images: `assets/images/exhibits/`
   - Theme images: `assets/images/themes/`
3. Reference in JSON data files

### Adding Digital Exhibits

1. Create a new directory: `exhibits/your-exhibit-name/`
2. Add to `data/exhibits.json`
3. Create `exhibits/your-exhibit-name/index.html` using exhibit template

## 🎨 Design System

### Color Palette
- **Primary (Deep Brown)**: #2C1810 - Main text and headings
- **Secondary (Saddle Brown)**: #8B4513 - Accent color
- **Accent (Peru)**: #CD853F - Highlights and hover states
- **Cream/Parchment**: #F5F5DC / #FFF8DC - Backgrounds
- **Navy**: #1B3A4B - Secondary brand color

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Source Sans Pro (content)
- **Sizes**: Fluid typography using CSS `clamp()`

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern layouts (Grid, Flexbox), custom properties
- **JavaScript (ES6+)**: Vanilla JS, modular architecture
- **JSON**: Content management
- **No frameworks**: Fast, lightweight, easy to maintain

## 📋 Current Status

### ✅ Completed
- [x] Homepage with hero section
- [x] Interactive historical timeline
- [x] Timeline filtering by category
- [x] Event detail modals
- [x] Responsive navigation
- [x] Core design system
- [x] Sample timeline data (16 events)
- [x] Mobile-responsive layouts

### 🚧 In Progress
- [ ] Digital exhibits pages
- [ ] Voices from the Archive section
- [ ] Thematic exploration interface
- [ ] Search functionality

### 📅 Planned
- [ ] Media lightbox/gallery viewer
- [ ] Audio player integration
- [ ] Video player integration
- [ ] Advanced search with filters
- [ ] Print-friendly views
- [ ] Accessibility enhancements (WCAG 2.1 AA)

## 🌐 Deployment

### Option 1: GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select branch and root directory
4. Access at `https://username.github.io/repository-name/`

### Option 2: Netlify
1. Connect GitHub repository to Netlify
2. Configure build settings (none needed for static site)
3. Deploy automatically on push

### Option 3: Traditional Web Hosting
1. Upload all files via FTP/SFTP
2. Ensure proper permissions
3. Configure custom domain if desired

## 🔧 Customization

### Changing Colors
Edit CSS custom properties in `assets/css/main.css`:
```css
:root {
  --color-primary: #2C1810;
  --color-secondary: #8B4513;
  /* ... */
}
```

### Modifying Layouts
- Grid layouts: Adjust in `assets/css/main.css`
- Timeline: Edit `assets/css/timeline.css`
- Components: Modify `assets/css/components.css`

### Adding New Pages
1. Create HTML file (use existing pages as templates)
2. Link CSS and JavaScript files
3. Update navigation in all pages
4. Add content and functionality

## 📄 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Resources

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed technical architecture
- [Google Fonts](https://fonts.google.com/) - Typography resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference

## 🤝 Contributing

To add content or improve the website:

1. **For Content**: Update JSON files in `data/` directory
2. **For Features**: Edit HTML/CSS/JavaScript files
3. **For Exhibits**: Create new directories and pages in `exhibits/`

## 📧 Contact

For questions or to contribute materials to the archive:
- Email: archive@browning.edu
- Website: [browning.edu](https://browning.edu)

## 📜 License

© 2024 The Browning School. All rights reserved. Archive materials used with permission.

---

**Built with ❤️ for The Browning School community**