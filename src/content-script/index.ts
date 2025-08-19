import "@webcomponents/webcomponentsjs";

const COOKIE_PREFIX = "airmiles_reminder_reminder";
const COOKIE_POPUP_POSITION = `${COOKIE_PREFIX}_popup_position`;
const COOKIE_POPUP_CLOSED = `${COOKIE_PREFIX}_popup_closed`;
const COOKIE_EARNING_AIRMILES = `${COOKIE_PREFIX}_retailer_earning`;
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
  2% { transform: rotate(5deg) scale(1.05); }
  4% { transform: rotate(0eg) scale(1.1); }
  6% { transform: rotate(-5deg) scale(1.15); }
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
  box-shadow: 0 0 0 0 #fff, 0 0 0 1px rgb(0,0,0,0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  color: #021b41;
  display: flex !important;
  flex-direction: column;
  font-family: 'Mylius Modern', helvetica, arial, sans-serif;
  font-size: 16px;
  letter-spacing: 0.03em;
  line-height: 1.5;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2147483647 !important;
}
.container-maximised {
  padding: 16px 16px 16px 20px;
  margin: 16px;
  max-height: 50vh;
  min-width: 300px;
  border-radius: 8px;
}
.container-minimised {
  right: -30px;
  top: 16px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  transition: right .25s ease;
  user-select: none;
}
.container-minimised:hover {
  right: 0;
}
.close, .minimise {
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
.minimise {
  right: 40px;
}
.close svg, .minimise svg {
  display: block;
}
.close:hover, .minimise:hover {
  border-color: rgb(156 163 175);
}
.counter {
  color: #fff;
  background-color: #2a78cd;
  border-radius: 50%;
  line-height: 16px;
  height: 16px;
  min-width: 16px;
  font-size: 12px;
  text-align: center;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1px;
  border: 2px solid #fff;
  transform: translate(-6px, -6px);
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
  display: block;
  width: 30px;
}
.earning {
  color: #ffd372;
}
.alert {
  color: #2a78cd;
  animation: tilt-shaking 2.5s infinite;
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
.mr-4 {
  margin-right: 16px;
}
.mt-3 {
  margin-top: 12px;
}
.p-4 {
  padding: 16px;
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
.relative {
  position: relative;
}
.bg-grey {
  background-color: #f2f2f2;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-move {
  cursor: move;
}
`;

class AirmilesReminderPopup extends HTMLElement {
    private container?: HTMLDivElement;
    private retailers: Retailer[] = [];

    private checkIcon = `
      <svg class="icon earning" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4.5-4.5M7.334 3.819a3.832 3.832 0 0 0 2.18-.904 3.832 3.832 0 0 1 4.972 0c.613.523 1.376.84 2.18.904a3.832 3.832 0 0 1 3.515 3.515c.064.804.38 1.567.904 2.18a3.832 3.832 0 0 1 0 4.972 3.832 3.832 0 0 0-.904 2.18 3.832 3.832 0 0 1-3.515 3.515 3.832 3.832 0 0 0-2.18.904 3.832 3.832 0 0 1-4.972 0 3.832 3.832 0 0 0-2.18-.904 3.832 3.832 0 0 1-3.515-3.515 3.832 3.832 0 0 0-.904-2.18 3.832 3.832 0 0 1 0-4.972c.523-.613.84-1.376.904-2.18a3.832 3.832 0 0 1 3.515-3.515Z"/>
      </svg>
    `;

    private minimiseButton = `
      <button class="minimise" title="Minimise this popup">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
          <path stroke="currentColor" stroke-width="2" d="M0,6 L12,6"/>
        </svg>
      </button>
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
      <svg class="icon expand" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10.033 5">
        <path d="M5.016 0 0 .003 2.506 2.5 5.016 5l2.509-2.5L10.033.003 5.016 0z"/>
      </svg>
    `;

    private draggableIcon = `
      <svg class="icon draggable" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 32 32">
        <path d="M10 6h4v4h-4zM18 6h4v4h-4zM10 14h4v4h-4zM18 14h4v4h-4zM10 22h4v4h-4zM18 22h4v4h-4z"/>
        <path d="M0 0h32v32H0z" style="fill:none"/>
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

    async buildPopup(maximised: Boolean) {
        this.container?.remove();
        if (!maximised) {
            this.container = await this.setupMinifiedPopup();
            return this.container;
        } else {
            this.container =
                this.retailers?.length > 1 ? this.setupMultipleOptions() : this.setupSingleOption();
            return this.container;
        }
    }

    async setupMinifiedPopup() {
        const isEarning = this.isEarning();

        const container = document.createElement("div");
        container.className = "container container-minimised";

        const containerInfo = container.getBoundingClientRect();
        const { [COOKIE_POPUP_POSITION]: savedPosition } =
            (await chrome.storage.local.get(COOKIE_POPUP_POSITION)) || {};
        if (savedPosition) {
            if (Number(savedPosition) + containerInfo.height >= window.innerHeight) {
                await chrome.storage.local.remove(COOKIE_POPUP_POSITION);
            } else {
                container.style.top = `${savedPosition}px`;
            }
        }

        container.innerHTML = `
          <div class="flex">
            <div class="open-maximised relative p-4 cursor-pointer">
            ${isEarning ? this.checkIcon : this.bellIcon}
            ${
                !isEarning
                    ? `<div class="counter">
                  ${this.retailers.length}
                </div>`
                    : ""
            }
            </div>
            <div class="bg-grey flex items-center cursor-move move-minimised">
              ${this.draggableIcon}
            </div>
          </div>`;

        container.querySelector(".open-maximised")?.addEventListener("click", async () => {
            const container = await this.buildPopup(true);
            this.shadowRoot?.appendChild(container);
        });

        const dragY = () => {
            const MIN_HEIGHT = 0;
            const MAX_HEIGHT = window.innerHeight - container.offsetHeight;

            const move = (evt: PointerEvent) => {
                const draggedHeight = evt.clientY - container.offsetHeight / 2;
                const minHeight = Math.max(MIN_HEIGHT, draggedHeight);
                const maxHeight = Math.min(minHeight, MAX_HEIGHT);
                container.style.top = `${Math.round(maxHeight)}px`;
            };

            const up = async () => {
                await chrome.storage.local.set({
                    [COOKIE_POPUP_POSITION]: container.getBoundingClientRect().top,
                });
                removeEventListener("pointermove", move);
                removeEventListener("pointerup", up);
            };

            addEventListener("pointermove", move);
            addEventListener("pointerup", up);
        };

        container.querySelector(".move-minimised")?.addEventListener("pointerdown", dragY);

        return container;
    }

    setupSingleOption() {
        const { r, su } = this.retailers[0];
        const isEarning = this.isEarning();

        const container = document.createElement("div");
        container.className = "container container-maximised";

        container.innerHTML = `
          ${this.minimiseButton}
          ${this.closeButton}
          <div class="flex mb-3">
            <span class="mr-4">
              ${isEarning ? this.checkIcon : this.bellIcon}
            </span>
            <div>
              <h1 class="title">${isEarning ? "Rewards activated!" : "Rewards opportunity!"}</h1>
              <p class="body">${isEarning ? `Earning: ${r}` : `Earn: ${r}`}</p>
            </div>
          </div>
          <a class="button block" href="${su}" ${isEarning ? 'target="_blank"' : ""}>${isEarning ? "More Details" : "Apply reward"}</a>
        `;

        container.querySelector(".minimise")?.addEventListener("click", async () => {
            const container = await this.buildPopup(false);
            this.shadowRoot?.appendChild(container);
        });

        container
            .querySelector(".close")
            ?.addEventListener("click", (event) => this.onPopupClose(event));

        return container;
    }

    setupMultipleOptions() {
        const container = document.createElement("div");
        container.className = "container container-maximised";

        container.innerHTML = `
          ${this.minimiseButton}
          ${this.closeButton}
          <div class="flex flex-1 items-center mb-3">
            <span class="mr-4">
              ${this.bellIcon}
            </span>
            <div>
              <h1 class="title">${this.retailers.length} earning opportunities!</h1>
            </div>
          </div>
          <div class="retailer-list hidden">
            ${this.retailers
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

        container.querySelector(".minimise")?.addEventListener("click", async () => {
            const container = await this.buildPopup(false);
            this.shadowRoot?.appendChild(container);
        });

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

    async onWindowResize(event: Event, container: HTMLDivElement) {
        const containerInfo = container.getBoundingClientRect();

        if (containerInfo.top + containerInfo.height >= window.innerHeight) {
            const newPosition = window.innerHeight - (containerInfo.height + 16);
            await chrome.storage.local.set({
                [COOKIE_POPUP_POSITION]: newPosition,
            });
            container.style.top = `${newPosition}px`;
        }
    }

    onPopupClose(event: Event) {
        event.preventDefault();
        this.remove();
        setCookie(COOKIE_POPUP_CLOSED);
    }

    async connectedCallback() {
        const retailers = this.getRetailers();
        if (!retailers?.length) return;

        this.retailers = retailers;
        const container = await this.buildPopup(false);

        const shadowRoot = this.attachShadow({ mode: "open" });

        shadowRoot.appendChild(this.setupStyles());
        shadowRoot.appendChild(container);
        window.addEventListener("resize", (event) => this.onWindowResize(event, container));
    }
}

(async () => {
    if (isCookieSet(COOKIE_POPUP_CLOSED)) return;
    if (isCookieSet(COOKIE_RETAILER_NOT_SUPPORTED)) return;

    const isAlreadyEarning = isCookieSet(COOKIE_EARNING_AIRMILES);

    const { isEarning, retailers } = await chrome.runtime.sendMessage({
        isAlreadyEarning,
        type: "read_url",
        url: window.location.href,
    });

    if (!isAlreadyEarning && isEarning) {
        setCookie(COOKIE_EARNING_AIRMILES, 432000 /* 5 days */);
    }

    if (!retailers?.length) {
        setCookie(COOKIE_RETAILER_NOT_SUPPORTED, 86400 /* 24 hours */);
    }

    customElements.define("airmiles-reminder-popup", AirmilesReminderPopup);
    const webComponent = document.createElement("airmiles-reminder-popup");
    webComponent.setAttribute("is-earning", isEarning);
    webComponent.setAttribute("retailers", JSON.stringify(retailers));
    document.body.appendChild(webComponent);
})();
