import puppeteer from "puppeteer";
import getChrome from "../utils/chrome";

export default async function captureScreenshotOfUrl(url) {
  const chrome = await getChrome();

  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  });

  let screenshot = null;
  try {
    const page = await browser.newPage();
    await page.goto(url);
    screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
      encoding: "base64"
    });
  } catch (e) {
    console.error(e);
  }

  await browser.close();
  setTimeout(() => chrome.instance.kill(), 0);

  return screenshot;
}
