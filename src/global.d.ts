/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface createElementOptions {
    className?: string;
    href?: string;
    target?: string;
    textContent?: string;
    title?: string;
}

interface GraphQLResponse {
    data?: {
        browser_plugin_merchant?: Retailer[];
    };
}

interface Retailer {
    n: string;
    r: string;
    s: string;
    md: string;
    mi: string;
    mo: string;
    su: string;
    isa: boolean;
}

interface RetailerStorageItem {
    retailers: Retailer[];
    expiry: number;
}
