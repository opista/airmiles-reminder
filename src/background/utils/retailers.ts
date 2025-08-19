const fetchRetailers = async (): Promise<Retailer[]> => {
    try {
        const response = await fetch("https://avios-partners-worker.elegant-spot9791.workers.dev", {
            headers: {
                "X-Runtime-ID": chrome.runtime.id,
            },
        });
        const data = await response.json();
        return data || null;
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
        console.log("Retailer list hasn't been stored or has expired, fetching latest data...");
        const retailers = updateRetailerStorage();
        return retailers;
    }

    return data.retailers;
}
