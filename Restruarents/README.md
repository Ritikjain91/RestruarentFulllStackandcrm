# Fastor - Restaurant & Food Delivery Mobile Frontend

A pixel-perfect, responsive mobile frontend for the **Fastor** food delivery app built with **pure React.js (React 18)**, **Vite**, and **Tailwind CSS**.

---

## Tech Stack
- **Library**: React 18 (`react`, `react-dom`)
- **Build Tool**: Vite 5 (instant HMR and fast builds)
- **Styling**: Tailwind CSS 3 with custom colors and utility animations
- **Icons**: Lucide React
- **Language**: TypeScript

---

## Screens Included

1. **Screen 1: Phone Sign Up**
   - Country prefix (`+91`), pipe delimiter `|`, and phone placeholder `- 00000` with blinking cursor
   - Fully interactive custom on-screen numeric dialer (1–9, letters, 0, backspace)
   - "Get OTP" button with validation
   - Terms & Conditions and Privacy Policy links
2. **Screen 2: 6-Digit Code OTP Verification**
   - 6 individual OTP boxes (`[ ][ ][ ] - [ ][ ][ ]`) with active box indicator
   - Dynamic 30-second countdown timer for resending code
   - On-screen keypad and auto-continue on 6 digits
3. **Screen 3: Home & Feed Screen**
   - Header with location ("Model Town, New Delhi")
   - Search bar with quick gradient action buttons (Offers & Fastor Wallet)
   - **Best Seller** cards with exact Figma cuts for Sushi, Curry, Lasagna, and Berry Cupcake
   - **30% OFF Promo Banner** with exact pizza artwork and carousel indicators
   - **Popular Items** with Strawberry Shake & Chicken Burger, including interactive **Cancel Order** and **Track Driver** modal
4. **Screen 4: Dish Details Screen**
   - Hero Pepperoni Pizza graphic with back and favorite action buttons
   - Base price display (`₹14.00`) and interactive quantity stepper (`- 3 +`)
   - **Personal portion** selection with radio options (Personal, Medium, Familiar, Jumbo)
   - Sticky bottom **"Add to cart"** button with live notification feedback

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```
