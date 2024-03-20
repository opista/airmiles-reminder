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

const popupStyles = `
:host {
  all: initial !important;
}
::-webkit-scrollbar {
  width: 20px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #a8bbbf;
}
@keyframes tilt-shaking {
  0% { transform: rotate(0deg); }
  2% { transform: rotate(5deg); }
  4% { transform: rotate(0eg); }
  6% { transform: rotate(-5deg); }
  8% { transform: rotate(0eg); }
  10% { transform: rotate(5deg); }
  12% { transform: rotate(0eg); }
  14% { transform: rotate(-5deg); }
  16% { transform: rotate(0eg); }
  18% { transform: rotate(5deg); }
  20% { transform: rotate(0deg); }
}
.container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 0 0 #fff, 0 0 0 1px rgb(0,0,0,0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  color: #021b41;
  display: flex !important;
  flex-direction: column;
  font-family: 'Mylius Modern', helvetica, arial, sans-serif;
  font-size: 16px;
  letter-spacing: 0.03em;
  line-height: 1.5;
  margin: 16px;
  max-height: 50vh;
  min-width: 300px;
  overflow: hidden;
  padding: 16px 16px 16px 20px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2147483647 !important;
}
.close {
  background: none;
  border-radius: 4px;
  border: 2px solid transparent;
  box-sizing: content-box;
  color: rgb(156 163 175);
  cursor: pointer;
  font-size: 20px;
  height: 10px;
  line-height: 10px;
  outline: 0;
  padding: 2px;
  position: absolute;
  right: 16px;
  top: 16px;
  width: 10px;
}
.close svg {
  display: block;
}
.close:hover {
  border-color: rgb(156 163 175);
}
.title, .subtitle {
  color: #172E4D;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
}
.flex-1 {
  flex: 1;
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
  animation: tilt-shaking 2.5s 3;
  animation-delay: 2.5s;
}
.flex {
  display: flex;
}
.justify-space-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.body {
  line-height: inherit;
  margin: 0;
}
.button {
  display: inline-block;
  background: #2a78cd;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  line-height: 16px;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  user-select: none;
}
.button.outline {
  background: none;
  color: #2a78cd;
  border: 2px solid #2a78cd;
}
.button.outline:hover {
  background: #2a78cd1a;
}
.button.block {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 170px;
}
.button-expand {
  display: flex;
  justify-content: center;
}
.button-expand svg {
  margin-left: 8px;
  width: 10px;
}
.button:hover {
  background: #5493d7;
}
.mb-3 {
  margin-bottom: 12px;
}
.mr-3 {
  margin-right: 12px;
}
.mt-3 {
  margin-top: 12px;
}
.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.row + .row {
  border-top: 1px solid #d5d5d5;
}
.row:last-child {
  padding-bottom: 0;
}
.toggle {
  display: block;
}
.toggle.open svg {
  transform: rotate(180deg);
}
.retailer-list {
  scrollbar-gutter: stable;
  min-height: 64px;
  overflow: auto;
}
.hidden {
  height: 65px;
  overflow: hidden;
}
`;

class AviosReminderPopup extends HTMLElement {
    private checkIcon = `
      <svg class="icon earning" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4.5-4.5M7.334 3.819a3.832 3.832 0 0 0 2.18-.904 3.832 3.832 0 0 1 4.972 0c.613.523 1.376.84 2.18.904a3.832 3.832 0 0 1 3.515 3.515c.064.804.38 1.567.904 2.18a3.832 3.832 0 0 1 0 4.972 3.832 3.832 0 0 0-.904 2.18 3.832 3.832 0 0 1-3.515 3.515 3.832 3.832 0 0 0-2.18.904 3.832 3.832 0 0 1-4.972 0 3.832 3.832 0 0 0-2.18-.904 3.832 3.832 0 0 1-3.515-3.515 3.832 3.832 0 0 0-.904-2.18 3.832 3.832 0 0 1 0-4.972c.523-.613.84-1.376.904-2.18a3.832 3.832 0 0 1 3.515-3.515Z"/>
      </svg>
    `;

    private closeButton = `
      <button class="close" title="Close this popup">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
          <path stroke="currentColor" stroke-width="2" d="M1 11 11 1M1 1l10 10"/>
        </svg>
      </button>
    `;

    private bellIcon = `
      <svg class="icon alert" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.354 21c.706.622 1.632 1 2.646 1 1.015 0 1.94-.378 2.646-1M2.294 5.82A4.007 4.007 0 0 1 4.326 2.3m17.376 3.52A4.007 4.007 0 0 0 19.67 2.3M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.088 1.936.014.182.053.252.2.36.133.099.73.099 1.927.099h13.222c1.197 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.087-1.936C18.78 13.206 18 11.09 18 8Z"/>
      </svg>
    `;

