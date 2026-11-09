const HIGHLIGHTS = [
  {
    label: '01',
    title: 'Native order action',
    body: 'Adds a Buy again action to Shopify customer account order pages.',
  },
  {
    label: '02',
    title: 'Cart add link',
    body: "Builds a Shopify cart add link from the order's variants and quantities.",
  },
  {
    label: '03',
    title: 'No storefront script',
    body: 'Runs only when Shopify renders the customer account extension target.',
  },
];

const STEPS = [
  'Make sure the app has the customer_read_orders permission and the latest version is released.',
  'Install the app on your store (custom distribution install link).',
  'Open Settings > Customer accounts > Customize and add the Buy again action to the Order page.',
  'Optionally rename the button label in the extension settings.',
];

export default function HomePage() {
  return (
    <s-page heading="Buy Again">
      <s-button
        slot="primary-action"
        variant="primary"
        href="shopify://admin/settings/customer_accounts"
      >
        Configure in editor
      </s-button>

      <s-section>
        <s-box
          background="strong"
          border="base strong"
          borderRadius="large-200"
          padding="large-500"
        >
          <s-grid
            gridTemplateColumns="minmax(0, 1.25fr) minmax(280px, 0.75fr)"
            gap="large-500"
            alignItems="center"
          >
            <s-stack direction="block" gap="large-200">
              <s-stack direction="inline" gap="small" alignItems="center">
                <s-badge tone="neutral" color="strong">
                  Open source
                </s-badge>
                <s-badge tone="success">Free to use</s-badge>
              </s-stack>

              <s-stack direction="block" gap="base">
                <s-heading>One-click reordering for Shopify customer accounts.</s-heading>
                <s-paragraph>
                  A lightweight customer account extension that lets shoppers
                  add products from a previous order back to their cart without
                  installing storefront JavaScript or touching the theme.
                </s-paragraph>
              </s-stack>

              <s-button-group>
                <s-button
                  slot="primary-action"
                  variant="primary"
                  href="shopify://admin/settings/customer_accounts"
                >
                  Add to customer accounts
                </s-button>
                <s-button
                  slot="secondary-actions"
                  variant="secondary"
                  href="https://shopify.dev/docs/apps/build/customer-accounts/order-action-extensions"
                  target="_blank"
                >
                  Read Shopify docs
                </s-button>
              </s-button-group>
            </s-stack>

            <s-box
              background="base"
              border="base strong"
              borderRadius="large-200"
              padding="large-300"
            >
              <s-stack direction="block" gap="base">
                <s-text color="subdued">Customer journey</s-text>
                <s-heading>Order to Buy again to Cart</s-heading>
                <s-paragraph>
                  The app stays out of the storefront and only appears in the
                  customer account surfaces selected by the merchant.
                </s-paragraph>
              </s-stack>
            </s-box>
          </s-grid>
        </s-box>
      </s-section>

      <s-section heading="Built for a small, focused job">
        <s-grid gridTemplateColumns="repeat(3, minmax(0, 1fr))" gap="base">
          {HIGHLIGHTS.map((item) => (
            <s-box
              key={item.title}
              background="base"
              border="base"
              borderRadius="large"
              padding="large-200"
            >
              <s-stack direction="block" gap="base">
                <s-badge tone="neutral" color="strong">
                  {item.label}
                </s-badge>
                <s-heading>{item.title}</s-heading>
                <s-paragraph>{item.body}</s-paragraph>
              </s-stack>
            </s-box>
          ))}
        </s-grid>
      </s-section>

      <s-section heading="How merchants use it">
        <s-box background="base" border="base" borderRadius="large" padding="large-200">
          <s-stack direction="block" gap="base">
            {STEPS.map((step, index) => (
              <s-stack key={step} direction="inline" gap="base" alignItems="start">
                <s-badge tone="neutral" color="strong">
                  {index + 1}
                </s-badge>
                <s-paragraph>{step}</s-paragraph>
              </s-stack>
            ))}
          </s-stack>
        </s-box>
      </s-section>

      <s-section slot="aside" heading="Extension scope">
        <s-stack direction="block" gap="base">
          <s-box background="base" border="base" borderRadius="large" padding="base">
            <s-stack direction="block" gap="small">
              <s-badge tone="success">Scoped</s-badge>
              <s-heading>No theme performance hit</s-heading>
              <s-paragraph>
                This app does not inject scripts into every storefront page. It
                runs where the customer account extension target is mounted.
              </s-paragraph>
            </s-stack>
          </s-box>

          <s-box background="subdued" border="base" borderRadius="large" padding="base">
            <s-stack direction="block" gap="small">
              <s-heading>Button label setting</s-heading>
              <s-paragraph>
                Merchants can rename the action from the checkout and accounts
                editor using the Button label setting.
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>
    </s-page>
  );
}
