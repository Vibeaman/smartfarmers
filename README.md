# Smart Farmers And Food Ltd

Farm produce and foodstuff shop for Abuja, garri, beans, rice, palm oil, yam, beef, chicken, fish
and soup ingredients. Customers build a basket and send the whole order to
WhatsApp in one tap. No backend, no database, no monthly fees.

**Live:** https://smartfarmers.vercel.app

---

## ⚠️ First thing to do: set the real prices

Open **`products.js`**. Every price in there is a **placeholder**, change all of
them to your real selling prices before sharing the site.

---

## How to change anything

Everything a shop owner needs is in one file: **`products.js`**.
You do not need to touch any other file.

### Change a price
Find the item, change the number. No commas, no ₦ sign.

```js
units: [
  { label: "Paint rubber · 4kg", price: 4500 },   // <- change 4500
]
```

### Mark something as finished / out of stock
```js
stock: false
```
The card greys out and cannot be added to a basket.

### Hide an item completely
```js
hidden: true
```

### Add a new product
Copy any block from `{` to `}`, paste it, and edit it.
`id` must be unique and lowercase-with-dashes. Drop the photo in
`img/products/` and point `img` at it.

```js
{
  id: "groundnut-oil",
  name: "Groundnut Oil",
  category: "Oil",
  img: "img/products/groundnut-oil.webp",
  blurb: "Cold pressed, no smell.",
  tags: ["New"],
  stock: true,
  units: [
    { label: "1 litre", price: 4200 },
    { label: "5 litre keg", price: 19500 }
  ]
}
```

### Change delivery fees or add an area
```js
areas: [
  { name: "Wuse / Wuse 2", fee: 2000 },
]
```

### Change phone / WhatsApp / email
Top of the file, in `SHOP`. The WhatsApp number must be **digits only** -
no `+`, no spaces: `2348074310530`.

### Free delivery threshold
```js
freeDeliveryFrom: 50000,   // free delivery from ₦50,000
minOrder: 5000,            // smallest order allowed
```

### Edit food plans, reviews, or FAQs
Scroll to `PLANS`, `REVIEWS`, `FAQS` at the bottom of the same file.
Set `PLANS = []` to remove the plans section entirely.

---

## Publishing a change

1. Edit `products.js`
2. Commit and push to `main`
3. Vercel rebuilds automatically, live in about 30 seconds

If you edited `styles.css`, `app.js` or `index.html`, also bump the cache
version in **`sw.js`** (`sf-v1` → `sf-v2`) so returning visitors get the new
files instead of the cached ones.

---

## What the customer sees

1. Browses the price list, picks a measure (paint rubber, bag, keg, tuber)
2. Adds to basket, the basket is saved on their phone, so it survives a reload
3. Picks their area, fills name / phone / address
4. Taps **Send order on WhatsApp**, a full itemised order arrives in your chat:

```
*NEW ORDER, Smart Farmers*

1. *Ijebu Garri (White)*
    Full bag · 50kg  ×1  =  ₦49,000
2. *Honey Beans (Oloyin)*
    Paint rubber · 4kg  ×1  =  ₦7,500

--------------
Items:  ₦56,500
Delivery (Wuse / Wuse 2):  ₦2,000
*TOTAL:  ₦58,500*
--------------

*Name:* Adewale Johnson
*Phone:* 08031234567
*Area:* Wuse / Wuse 2
*Address:* 14 Aminu Kano Crescent, Wuse 2
*Note:* Please grind the crayfish
```

You never have to ask "what do you want and how much" again.

---

## Features

**Selling**
- Basket with per-item measures, saved to the customer's phone
- One-tap itemised WhatsApp order, no typing
- Delivery fee by Abuja area, free over a threshold you set
- Minimum order check
- "Order the same as last time" for repeat customers
- Monthly food plans (recurring revenue)
- Bulk / wholesale quote form for canteens, schools and shops

**Getting found**
- Favicon and installable app icon
- Share preview card for WhatsApp, X and Facebook (`img/og.jpg`)
- `GroceryStore`, `ItemList` and `FAQPage` structured data for Google
- `sitemap.xml` + `robots.txt`
- Every product carries price range and stock status for search engines

**Keeping people**
- Installs to the home screen (PWA) and opens offline
- Delivery details remembered for the next order
- Search with ⌘K / Ctrl+K
- Product photos, categories, live search and filters

**Speed**
- No frameworks, no build step
- All images WebP, lazy-loaded below the fold
- Whole site is about 1.4 MB including all ten product photos

---

## Files

```
index.html               page structure + SEO tags
styles.css               all styling
app.js                   basket, checkout, search, PWA
products.js              ← the only file you normally edit
manifest.webmanifest     app install settings
sw.js                    offline cache (bump version on changes)
robots.txt, sitemap.xml  search engines
favicon.ico
img/
  hero.webp              hero photograph
  og.jpg                 link share preview
  logo.webp, logo.jpg    brand mark
  icon-192.png, icon-512.png, apple-touch-icon.png
  products/*.webp        product photos
```

## Running it locally

No build step. Just serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

© Smart Farmers And Food Ltd · Abuja, Nigeria
