# Buy Again for Shopify Customer Accounts

**Free open-source Shopify reorder app for customer accounts.** Add a lightweight **Buy again** button to Shopify customer account order pages so shoppers can reorder previous purchases and return to cart faster.

Buy Again is a Shopify customer account UI extension built for merchants and developers who want a simple reorder experience without installing storefront scripts, editing theme code, or running a custom backend.

> Keywords: Shopify buy again app, Shopify reorder button, Shopify customer account extension, Shopify repeat purchase app, Shopify reorder previous order, Shopify customer accounts, open-source Shopify app, free Shopify reorder app.

## Overview

Buy Again adds a reorder action to Shopify's new customer accounts. When a customer opens a previous order, they can click **Buy again** and the app builds a Shopify cart add URL using the order's product variants and quantities.

The customer is then sent to the storefront cart. The flow is designed to add those items; verify the resulting cart behavior on your store.

This app is intentionally small:

- No storefront JavaScript injection
- No theme editing
- No custom backend by default
- No database
- No webhooks
- No app proxy required for the default flow

It is a focused Shopify extension-only app that does one job: help customers repeat a previous order faster.

## Features

- Adds a **Buy again** order action inside Shopify customer accounts
- Reads the current order through Shopify's Customer Account API
- Adds previous order items back to the storefront cart
- Designed to add previous order items to the cart; verify cart behavior on your store
- Supports a configurable merchant-facing button label
- Runs only on Shopify customer account extension targets
- Includes a clean Shopify Admin app home page
- Extension-only architecture, so no hosting is required for the default setup
- MIT licensed and easy to fork

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
5. It builds a Shopify `/cart/add` URL designed to add the order items to the cart.
6. The shopper is sent to the storefront cart.

The default flow uses Shopify's cart URL behavior instead of a custom backend.

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

## Limitations

This app uses Shopify's URL-based cart add flow.

That is good for:

- Adding variants
- Adding quantities
- Adding previous order items to the cart (verify behavior on your store)
- Keeping the app backend-free

However, URL-based cart add behavior is limited for advanced line item data.

If your store needs exact custom line item properties for every reordered line item, then you should extend this app with one of these approaches:

- Storefront Ajax Cart API bridge
- App proxy route
- Theme app extension
- Custom storefront route

The current version focuses on the safest lightweight default: reorder variants and quantities without storefront performance overhead.

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

## Requirements

- Node.js 22.12+
- npm
- Git
- Shopify Partner or Dev Dashboard account
- A Shopify development store with new customer accounts enabled

Shopify CLI is now a devDependency, so commands run through `npm run` by default. If you prefer a global install, you can still use:

```bash
npm install -g @shopify/cli@latest
```

## Installation

Clone the repository:

```bash
git clone https://github.com/dipunjab/Buy-Again---Shopify-App.git
cd Buy-Again---Shopify-App
npm install
```

Warning: use this repo as-is. Do NOT start from the Shopify app starter template and copy files in; it brings old package versions and permission scopes that can cause deploy errors.

## Connect your own Shopify app

This repository does not commit a real `shopify.app.toml` file.

That is intentional.

Each developer or merchant should link the project to their own Shopify app before running or deploying it:

```bash
npm run shopify -- app config link
```

Or directly:

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

with your own Shopify app client ID from the Shopify Partner Dashboard. Choose **Create new app** if you are setting up a new app, or use the config file for a linked app.

Do not commit your real `shopify.app.toml`.

`client_id` is public and identifies your Partner app, but committing a real app-specific config can link forks to the wrong app. Never commit the client secret.

## Required setup (otherwise the button stays disabled)

