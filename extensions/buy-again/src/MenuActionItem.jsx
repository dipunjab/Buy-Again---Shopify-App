import "@shopify/ui-extensions/preact";
import {useSettings} from "@shopify/ui-extensions/customer-account/preact";
import {render} from "preact";
import {useEffect, useState} from "preact/hooks";

const ORDER_QUERY = `#graphql
  query OrderForReorder($id: ID!) {
    order(id: $id) {
      id
      lineItems(first: 50) {
        nodes {
          quantity
          variantId
          customAttributes {
            key
            value
          }
        }
      }
    }
  }
`;

const SHOP_QUERY = `#graphql
  query ShopDomain {
    shop {
      primaryDomain {
        host
      }
    }
  }
`;

export default async () => {
  render(<MenuActionItem />, document.body);
};

function MenuActionItem() {
  const orderFromTarget = shopify.order?.value;
  const orderId = orderFromTarget?.id ?? shopify.orderId;
  const {button_label: buttonLabel} = useSettings();
  const label = getButtonLabel(buttonLabel);

  const [cartUrl, setCartUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function prepareCartLink() {
      if (!orderId) {
        console.warn("[buy-again] No order ID provided by the target.");
        setCartUrl("");
        setLoading(false);
        return;
      }

      try {
        const orderResponse = await fetch("shopify://customer-account/api/2026-07/graphql.json", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            query: ORDER_QUERY,
            variables: {id: orderId},
          }),
        }).then((response) => response.json());

        if (cancelled) return;

        if (orderResponse.errors) {
          const message = JSON.stringify(orderResponse.errors);
          console.warn("[buy-again] Customer account order query error:", message);

          if (message.includes("protected customer data")) {
            console.error("[buy-again] App has no Level 1 protected customer data access. Use Custom distribution and install via the install link.");
          }
          if (message.includes("customer_read_orders") || message.includes("Access denied")) {
            console.error("[buy-again] Missing customer_read_orders scope. Add it to shopify.app.toml, run npm run deploy, then uninstall and reinstall the app and log in again as the customer.");
          }

          setCartUrl("");
          setLoading(false);
          return;
        }

        const order = orderResponse.data?.order;
        if (!order) {
          console.warn("[buy-again] Order not found for this customer.");
          setCartUrl("");
          setLoading(false);
          return;
        }

        const reorderItems = buildReorderItems(order);
        if (!reorderItems.length) {
          console.warn("[buy-again] Order has no reorderable items (deleted or custom line items have no variant).");
          setCartUrl("");
          setLoading(false);
          return;
        }

        const shopResponse = await shopify.query(SHOP_QUERY);

        if (cancelled) return;

        if (shopResponse.errors) {
          const message = JSON.stringify(shopResponse.errors);
          console.warn("[buy-again] Shop query error:", message);

          if (message.includes("protected customer data")) {
            console.error("[buy-again] App has no Level 1 protected customer data access. Use Custom distribution and install via the install link.");
          }
          if (message.includes("customer_read_orders") || message.includes("Access denied")) {
            console.error("[buy-again] Missing customer_read_orders scope. Add it to shopify.app.toml, run npm run deploy, then uninstall and reinstall the app and log in again as the customer.");
          }

          setCartUrl("");
          setLoading(false);
          return;
        }

        const shopDomain = shopResponse.data?.shop?.primaryDomain?.host;
        if (!shopDomain) {
          console.warn("[buy-again] Unable to resolve the shop primary domain.");
          setCartUrl("");
          setLoading(false);
          return;
        }

        setCartUrl(buildCartAddUrl(shopDomain, reorderItems));
      } catch (error) {
        console.error("[buy-again] Failed to prepare cart link", error);
        setCartUrl("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    prepareCartLink();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <s-button
      accessibilityLabel={`${label} - add these order items to cart`}
      disabled={loading || !cartUrl}
      href={cartUrl}
      loading={loading}
      tone="critical"
    >
      {label}
    </s-button>
  );
}

function getButtonLabel(value) {
  const label = String(value ?? "").trim();

  return label || "Buy again";
}

function buildReorderItems(order) {
  return (order?.lineItems?.nodes ?? [])
    .map((item) => {
      const id = getNumericId(item.variantId);
      const quantity = Number(item.quantity);

      if (!id || !quantity || quantity <= 0) return null;

      return {
        id: Number(id),
        quantity,
        properties: buildProperties(item),
      };
    })
    .filter(Boolean);
}

function buildProperties(item) {
  return Object.fromEntries(
    (item.customAttributes ?? [])
      .filter((attribute) => attribute.key && attribute.value)
      .map((attribute) => [attribute.key, attribute.value]),
  );
}

function getNumericId(gid) {
  return gid?.split("/").pop() ?? "";
}

function buildCartAddUrl(shopDomain, items) {
  if (!shopDomain || !items.length) return "";

  const params = new URLSearchParams({return_to: "/cart"});

  items.forEach((item, index) => {
    params.append(`items[${index}][id]`, String(item.id));
    params.append(`items[${index}][quantity]`, String(item.quantity));

    Object.entries(item.properties ?? {}).forEach(([key, value]) => {
      params.append(`items[${index}][properties][${key}]`, value);
    });
  });

  return `https://${shopDomain}/cart/add?${params.toString()}`;
}
