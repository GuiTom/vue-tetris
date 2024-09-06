const fs = require('fs');
const cheerio = require('cheerio');
const scaner = require('./scaner')
const cp = require('./copy')
function writeHtml(){
// 读取HTML文件
const filePath = scaner.rootPath+'/index.html'; // 替换成你的HTML文件路径
const htmlContent = fs.readFileSync(filePath, 'utf8');

// 使用cheerio解析HTML
const $ = cheerio.load(htmlContent);

// 检查 <head> 中是否已有 <link rel="icon" href="/icon.webp">
const iconLink = $('head link[rel="icon"][href="/icon.webp"]');

if (iconLink.length === 0) {
  // 如果没有找到，就插入 <link rel="icon" href="/icon.webp"> 到 <head> 尾部
  $('head').append('<link rel="icon" href="/icon.webp">');
  console.log('Icon link added.');
} else {
  console.log('Icon link already exists.');
}
// 检查 <head> 中是否已有 <link rel="manifest" href="/manifest.json">
const manifest = $('head link[rel="manifest"][href="/manifest.json"]');

if (manifest.length === 0) {
  // 如果没有找到，就插入 <link rel="icon" href="/icon.webp"> 到 <head> 尾部
  $('head').append('<link rel="manifest" href="/manifest.json">');
  console.log('Icon link added.');
} else {
  console.log('Icon link already exists.');
}
// 检查 <body> 中是否已有 <script > if('serviceWorker...
 const scriptContent = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
`;

// 检查是否已有这个 script 标签
let scriptExists = false;
$('body script').each(function () {
  if ($(this).html().includes("navigator.serviceWorker.register('/service-worker.js')")) {
    scriptExists = true;
  }
});

if (!scriptExists) {
    // 如果script不存在，插入到<head>的尾部
    $('body').append(`<script>${scriptContent}</script>`);
    console.log('Service Worker script added.');
  } else {
    console.log('Service Worker script already exists.');
  }
// 将更新后的HTML写回文件
fs.writeFileSync(filePath, $.html(), 'utf8');
}
async function main(){
  await cp.copyFiles('./manifest',scaner.rootPath)
  writeHtml();
  scaner.updateCache();
}
main()

