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
        setLoading(false);
        return;
      }

      try {
        const [orderResponse, shopResponse] = await Promise.all([
          fetch("shopify://customer-account/api/2026-07/graphql.json", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              query: ORDER_QUERY,
              variables: {id: orderId},
            }),
          }).then((response) => response.json()),
          shopify.query(SHOP_QUERY),
        ]);

        if (cancelled) return;

        const order = orderResponse.data?.order;
        const shopDomain = shopResponse.data?.shop?.primaryDomain?.host;
        const reorderItems = buildReorderItems(order);

        if (shopDomain && reorderItems.length > 0) {
          setCartUrl(buildCartAddUrl(shopDomain, reorderItems));
        }
      } catch {
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
