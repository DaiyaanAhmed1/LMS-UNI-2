# Deployment Guide: MarLn-University Site

This guide explains how to deploy the MarLn-University React (Vite) project to GitHub Pages.

---

## Prerequisites
- Node.js and npm installed
- GitHub account
- Project pushed to: https://github.com/RupamAtMarLn/MarLn-University.git

---

## 1. Install gh-pages

Install the `gh-pages` package as a dev dependency:

```bash
npm install --save-dev gh-pages
```

---

## 2. Update `package.json`

Add the following fields:

- **Homepage**
  ```json
  "homepage": "https://RupamAtMarLn.github.io/MarLn-University/"
  ```
- **Scripts**
  ```json
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
  ```

---

## 3. Update `vite.config.js`

Set the `base` property to your repo name:

```js
base: '/MarLn-University/',
```

---

## 4. Build and Deploy

Run the following command to build and deploy:

```bash
npm run deploy
```

This will:
- Build the project (`npm run build`)
- Publish the `dist` folder to the `gh-pages` branch

---

## 5. Access Your Site

Your site will be live at:
[https://RupamAtMarLn.github.io/MarLn-University/](https://RupamAtMarLn.github.io/MarLn-University/)

---

## 6. Redeploying

After making changes, simply run:

```bash
npm run deploy
```

---

## Troubleshooting
- Ensure the `base` in `vite.config.js` matches your repo name.
- Make sure your repo is public or you have access to GitHub Pages for private repos.
- If you see a blank page, check the browser console for 404 errors (often due to incorrect `base`).

---

## References
- [Vite Docs: Deploying to GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [gh-pages npm package](https://www.npmjs.com/package/gh-pages) 