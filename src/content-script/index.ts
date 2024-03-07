import "@webcomponents/webcomponentsjs";

const COOKIE_PREFIX = "avios_reminder";
const COOKIE_POPUP_CLOSED = `${COOKIE_PREFIX}_popup_closed`;
const COOKIE_EARNING_AVIOS = `${COOKIE_PREFIX}_retailer_earning`;
const COOKIE_RETAILER_NOT_SUPPORTED = `${COOKIE_PREFIX}_retailer_not_supported`;

const setCookie = (key: string, expiry?: number) =>
    (document.cookie = [
        `${key}=${new Date().toISOString()}`,
        expiry && `max-age=${expiry}`,
        "path=/",
    ]
        .filter(Boolean)
        .join("; "));

const isCookieSet = (key: string) => document.cookie.includes(`${key}=`);

class AviosReminderPopup extends HTMLElement {
    constructor() {
        super();
    }

    isEarning() {
        const value = this.getAttribute("is-earning");
        return value === "true";
    }

    getRetailer() {
        const retailer = this.getAttribute("retailer");

        if (!retailer) return null;

        try {
            return JSON.parse(retailer);
        } catch (err) {
            return null;
        }
    }

    setupPopup({ r, su }: Retailer) {
        const isEarning = this.isEarning();

        const container = document.createElement("div");
        container.className = "container";

        const checkIcon = `
      <svg class="icon earning" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4.5-4.5M7.334 3.819a3.832 3.832 0 0 0 2.18-.904 3.832 3.832 0 0 1 4.972 0c.613.523 1.376.84 2.18.904a3.832 3.832 0 0 1 3.515 3.515c.064.804.38 1.567.904 2.18a3.832 3.832 0 0 1 0 4.972 3.832 3.832 0 0 0-.904 2.18 3.832 3.832 0 0 1-3.515 3.515 3.832 3.832 0 0 0-2.18.904 3.832 3.832 0 0 1-4.972 0 3.832 3.832 0 0 0-2.18-.904 3.832 3.832 0 0 1-3.515-3.515 3.832 3.832 0 0 0-.904-2.18 3.832 3.832 0 0 1 0-4.972c.523-.613.84-1.376.904-2.18a3.832 3.832 0 0 1 3.515-3.515Z"/>
      </svg>
    `;

        const bellIcon = `
      <svg class="icon alert" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.354 21c.706.622 1.632 1 2.646 1 1.015 0 1.94-.378 2.646-1M2.294 5.82A4.007 4.007 0 0 1 4.326 2.3m17.376 3.52A4.007 4.007 0 0 0 19.67 2.3M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.088 1.936.014.182.053.252.2.36.133.099.73.099 1.927.099h13.222c1.197 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.087-1.936C18.78 13.206 18 11.09 18 8Z"/>
      </svg>
    `;

        container.innerHTML = `
      <button class="close" title="Close this popup">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
          <path stroke="currentColor" stroke-width="2" d="M1 11 11 1M1 1l10 10"/>
        </svg>
      </button>
      <div class="row">
        ${isEarning ? checkIcon : bellIcon}
        <div>
          <h1 class="title">${isEarning ? "Avios rewards activated!" : "Avios opportunity!"}</h1>
          <p class="body">${isEarning ? `Earning: ${r}` : `Earn: ${r}`}</p>
        </div>
      </div>
      <a class="button" href="${su}" ${isEarning ? 'target="_blank"' : ""}>${isEarning ? "More Details" : "Apply reward"}</button>
    `;

        container
            .querySelector(".close")
            ?.addEventListener("click", (event) => this.onPopupClose(event));

        return container;
    }

    setupStyles() {
        const style = document.createElement("style");
        style.textContent = `
    :host {
      all: initial !important;
    }
    .container {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 0 0 0 #fff, 0 0 0 1px rgb(0,0,0,0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      color: #021b41;
      display: block !important;
      font-family: 'Mylius Modern', helvetica, arial, sans-serif;
      font-size: 16px;
      letter-spacing: 0.03em;
      line-height: 1.5;
      margin: 16px;
      padding: 16px 16px 16px 20px;
      position: fixed;
      right: 0;
      top: 0;
      width: 300px;
      z-index: 2147483647 !important;
    }
    .close {
      background: none;
      border-radius: 4px;
      border: 2px solid transparent;
      box-sizing: content-box;
      color: rgb(156 163 175);
      cursor: pointer;
      float: right;
      font-size: 20px;
      height: 10px;
      line-height: 10px;
      outline: 0;
      padding: 2px;
      width: 10px;
    }
    .close svg {
      display: block;
    }
    .close:hover {
      border-color: rgb(156 163 175);
    }
    .title {
      color: #172E4D;
      font-size: inherit;
      line-height: inherit;
      margin: 0;
      user-select: none;
    }
    .icon {
      margin-right: 16px;
      width: 30px;
    }
    .earning {
      color: #ffd372;
    }
    .alert {
      color: #2a78cd;
    }
    .row {
      display: flex;
    }
    .body {
      line-height: inherit;
      margin: 0;
      user-select: none;
    }
    .button {
      background: #2a78cd;
      border-radius: 4px;
      color: #fff;
      display: block;
      line-height: 16px;
      margin: 12px auto 0;
      padding: 8px 16px;
      text-align: center;
      text-decoration: none;
      width: 170px;
    }
    .button:hover {
      background: #5493d7;
    }
    `;

        return style;
    }

    onPopupClose(event: Event) {
        event.preventDefault();
        this.remove();
        setCookie(COOKIE_POPUP_CLOSED);
    }

    connectedCallback() {
        const retailer = this.getRetailer();
        if (!retailer) return;

        const popup = this.setupPopup(retailer);
        const shadowRoot = this.attachShadow({ mode: "closed" });

        shadowRoot.appendChild(this.setupStyles());
        shadowRoot.appendChild(popup);
    }
}

(async () => {
    if (isCookieSet(COOKIE_POPUP_CLOSED)) return;
    if (isCookieSet(COOKIE_RETAILER_NOT_SUPPORTED)) return;

    const isAlreadyEarning = isCookieSet(COOKIE_EARNING_AVIOS);

    const { isEarning, retailer } = await chrome.runtime.sendMessage({
        isAlreadyEarning,
        type: "read_url",
        url: window.location.href,
    });

    if (!isAlreadyEarning && isEarning) {
        setCookie(COOKIE_EARNING_AVIOS, 432000 /* 5 days */);
    }

    if (!retailer) {
        setCookie(COOKIE_RETAILER_NOT_SUPPORTED, 86400 /* 24 hours */);
    }

    if (retailer) {
        customElements.define("avios-reminder-popup", AviosReminderPopup);
        const webComponent = document.createElement("avios-reminder-popup");
        webComponent.setAttribute("is-earning", isEarning);
        webComponent.setAttribute("retailer", JSON.stringify(retailer));
        document.body.appendChild(webComponent);
    }
})();
