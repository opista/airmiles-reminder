# Avios Reminder

> A Chrome Extension to notify you when you're on a site that can reward you with Avios for your purchase

![Example Screenshot](/public/img/promo.jpg)

[Chrome Web Store URL](https://chrome.google.com/webstore/detail/lkcogehgaekpbdgbhalkdijfdbgliecl)

## How it works

1. The extension checks to see if the company of the site you're on has an Avios partnership
1. If it does, a popup will appear to let you know.
1. If you're already logged in, the extension will auto-collect Avios for you.
1. Otherwise, click the button on the popup and click through to the retailer yourself!

## Your Data

-   No data is collected on you **AT ALL**. This extension's code has been made available so that you can see everything that is going on. Google does not allow you to obfuscate code, so you can also inspect the extension.

## Installing

1. Check if your `Node.js` version is >= **20**.
   Change or configure the name of your extension on `src/manifest`.
2. Run `yarn install` to install the dependencies.

## Developing

run the command

```shell
$ cd avios-reminder

$ yarn dev
```

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `avios-reminder/build` folder
   Normal FrontEnd Developer Mode

3. access `http://0.0.0.0:3000/`when debugging the popup page, open `http://0.0.0.0:3000//popup.html`when debugging the options page, open `http://0.0.0.0:3000//options.html`

## Packing

After the development of your extension run the command

```shell
$ yarn build
```

Now, the content of the `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) for more info about publishing.

---

## Changelog

## [1.3.0] - 2024-01-07

-   Improves domain identification
-   Automatically applies for Avios on websites where possible
-   Auto-focuses search input in retailer list dropdown

## [1.2.0] - 2023-09-16

-   Migrates popup to web components to prevent style collisions
-   Updates styling

## [1.1.5] - 2023-09-14

-   Fix popup incorrect URL bug

## [1.1.4] - 2023-09-11

-   [BREAKING] API endpoint has changed
-   Retailer list is fetched on installation/update

## [1.1.3] - 2023-08-15

-   Fixed storage bug that caused retailer list to be fetched on every page load. The retailer list will be updated every 24 hours

## [1.1.2] - 2022-07-28

-   Migrate extension to manifest V3

## [1.1.0] - 2020-12-15

-   Added popup to search through existing list of retailer deals
-   Fixed URL that BA broke (!!!)
