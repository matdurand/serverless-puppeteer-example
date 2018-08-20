# Serverless-framework + Puppeteer example

This is an demo project with many tweaks to make puppeteer work in AWS lambda using the serverless framework.

To make it work, you have to define a `serverless` profile in your aws cli credentials. If you only have one credential
set, just edit package.json, and remove `--aws-profile serverless` in the deploy script.

Then just run

```
npm install
npm run deploy
```

## Tweaks explained

### Puppeteer dynamic resolution of package.json

There was an [issue](https://github.com/GoogleChrome/puppeteer/issues/2245) (that has been closed) in the puppeteer repo related to the webpack.
The puppeteer team used a `require` statement to load they package.json but using a function call to resolve the root folder. This causes webpack to fail the resolution and make the call fails in AWS lambda. To fix this, I used the string-replace-loader webpack loader to perform 2 search and replace (see webpack.config.js). Also, the default webpack config minify everything and this causes some functions to get unresolved in puppeteer, so to fix this I disabled the minification, and manually added UglifyJsPlugin, but with `keep_fnames` to true.

### Some unresolved modules in webpack

Some modules cannot be resolved by webpack. I really don't know if puppeteer needed them, but it seems to work without it so I added a couple of ignore to the webpack config.

### node-formidable failed to load

There was loading error with some `require` when loading node-formidable. To fix the issue, I used a DefinePlugin in the webpack config to set global.GENTLY to false.

## Loading chrome into puppeteer

I used some code I found [here](https://nadeesha.github.io/headless-chrome-puppeteer-lambda-servelerless/) to get a chrome url and pass it to puppeteer.

## Chrome binary

Finally, both serverless-chrome and puppeteer bundle a version of chrome. Since we only need one, I added two settings to make the puppeteer chrome binary disappear.

- I created a .npmrc file at project root and added puppeteer_skip_chromium_download=true
- I added a exclusion in serverless.yml to exclude the puppeteer binary from the package.
