/* ============================================================
   SMART FARMERS AND FOOD LTD — SHOP SETTINGS
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   To change a price:        find the item, change "price"
   To mark item unavailable: set "stock": false
   To hide an item:          set "hidden": true
   To add a new item:        copy any block, change the details

   Prices are in Naira (₦). Use plain numbers, no commas.
   After editing, save the file and push to GitHub —
   Vercel updates the live site in about 30 seconds.

   >>> IMPORTANT: THE PRICES BELOW ARE PLACEHOLDERS. <<<
   >>> Replace every one with your real selling price. <<<
   ============================================================ */

const SHOP = {
  name: "Smart Farmers And Food Ltd",
  shortName: "Smart Farmers",
  tagline: "Real food. Real weight. Delivered in Lagos.",

  // ---- Contact ----
  whatsapp: "2348074310530",           // digits only, no + or spaces
  phone: "+2348074310530",
  email: "smartfarmersandfoodsltd@gmail.com",
  instagram: "",                        // e.g. "smartfarmersng" — leave "" to hide
  facebook: "",                         // leave "" to hide
  twitter: "Samuraiwomanv",

  // ---- Business details ----
  city: "Lagos",
  hours: "Mon – Sat, 8:00am – 6:00pm",
  freeDeliveryFrom: 50000,              // free delivery on orders from this amount
  minOrder: 5000,

  // ---- Delivery areas & fees (₦) ----
  // Add or remove rows freely. Keep "Other" last.
  areas: [
    { name: "Ikeja / Maryland",            fee: 2000 },
    { name: "Yaba / Surulere / Mushin",    fee: 2000 },
    { name: "Ikoyi / V.I. / Lekki Ph 1",   fee: 3500 },
    { name: "Ajah / Sangotedo",            fee: 4500 },
    { name: "Gbagada / Ketu / Ogudu",      fee: 2500 },
    { name: "Festac / Amuwo / Apapa",      fee: 3000 },
    { name: "Ikorodu / Agege / Alimosho",  fee: 3000 },
    { name: "Other (we will confirm)",     fee: 0 }
  ]
};

/* ============================================================
   PRODUCTS
   Each item can have several sizes ("units").
   The first unit is the one shown by default.
   ============================================================ */

const PRODUCTS = [
  {
    id: "ijebu-garri",
    name: "Ijebu Garri (White)",
    category: "Garri & Flour",
    img: "img/products/ijebu-garri.webp",
    blurb: "Sharp, sour and properly dry. Sieved clean — no sand, no stones.",
    tags: ["Best seller"],
    stock: true,
    units: [
      { label: "Paint rubber · 4kg", price: 4500 },
      { label: "Half bag · 25kg",    price: 26000 },
      { label: "Full bag · 50kg",    price: 49000 }
    ]
  },
  {
    id: "yellow-garri",
    name: "Yellow Garri (Palm Oil)",
    category: "Garri & Flour",
    img: "img/products/yellow-garri.webp",
    blurb: "Fried with real palm oil. Rich colour, sweet smell, swallows soft.",
    tags: [],
    stock: true,
    units: [
      { label: "Paint rubber · 4kg", price: 5000 },
      { label: "Half bag · 25kg",    price: 28500 },
      { label: "Full bag · 50kg",    price: 54000 }
    ]
  },
  {
    id: "honey-beans",
    name: "Honey Beans (Oloyin)",
    category: "Beans & Grains",
    img: "img/products/honey-beans.webp",
    blurb: "Naturally sweet, cooks fast, no need for sugar. Hand-picked clean.",
    tags: ["Best seller"],
    stock: true,
    units: [
      { label: "Paint rubber · 4kg", price: 7500 },
      { label: "Half bag · 25kg",    price: 44000 },
      { label: "Full bag · 50kg",    price: 85000 }
    ]
  },
  {
    id: "ofada-rice",
    name: "Ofada Rice (Local)",
    category: "Beans & Grains",
    img: "img/products/ofada-rice.webp",
    blurb: "Stone-free local rice with that proper Ofada aroma. Destoned twice.",
    tags: [],
    stock: true,
    units: [
      { label: "Paint rubber · 4kg", price: 8000 },
      { label: "Half bag · 25kg",    price: 47000 },
      { label: "Full bag · 50kg",    price: 92000 }
    ]
  },
  {
    id: "palm-oil",
    name: "Red Palm Oil",
    category: "Oil",
    img: "img/products/palm-oil.webp",
    blurb: "Fresh pressed, thick and deep red. No water, no adulteration.",
    tags: ["Pure"],
    stock: true,
    units: [
      { label: "1 litre",  price: 3500 },
      { label: "5 litre keg",     price: 16000 },
      { label: "25 litre keg",    price: 76000 }
    ]
  },
  {
    id: "yam",
    name: "Puna Yam Tubers",
    category: "Tubers & Fresh",
    img: "img/products/yam.webp",
    blurb: "Big, firm tubers from Benue. Pounds smooth, no watery centre.",
    tags: [],
    stock: true,
    units: [
      { label: "1 tuber",  price: 6500 },
      { label: "3 tubers",          price: 18000 },
      { label: "6 tubers",    price: 34000 }
    ]
  },
  {
    id: "plantain",
    name: "Ripe Plantain",
    category: "Tubers & Fresh",
    img: "img/products/plantain.webp",
    blurb: "Ripe and ready for dodo. Picked the morning we deliver.",
    tags: [],
    stock: true,
    units: [
      { label: "1 bunch", price: 4000 },
      { label: "2 bunches",                    price: 7500 }
    ]
  },
  {
    id: "pepper-tomato",
    name: "Fresh Pepper & Tomato Mix",
    category: "Tubers & Fresh",
    img: "img/products/pepper-tomato.webp",
    blurb: "Rodo and tomatoes in one basket. Blended stew base, sorted fresh.",
    tags: ["Fresh daily"],
    stock: true,
    units: [
      { label: "Small basket",  price: 6000 },
      { label: "Big basket",    price: 11000 }
    ]
  },
  {
    id: "crayfish",
    name: "Dried Crayfish",
    category: "Soup Ingredients",
    img: "img/products/crayfish.webp",
    blurb: "Well dried, strong aroma, properly cleaned. Ground on request.",
    tags: ["Best seller"],
    stock: true,
    units: [
      { label: "Derica cup",               price: 3500 },
      { label: "Paint rubber",             price: 19000 },
      { label: "Paint rubber · ground",    price: 20000 }
    ]
  },
  {
    id: "egusi",
    name: "Egusi (Melon Seeds)",
    category: "Soup Ingredients",
    img: "img/products/egusi.webp",
    blurb: "Peeled, clean, no shells. Ground fresh if you want it that way.",
    tags: [],
    stock: true,
    units: [
      { label: "Derica cup",            price: 3000 },
      { label: "Paint rubber",          price: 16500 },
      { label: "Paint rubber · ground", price: 17500 }
    ]
  }
];

