import log from "../utils/log";
import captureScreenshotOfUrl from "../chrome/screenshot";

export default async function handler(event, context, callback) {
  const queryStringParameters = event.queryStringParameters || {};
  const { url = "https://www.google.com" } = queryStringParameters;

  let data;

  log("Processing screenshot capture for", url);

  const startTime = Date.now();

  try {
    data = await captureScreenshotOfUrl(url);
  } catch (error) {
    console.error("Error capturing screenshot for", url, error);
    return callback(error);
  }

  log(
    `Chromium took ${Date.now() -
      startTime}ms to load URL and capture screenshot.`,
    data ? data.length : "no data"
  );

  return callback(null, {
    statusCode: 200,
    body: data,
    isBase64Encoded: true,
    headers: {
      "Content-Type": "image/png"
    }
  });
}
