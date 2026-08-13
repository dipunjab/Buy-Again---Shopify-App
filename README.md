# Buy Again for Shopify Customer Accounts

**Free open-source Shopify reorder app for customer accounts.** Add a lightweight **Buy again** button to Shopify customer account order pages so shoppers can reorder previous purchases and return to cart faster.

Buy Again is a Shopify customer account UI extension built for merchants and developers who want a simple reorder experience without installing storefront scripts, editing theme code, or running a custom backend.

> Keywords: Shopify buy again app, Shopify reorder button, Shopify customer account extension, Shopify repeat purchase app, Shopify reorder previous order, Shopify customer accounts, open-source Shopify app, free Shopify reorder app.

## Overview

Buy Again adds a reorder action to Shopify's new customer accounts. When a customer opens a previous order, they can click **Buy again** and the app builds a Shopify cart add URL using the order's product variants and quantities.

The customer is then sent to the storefront cart with those items added.

This app is intentionally small:

- No storefront JavaScript injection
- No theme editing
- No custom backend by default
- No database
- No webhooks
- No app proxy required for the default flow

It is a focused Shopify extension-only app that does one job: help customers repeat a previous order faster.

## Why this app exists

Many Shopify stores rely on repeat purchases: consumables, supplements, beauty products, food, pet supplies, office supplies, custom products, B2B items, and subscription-adjacent reorder flows.

Customers often know exactly what they bought last time. Making them search the store again creates unnecessary friction.

Buy Again gives customers a faster path:

```txt
Customer account -> Previous order -> Buy again -> Cart
```

That means fewer clicks, less searching, and a smoother repeat purchase journey.

## Features

- Adds a **Buy again** order action inside Shopify customer accounts
- Reads the current order through Shopify's Customer Account API
- Adds previous order items back to the storefront cart
- Preserves existing cart items instead of clearing the cart
- Supports a configurable merchant-facing button label
- Runs only on Shopify customer account extension targets
- Includes a clean Shopify Admin app home page
- Extension-only architecture, so no hosting is required for the default setup
- MIT licensed and easy to fork

## What the customer sees

On a customer account order page, the app adds a simple order action:

```txt
Buy again
```

When clicked, the app prepares the reorder URL and sends the shopper to the storefront cart.

## What the merchant sees

The Shopify Admin app home explains:

- What the app does
- How to add it in the customer account editor
- Why it does not affect storefront performance
- How merchants can rename the button label

## Performance-friendly by design

Buy Again does **not** load on every storefront page.

The customer-facing extension only runs when Shopify renders this customer account target:

```txt
customer-account.order.action.menu-item.render
```

That means normal storefront pages, product pages, collection pages, and theme assets are not touched.

This is important for merchants who care about storefront speed, Core Web Vitals, SEO, and avoiding unnecessary JavaScript on public pages.

## Architecture

This project contains two Shopify UI extensions:

```txt
extensions/app-home
  Shopify Admin app home landing page

extensions/buy-again
  Customer account order action extension
```

The example app configuration lives in:

```txt
shopify.app.example.toml
```

Each user should generate their own local `shopify.app.toml` with `shopify app config link`.

The reorder button logic lives in:

```txt
extensions/buy-again/src/MenuActionItem.jsx
```

## How it works

1. Shopify renders the extension on a customer account order page.
2. The extension gets the current order ID.
3. It queries the Customer Account API for order line items.
4. It extracts variant IDs and quantities.
5. It builds a Shopify `/cart/add` URL.
6. The shopper is sent to the storefront cart.

The default flow uses Shopify's cart URL behavior instead of a custom backend.

## Hosting

No hosting is required for the default extension-only version.

You do not need:

- Vercel
- Render
- Railway
- Fly.io
- Heroku
- A VPS
- A custom Node/Express backend

For the default open-source setup, deploying with Shopify CLI is enough:

```bash
shopify app deploy
```

Shopify hosts the extension bundles.

## Requirements

