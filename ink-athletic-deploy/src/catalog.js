// Shared product catalog — imported by the client (App.jsx) AND the serverless
// checkout function (api/create-checkout-session.js). Keeping one copy means the
// server prices orders from the same source of truth the site displays, so a
// tampered browser can't change what a customer is charged.

// Store categories — shown as filter pills above the product carousel.
// "Software & Hardware" is special: its tab shows the custom-build quote form.
export const CATEGORIES = ["Kiosks", "3D Prints", "Web Development", "Software & Hardware"];

export const DEFAULT_PRODUCTS = [
  {
    id: "ai-kiosk",
    name: "AI Business Kiosk",
    outcome: "Turn your storefront into a 24/7 digital employee.",
    line: "A voice-and-touch AI concierge that answers, books, and greets — all day, every day.",
    price: 2499,
    features: ["AI assistant", "Touchscreen", "Voice interaction", "NFC", "QR codes", "Live weather", "Business info"],
    art: "kiosk", image: null,
    category: "Kiosks"
  },
  {
    id: "qr-kiosk",
    name: "QR Display Kiosk",
    outcome: "Every phone in the room, one tap from your links.",
    line: "An always-on display serving rotating QR codes, NFC tap, weather, and announcements.",
    price: 899,
    features: ["Multiple QR codes", "NFC", "Weather", "Contact info", "Scrolling announcements"],
    art: "qr", image: null,
    category: "Kiosks",
    addOns: [{ name: "Laser-engraved logo — wood front plate", price: 90 }]
  },
  {
    id: "ai-solutions",
    name: "Custom AI Solutions",
    outcome: "Automate repetitive work with intelligent assistants built for your business.",
    line: "Local AI, automation, and knowledge bases wired into the tools you already use.",
    price: 1500,
    features: ["Local AI", "Business automation", "Knowledge bases", "Custom software", "AI integrations"],
    art: "ai", image: null,
    category: "Software & Hardware"
  },
  {
    id: "web-development",
    name: "Website Development",
    outcome: "A custom website that works as hard as you do.",
    line: "Design, build, and launch — fast, mobile-first sites with e-commerce, booking, and a CMS you can edit yourself.",
    price: 1200,
    features: ["Custom design", "Mobile-first", "E-commerce ready", "SEO", "Editable CMS", "Hosting & domains"],
    art: "qr", image: null,
    category: "Web Development"
  }
];
