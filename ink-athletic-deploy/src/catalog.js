// Shared product catalog — imported by the client (App.jsx) AND the serverless
// checkout function (api/create-checkout-session.js). Keeping one copy means the
// server prices orders from the same source of truth the site displays, so a
// tampered browser can't change what a customer is charged.

export const DEFAULT_PRODUCTS = [
  {
    id: "ai-kiosk",
    name: "AI Business Kiosk",
    outcome: "Turn your storefront into a 24/7 digital employee.",
    line: "A voice-and-touch AI concierge that answers, books, and greets — all day, every day.",
    price: 2499,
    features: ["AI assistant", "Touchscreen", "Voice interaction", "NFC", "QR codes", "Live weather", "Business info"],
    art: "kiosk", image: null
  },
  {
    id: "qr-kiosk",
    name: "QR Display Kiosk",
    outcome: "Every phone in the room, one tap from your links.",
    line: "An always-on display serving rotating QR codes, NFC tap, weather, and announcements.",
    price: 899,
    features: ["Multiple QR codes", "NFC", "Weather", "Contact info", "Scrolling announcements"],
    art: "qr", image: null,
    addOns: [{ name: "Laser-engraved logo — wood front plate", price: 90 }]
  },
  {
    id: "ai-solutions",
    name: "Custom AI Solutions",
    outcome: "Automate repetitive work with intelligent assistants built for your business.",
    line: "Local AI, automation, and knowledge bases wired into the tools you already use.",
    price: 1500,
    features: ["Local AI", "Business automation", "Knowledge bases", "Custom software", "AI integrations"],
    art: "ai", image: null
  },
  {
    id: "keychain-logo",
    name: "Laser-Engraved Keychain",
    outcome: "Your logo, cut and engraved in wood or acrylic.",
    line: "A custom laser-engraved keychain — perfect for swag, giveaways, or retail.",
    price: 15,
    features: ["Custom engraving", "Wood or acrylic", "Bulk discounts"],
    art: "laser", image: null,
    buy: true, weightG: 40, boxL: 12, boxW: 8, boxH: 2
  },
  {
    id: "print-3d-small",
    name: "Custom 3D Print — Small",
    outcome: "Bring your model to life in durable PLA.",
    line: "Send us your design — we print, finish, and ship it to your door.",
    price: 25,
    features: ["Custom model", "Multiple colors", "Durable PLA"],
    art: "printer", image: null,
    buy: true, weightG: 150, boxL: 20, boxW: 15, boxH: 10
  }
];
