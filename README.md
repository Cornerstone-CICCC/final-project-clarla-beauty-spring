# Carla Beauty — Project README

## Authors

Joy, Pam, Patrick

**Vancouver's go-to makeup and hairstyle studio, with a Brazilian twist.**  
Built with vanilla HTML, CSS, SCSS and JavaScript. No frameworks, no build tools required.

---

## Project Structure

```
carla-beauty/
├── index.html                        # Homepage
├── my-work.html                      # Portfolio / gallery
├── classes.html                      # Classes overview
├── classes_master-class.html         # 1-on-1 Master Class detail
├── classes_beginner-class.html       # Beginner Class detail
├── contact.html                      # Contact landing
├── contact_service-wedding.html      # Wedding service contact form
├── contact_classes.html              # Classes contact form
├── beauty-tips.html                  # Beauty tips / blog
│
├── components/
│   ├── header.html                   # Shared nav (loaded via fetch)
│   └── footer.html                   # Shared footer (loaded via fetch)
│
├── css/
│   ├── styles.css                    # Main stylesheet (homepage)
│   ├── main.css                      # Stylesheet for inner pages
│   ├── header.css                    # Header / nav styles
│   ├── footer.css                    # Footer styles
│   ├── float-social.css              # Floating social bar styles
│   ├── mobile-menu.css               # Mobile menu overlay styles
│   └── contact-form.css             # Scoped contact form styles (index only)
│
├── js/
│   ├── header.js                     # Nav scroll behaviour + mobile menu
│   ├── float-social.js               # Floating social toggle
│   ├── main.js                       # General page interactions
│   └── contact.js                    # Contact form logic
│
├── fonts/
│   └── Avenir/
│       ├── Avenir Light/
│       │   └── Avenir Light.ttf
│       ├── Avenir Book/
│       │   └── Avenir Book.ttf
│       ├── Avenir Regular/
│       │   └── Avenir Regular.ttf
│       ├── Avenir Heavy/
│       │   └── Avenir Heavy.ttf
│       └── Avenir Black/
│           └── Avenir Black.ttf
│   └── Whiteflower-Regular.otf
│
└── images/
    ├── homepage/                     # Hero, gallery, brand logos, etc.
    ├── logo/                         # SVG logo variants
    └── icons/                        # UI icons (SVG)
```

---

## Running the Project

### Requirements

- [Visual Studio Code](https://code.visualstudio.com/) with the **Live Server** extension installed
- A modern browser (Chrome, Firefox, Safari, Edge)
- **JavaScript must be enabled** in your browser (see note below)

### Steps

1. Open the project folder in VS Code
2. Right-click `index.html` and select **"Open with Live Server"**
3. The site will open at `http://127.0.0.1:5500`

> ⚠️ **Do not open HTML files by double-clicking them** (i.e. `file://` protocol). The shared header and footer are loaded using the browser `fetch()` API, which requires a local server to work. Double-clicking will result in a blank header and footer.

---

## JavaScript Requirement

This project uses JavaScript for the following features:

| Feature             | File                    | What breaks without JS            |
| ------------------- | ----------------------- | --------------------------------- |
| Shared header       | `header.js`             | Navigation bar won't appear       |
| Shared footer       | `footer.html` fetch     | Footer won't appear               |
| Mobile menu         | `header.js`             | Hamburger menu won't open         |
| Floating social bar | `float-social.js`       | Toggle button won't work          |
| Testimonial slider  | `main.js`               | Arrows won't cycle quotes         |
| Contact form logic  | `contact.js`            | Event type buttons won't work     |
| Contact form CSS    | injected via `<script>` | Form will be unstyled on homepage |

**JavaScript must be enabled in your browser.** If it is disabled, the page will load but navigation, the footer, and all interactive elements will not function.

To enable JavaScript in Chrome: `Settings → Privacy and Security → Site Settings → JavaScript → Allowed`

---

## Fonts

Custom fonts are self-hosted and loaded via `@font-face` in `styles.css` and `main.css`. No internet connection is required for fonts to render correctly — they are served directly from the `fonts/` folder.

| Font                | Usage                      | Weight mapping                    |
| ------------------- | -------------------------- | --------------------------------- |
| Avenir Light        | Body text, descriptions    | `font-weight: 300`                |
| Avenir Book         | General text               | `font-weight: 400`                |
| Avenir Regular      | UI text                    | `font-weight: 500`                |
| Avenir Heavy        | Buttons, emphasis          | `font-weight: 600`                |
| Avenir Black        | Heavy display use          | `font-weight: 800`                |
| Whiteflower Regular | Signature / script accents | `font-weight: 400`                |
| Baskervville        | All headings               | via Google Fonts fallback / local |

---

## Pages Overview

| Page               | Description                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `index.html`       | Homepage — hero, about, brands, gallery, testimonials, services, classes, beauty tips, contact form |
| `my-work.html`     | Full portfolio gallery                                                                              |
| `services.html`    | A dive into the different options, prices and availability                                          |
| `classes.html`     | Overview of all class offerings                                                                     |
| `beauty-tips.html` | DIY beauty corner — tips and tutorials                                                              |
| `about.html`       | Founder summary                                                                                     |
| `contact.html`     | Contact landing with tab navigation                                                                 |

---

## Responsive Design

The site is fully responsive with breakpoints at:

- **768px** — tablet / mobile: layout stacks, nav collapses to hamburger, carousels activate
- **480px** — small mobile: gallery and grid adjustments

## Browser Support

Tested and supported on:

- Chrome 110+
- Firefox 110+
- Safari 15+
- Edge 110+