/* ---- Monthly food plans (optional — set to [] to hide the section) ---- */
const PLANS = [
  {
    id: "plan-small",
    name: "Small Family",
    price: 55000,
    per: "month",
    note: "Good for 2–4 people",
    items: ["1 paint rubber garri", "1 paint rubber beans", "1 litre palm oil", "2 yam tubers", "Derica crayfish"]
  },
  {
    id: "plan-family",
    name: "Full Family",
    price: 98000,
    per: "month",
    note: "Good for 5–8 people",
    popular: true,
    items: ["2 paint rubbers garri", "1 paint rubber beans", "1 paint rubber rice", "5 litres palm oil", "4 yam tubers", "Crayfish + egusi"]
  },
  {
    id: "plan-bulk",
    name: "Restaurant / Canteen",
    price: null,
    per: "custom",
    note: "Weekly supply, invoiced monthly",
    items: ["Bags of garri, beans & rice", "25L kegs of palm oil", "Bulk pepper & tomato", "Fixed price for 30 days", "Priority delivery slot"]
  }
];

/* ---- Customer reviews (edit freely) ---- */
const REVIEWS = [
  { name: "Chinwe O.", area: "Lekki",     text: "The garri is properly dry and the weight is real. I have stopped going to the market for garri.", stars: 5 },
  { name: "Tunde A.",  area: "Ikeja",     text: "Ordered on WhatsApp by 9am, got my beans and palm oil before 4pm same day. Very serious people.", stars: 5 },
  { name: "Amina S.",  area: "Surulere",  text: "I run a small canteen. They deliver my bags every week and the price does not jump anyhow.", stars: 5 },
  { name: "Ngozi E.",  area: "Gbagada",   text: "Crayfish had strong aroma and no sand. They ground it for me free of charge.", stars: 5 }
];

/* ---- Frequently asked questions ---- */
const FAQS = [
  { q: "How do I place an order?",
    a: "Add what you want to your basket, pick your area, then tap “Send order on WhatsApp”. Your full list, quantities and total are sent to us automatically — you don’t have to type anything. We reply to confirm." },
  { q: "Can I pay on delivery?",
    a: "Yes. You can pay on delivery by cash or transfer once you have seen the goods. For bags, kegs and bulk orders we ask for a part payment first so we can buy and load." },
  { q: "How fast is delivery?",
    a: "Orders confirmed before 12 noon are delivered the same day within Lagos. Anything after that goes out the next morning. Bulk and outside-Lagos orders take 1–3 days." },
  { q: "Is the weight complete?",
    a: "Yes. Every paint rubber, derica and bag is weighed before it leaves us. If you weigh it and it is short, we top it up or refund you — no argument." },
  { q: "Do you deliver outside Lagos?",
    a: "Yes, through transport parks and logistics partners. Message us with your state and what you need and we will confirm the cost before you pay." },
  { q: "Do you supply restaurants and shops?",
    a: "That is a big part of what we do. We supply canteens, restaurants, schools and provision shops weekly or monthly at wholesale prices. Use the bulk supply form and we will send a quote." }
];