1. `shopify.app.toml` must include `scopes = "customer_read_orders"`.
2. Run `npm run deploy`, choose to release the version, and confirm in the Dev Dashboard that the version is **Active** and includes the required scope.
3. Set the app to **Custom distribution** in the Dev Dashboard and install it with the install link on your store. This is required because the Customer Account API needs Level 1 protected customer data access; public apps must request it, and the new dashboard may not expose a request button. Changing distribution may not be fully reversible, so use a test app first.
4. The install permission screen must mention **Orders**. If you change scopes later, uninstall and reinstall the app, then log out and back in as the customer because the customer session keeps the old permissions.
5. In the store admin, go to **Settings > Customer accounts > Customize**, open the **Order** page, add the **Buy again** action, save, and publish.

## Test it

Place a test order with at least two products, ideally including one line item that has a variant and a product that is still available.

Open the customer account order page, click the **Buy again** action, and verify that the shopper is sent to the storefront cart with the previous order items added.

## Test without running locally

After the developer deploys the app with `npm run deploy`, there is no need to run `npm run dev` to test it. Install the app on a development store using the install link in the Dev Dashboard, then configure the **Buy again** action in the customer accounts editor and test it from an order.

The developer deploys once for the initial install and deploys again after code changes. Store owners and customers install and use the app; they never run commands.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Button is greyed out | The extension could not load or read the order. | Open the browser console and look for `[buy-again]` messages. |
| “Level 1 protected customer data access is required” | The app needs Level 1 protected customer data access. | Use **Custom distribution** and install with the install link in the Dev Dashboard. |
| “Access denied for order field. Required access: customer_read_orders” | The active app version or customer session does not have the order scope. | Add `customer_read_orders`, deploy, uninstall and reinstall the app, then log out and back in as the customer. |
| “You are not a member of the requested organization” | Shopify CLI is authenticated to a different organization. | Run `shopify auth logout`, `shopify auth login`, then `shopify app config link`. |
| “api_version 2025-07 is not a valid API version” | An old API version is configured. | Use API version `2026-07` and `@shopify/ui-extensions` `~2026.7.0`. |
| “Type reference ... could not be found” | The UI extensions package version does not match the extension API. | Set `@shopify/ui-extensions` to `~2026.7.0`. |
| `npm ERESOLVE` errors | The project may have been started from the Shopify template, which can bring conflicting package versions. | Start from this repository and follow its setup instructions. |
| npm engine errors | The installed Node.js version is too old. | Use Node.js 22.12 or newer. |
| Blank page or `example.com` after install | The extension-only app has no website to display. | This is harmless. The app needs no website or hosting. |
| App is installed but the button is missing | The action has not been added to the customer account order page. | Go to **Settings > Customer accounts > Customize**, add **Buy again** to the Order page, then save and publish. |
| Two Buy again blocks appear | Old test apps are still installed. | Uninstall the old test apps from the store. |

## Development commands

```bash
npm install
npm run dev
npm run build
npm run deploy
```

Useful Shopify CLI commands:

```bash
npm run shopify -- app dev
npm run shopify -- app build
npm run shopify -- app deploy
npm run shopify -- app info
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
+-- shopify.app.example.toml
+-- shopify.app.toml (local only, not committed)
+-- package.json
+-- README.md
+-- LICENSE
+-- SECURITY.md
+-- CHANGELOG.md
```

## FAQ

### Does this app need hosting?

No. The default version is extension-only and deployed through Shopify CLI. Shopify hosts the extension bundles.

### Do I need hosting (Vercel, etc.)?

No. Shopify hosts the extension bundle after the developer runs `npm run deploy`.

### Do store owners or customers run `npm run deploy`?

No. Only the developer runs `npm run deploy`, initially and again after code changes.

### Does it slow down my storefront?

No storefront script is injected. The customer-facing extension only runs where Shopify mounts the customer account order action.

### Can merchants rename the button?

Yes. Merchants can update the button label in the checkout and accounts editor.

### Does it support old customer accounts?

This app is built for Shopify's new customer accounts and customer account UI extensions.

### Does it create a checkout directly?

No. It sends shoppers to the cart so they can review items before checkout.

### Does it clear the customer's existing cart?

It is designed to add items from the previous order to the cart. Verify the cart behavior on your store.

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