- Node.js
- npm
- Shopify CLI
- Shopify Partner account
- Shopify development store
- New customer accounts enabled

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd buy-again
```

Install dependencies:

```bash
npm install
```

## Important: connect your own Shopify app

This repository does not commit a real `shopify.app.toml` file.

That is intentional.

Each developer or merchant should link the project to their own Shopify Partner app before running or deploying it:

```bash
shopify app config link
```

You can also copy the example file:

```bash
cp shopify.app.example.toml shopify.app.toml
```

Then replace:

```toml
client_id = "replace-with-your-shopify-client-id"
```

with your own Shopify app client ID from the Shopify Partner Dashboard.

Do not commit your real `shopify.app.toml`.

`client_id` is a public app identifier, not a secret, but committing a real app-specific config can confuse other users and accidentally link forks to the wrong Partner app.

Start local development:

```bash
npm run dev
```

Or directly:

```bash
shopify app dev
```

Follow the Shopify CLI prompts to connect the project to your Shopify app and development store.

## Shopify setup

After starting the app locally or deploying it:

1. Open Shopify Admin.
2. Go to **Settings**.
3. Open **Customer accounts**.
4. Open the checkout and accounts editor.
5. Add the **Buy again** order action.
6. Optional: change the **Button label** setting.
7. Save the editor.
8. Open a customer account order page and test the action.

## Button label setting

Merchants can rename the button from Shopify's checkout and accounts editor.

The setting is defined in:

```txt
extensions/buy-again/shopify.extension.toml
```

```toml
[[settings.fields]]
key = "button_label"
type = "single_line_text_field"
name = "Button label"
description = "The text shown on the order action button. Defaults to Buy again."
```

If no custom label is configured, the button defaults to:

```txt
Buy again
```

Example merchant labels:

- Buy again
- Reorder
- Add order to cart
- Order again
- Repeat this order

## Deploying

Build the app:

```bash
npm run build
```

Deploy to Shopify:

```bash
npm run deploy
```

or:

```bash
shopify app deploy
```

Then release the deployed app version from the Shopify Partner Dashboard if required.

## Distribution options

### Open-source / self-hosted by users

This is the simplest path.

Developers or merchants can fork this repo, create their own Shopify app in the Partner Dashboard, deploy the extensions, and install it on their own store.

No external hosting is needed for this default version.

### Public Shopify App Store app

If you want to list this as a public Shopify App Store app, you may need a more traditional hosted Shopify app architecture depending on Shopify's current app distribution requirements.

That usually means:

- Hosted embedded app backend
- OAuth/session handling
- Billing if paid
- App review requirements
- Privacy policy and support pages

This repository is currently optimized for free open-source distribution.

## Access scopes

The app is intentionally minimal.

Current scope:

```txt
customer_read_orders
```

This is used so the customer account extension can read order line items for the reorder action.

## Limitations

This app uses Shopify's URL-based cart add flow.

That is good for:

- Adding variants
- Adding quantities
- Preserving the customer's existing cart
- Keeping the app backend-free

However, URL-based cart add behavior is limited for advanced line item data.

If your store needs exact custom line item properties for every reordered line item, then you should extend this app with one of these approaches:

- Storefront Ajax Cart API bridge
- App proxy route
- Theme app extension
- Custom storefront route

The current version focuses on the safest lightweight default: reorder variants and quantities without storefront performance overhead.

## Line item properties note

Shopify has multiple cart APIs and cart URL behaviors. They do not all support the same data shape.

For simple repeat purchase flows, variant ID plus quantity is often enough.

For stores selling customized products, engraved products, bundle configurations, file uploads, or products that depend heavily on custom line item properties, additional storefront-side logic may be required.

## Development commands

```bash
npm install
npm run dev
npm run build
npm run deploy
```

Useful Shopify CLI commands:

```bash
shopify app dev
shopify app build
shopify app deploy
shopify app info
```

## Project structure

```txt
.
+-- extensions
|   +-- app-home
|   |   +-- src
|   |       +-- pages
|   |           +-- HomePage.jsx
|   +-- buy-again
|       +-- src
|           +-- MenuActionItem.jsx
+-- shopify.app.toml
+-- package.json
+-- README.md
+-- LICENSE
+-- SECURITY.md
+-- CHANGELOG.md
```

## Good use cases

Buy Again can be useful for Shopify stores selling:

- Supplements
- Cosmetics and beauty products
- Pet food and pet supplies
- Grocery and food products
- Coffee and tea
- Office supplies
- B2B repeat-purchase products
- Hobby supplies
- Replacement parts
- Frequently reordered products

## Not ideal for

The default version may not be enough for stores where every order line depends on complex custom data, such as:

- Heavy product personalization
- Upload-based products
- Complex bundle builders
- Line-item-property-based pricing
- Draft-order-only workflows

Those stores can still use this project as a base, but they will likely need a storefront Ajax or app proxy enhancement.

## SEO description

Buy Again is a free open-source Shopify reorder app that adds a Buy again button to Shopify customer account order pages. It helps customers reorder previous purchases, add items back to cart, and complete repeat purchases faster without storefront scripts or theme edits.

## FAQ

### Does this app need hosting?

No. The default version is extension-only and deployed through Shopify CLI. Shopify hosts the extension bundles.

### Does it slow down my storefront?

No storefront script is injected. The customer-facing extension only runs where Shopify mounts the customer account order action.

### Can merchants rename the button?

Yes. Merchants can update the button label in the checkout and accounts editor.

### Does it support old customer accounts?

This app is built for Shopify's new customer accounts and customer account UI extensions.

### Does it create a checkout directly?

No. It sends shoppers to the cart so they can review items before checkout.

### Does it clear the customer's existing cart?

No. The app uses a cart add route intended to add items while preserving existing cart contents.

### Does it support every line item property?

Not in the default backend-free version. For exact custom properties on every line, use an Ajax Cart API bridge or app proxy enhancement.

### Can I publish this as a free public app?

You can use this code as the base for a public app, but Shopify App Store distribution may require additional hosted app infrastructure and app review requirements.

### Can I fork it?

Yes. This project is MIT licensed.

## Roadmap ideas

Possible future improvements:

- Optional storefront Ajax bridge for full line item property support
- Better unavailable variant handling
- Cart error page for sold-out products
- Product image preview before redirect
- Merchant setting for button tone
- Multi-language labels
- Tests for cart URL generation

## Contributing

Contributions are welcome.

Good pull requests are usually small and focused:

- Improve Shopify compatibility
- Improve documentation
- Add tests
- Improve error handling
- Add optional advanced cart handling

Before opening a pull request, run:

```bash
npm run build
```

## Security

Please see [SECURITY.md](./SECURITY.md).

## License

MIT. See [LICENSE](./LICENSE).
