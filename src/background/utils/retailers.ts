const query = `
{
  browser_plugin_merchant(where: {merchant_url: {_neq: ""}}) {
    external_id
    merchant {
      slug
    }
    merchant_url
    rate
  }
}
`;

const fetchRetailers = async (): Promise<Retailer[]> => {
  try {
    const response = await fetch("https://api.avios.com/v1/cbr/platform", {
      headers: {
        Authorization: "Basic cmVtaW5kZXItZXh0ZW5zaW9uOnB1YmxpYw==",
        Api_key: "ceq9fz96f5y8akpdsdn45y7k",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data?.data?.browser_plugin_merchant || null;
  } catch (err) {
    console.log("Error fetching retailer list", err);
    return [];
  }
};

const getRetailersFromStorage = async (): Promise<RetailerStorageItem> => {
  const result = await chrome.storage.local.get("retailer_list");
  return result?.retailer_list;
};

const updateRetailerStorage = async (): Promise<Retailer[]> => {
  const retailers = await fetchRetailers();

  if (!retailers) {
    console.log("Failed to fetch retailers");
    return [];
  }

  await chrome.storage.local.set({
    retailer_list: {
      expiry: new Date().getTime() + 86400000, // 24 hours
      retailers,
    },
  });

  return retailers;
};

export default async function getRetailerList(): Promise<Retailer[]> {
  const data = await getRetailersFromStorage();

  if (!data?.retailers?.length || new Date().getTime() > data.expiry) {
    console.log(
      "Retailer list hasn't been stored or has expired, fetching latest data..."
    );
    const retailers = updateRetailerStorage();
    return retailers;
  }

  return data.retailers;
}
