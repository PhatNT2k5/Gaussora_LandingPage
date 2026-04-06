<div align="center">
  <img src="public/icon.svg" alt="Gaussora Logo" width="120" height="120">
  
  <h1 align="center">Gaussora Landing Page</h1>
  
  <p align="center">
    A modern, interactive landing page for AI enterprise solutions
    <br />
    <a href="#demo">View Demo</a>
    ·
    <a href="#-features">Features</a>
    ·
    <a href="#-getting-started">Getting Started</a>
    ·
    <a href="#-deployment">Deployment</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  </p>
</div>

---

## 📸 Preview

A stunning landing page featuring 3D interactive elements, smooth animations, and a modern dark theme optimized for AI/tech enterprises.

| Hero Section | Features |
|:------------:|:--------:|
|![Hero](./docs/preview-hero.png)|![Features](./docs/preview-features.png)|

---

## ✨ Features

### 🎨 UI/UX
- **Modern Dark Theme** - Elegant dark mode design with subtle gradients
- **Responsive Design** - Fully responsive across all devices
- **Smooth Animations** - GSAP-like scroll animations and transitions
- **Interactive 3D Elements** - BB-8 robot and Spline 3D models

### 🌍 Internationalization
- **Bilingual Support** - English and Vietnamese
- **Dynamic Language Switching** - Real-time language toggle without page reload

### 🏗️ Architecture
- **Next.js 16** with Turbopack for blazing fast development
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS 4** for utility-first styling
- **Component-based Architecture** - Modular and reusable components

### 📦 Sections
| Section | Description |
|---------|-------------|
| 🏠 **Hero** | Eye-catching intro with 3D BB-8 robot |
| ⚡ **Features** | Core AI services with animated visuals |
| 🎯 **Use Cases** | Real-world AI applications |
| 💎 **Why Choose Us** | Competitive advantages |
| 🏢 **About Us** | Company information |
| 📞 **Contact** | Contact form with validation |
| 📍 **Footer** | Navigation and social links |

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16.2.2, React 19.2.4 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, CSS Modules |
| **3D Graphics** | Three.js, Spline, React Three Fiber |
| **UI Components** | Radix UI, shadcn/ui |
| **Icons** | Lucide React |
| **Fonts** | Geist |

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── landing/           # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── bb8-robot.tsx
│   │   └── ...
│   └── ui/                # Reusable UI components
├── lib/
│   ├── language-context.tsx  # i18n context
│   └── utils.ts              # Utility functions
├── hooks/                 # Custom React hooks
├── public/
│   ├── models/           # 3D models (GLB)
│   └── images/           # Static images
└── styles/               # Additional stylesheets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gaussora-landing.git
   cd gaussora-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy this project is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/gaussora-landing)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Other Platforms

This project can be deployed to any platform that supports Next.js:

- **Netlify** - `netlify deploy`
- **AWS Amplify** - Connect GitHub repo
- **Docker** - Use `standalone` output mode

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Customization

1. **Change Content** - Edit translations in `lib/language-context.tsx`
2. **Update Styles** - Modify Tailwind config or `globals.css`
3. **Replace 3D Models** - Add models to `public/models/` and update components
4. **Add Sections** - Create new components in `components/landing/`

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `sm` | 640px | Small devices |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Gaussora**

- Website: [https://gaussora.com](https://gaussora.com)
- Email: contact@gaussora.com

---

<div align="center">
  <p>Made with ❤️ by Gaussora Team</p>
  <p>
    <a href="#top">Back to Top</a>
  </p>
</div>