    private expandIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10.033 5">
        <path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z"/>
      </svg>
    `;

    constructor() {
        super();
    }

    isEarning() {
        const value = this.getAttribute("is-earning");
        return value === "true";
    }

    getRetailers() {
        const retailers = this.getAttribute("retailers");

        if (!retailers) return null;

        try {
            return JSON.parse(retailers);
        } catch (err) {
            return null;
        }
    }

    setupPopup(retailers: Retailer[]) {
        return retailers?.length > 1
            ? this.setupMultipleOptions(retailers)
            : this.setupSingleOption(retailers[0]);
    }

    setupSingleOption({ r, su }: Retailer) {
        const isEarning = this.isEarning();

        const container = document.createElement("div");
        container.className = "container";

        container.innerHTML = `
          ${this.closeButton}
          <div class="flex mb-3">
            ${isEarning ? this.checkIcon : this.bellIcon}
            <div>
              <h1 class="title">${isEarning ? "Avios rewards activated!" : "Avios opportunity!"}</h1>
              <p class="body">${isEarning ? `Earning: ${r}` : `Earn: ${r}`}</p>
            </div>
          </div>
          <a class="button block" href="${su}" ${isEarning ? 'target="_blank"' : ""}>${isEarning ? "More Details" : "Apply reward"}</a>
        `;

        container
            .querySelector(".close")
            ?.addEventListener("click", (event) => this.onPopupClose(event));

        return container;
    }

    setupMultipleOptions(retailers: Retailer[]) {
        const container = document.createElement("div");
        container.className = "container";

        container.innerHTML = `
          ${this.closeButton}
          <div class="flex flex-1 items-center mb-3">
            ${this.bellIcon}
            <div>
              <h1 class="title">${retailers.length} Avios opportunities!</h1>
            </div>
          </div>
          <div class="retailer-list hidden">
            ${retailers
                .map(
                    ({ n, r, su }) => `
              <div class="row flex items-center justify-space-between py-2">
                <div class="mr-3">
                  <h2 class="subtitle">${n}</h2>
                  <p class="body">Earn: ${r}</p>
                </div>
                <a class="button" href="${su}" target="_blank">Apply reward</a>
              </div>
              `,
                )
                .join("")}
          </div>
          <a class="toggle mt-3 flex-1">
            <div class="button outline button-expand">Show more ${this.expandIcon}</div>
          </a>
        `;

        container
            .querySelector(".toggle")
            ?.addEventListener("click", (event) => this.onPopupAccordionClick(event, container));

        container
            .querySelector(".close")
            ?.addEventListener("click", (event) => this.onPopupClose(event));

        return container;
    }

    setupStyles() {
        const style = document.createElement("style");
        style.textContent = popupStyles;
        return style;
    }

    onPopupAccordionClick(event: Event, container: HTMLDivElement) {
        event.preventDefault();
        const retailerList = container.querySelector(".retailer-list");
        retailerList?.classList.toggle("hidden");

        const toggle = container.querySelector(".toggle");

        if (retailerList && toggle) {
            const isHidden = retailerList?.classList.contains("hidden");
            if (isHidden) {
                retailerList.scrollTop = 0;
                toggle.innerHTML = `<div class="button outline button-expand">Show more ${this.expandIcon}</div>`;
                toggle.classList.remove("open");
            } else {
                toggle.innerHTML = `<div class="button outline button-expand">Show less ${this.expandIcon}</div>`;
                toggle.classList.add("open");
            }
        }
    }

    onPopupClose(event: Event) {
        event.preventDefault();
        this.remove();
        setCookie(COOKIE_POPUP_CLOSED);
    }

    connectedCallback() {
        const retailers = this.getRetailers();
        if (!retailers?.length) return;

        const popup = this.setupPopup(retailers);
        const shadowRoot = this.attachShadow({ mode: "closed" });

        shadowRoot.appendChild(this.setupStyles());
        shadowRoot.appendChild(popup);
    }
}

(async () => {
    if (isCookieSet(COOKIE_POPUP_CLOSED)) return;
    if (isCookieSet(COOKIE_RETAILER_NOT_SUPPORTED)) return;

    const isAlreadyEarning = isCookieSet(COOKIE_EARNING_AVIOS);

    const { isEarning, retailers } = await chrome.runtime.sendMessage({
        isAlreadyEarning,
        type: "read_url",
        url: window.location.href,
    });

    if (!isAlreadyEarning && isEarning) {
        setCookie(COOKIE_EARNING_AVIOS, 432000 /* 5 days */);
    }

    if (!retailers?.length) {
        setCookie(COOKIE_RETAILER_NOT_SUPPORTED, 86400 /* 24 hours */);
    }

    customElements.define("avios-reminder-popup", AviosReminderPopup);
    const webComponent = document.createElement("avios-reminder-popup");
    webComponent.setAttribute("is-earning", isEarning);
    webComponent.setAttribute("retailers", JSON.stringify(retailers));
    document.body.appendChild(webComponent);
})();
