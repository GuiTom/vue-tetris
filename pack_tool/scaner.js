const fs = require('fs').promises;
const path = require('path');

const TARGET_FILE = 'service-worker.js';  // 要更新的文件名
const EXCLUDED_FILES = ['service-worker.js', 'install.js']; // 排除的文件名
const EXCLUDED_DIRS = ['node_modules', 'pack_tool']; // 排除的文件夹
var rootPath = './dist';
// 扫描目录并获取符合条件的文件路径
async function scanDirectory(dir) {
    let urls = [];
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()&&!EXCLUDED_DIRS.includes(file.name)) {
            urls = urls.concat(await scanDirectory(fullPath));
        } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.webp')) && !EXCLUDED_FILES.includes(file.name)) {
            urls.push(path.relative(rootPath,fullPath));
        }
    }

    return urls;
}

// 更新 service-worker.js 文件中的 urlsToCache 数组
async function updateUrlsToCache(urls) {
    const filePath = path.join(rootPath, TARGET_FILE);
    let data = await fs.readFile(filePath, 'utf8');

    // 解析 urlsToCache 数组
    const updatedData = data.replace(/urlsToCache\s*=\s*\[.*?\]/s, `urlsToCache = ${JSON.stringify(urls, null, 2)}`);

    // 写回文件
    await fs.writeFile(filePath, updatedData, 'utf8');
    console.log('service-worker.js has been updated.');
}

// 主函数
async function updateCache() {
    try {
        const urls = await scanDirectory(rootPath);
        await updateUrlsToCache(urls);
    } catch (err) {
        console.error('Error:', err);
    }
}

module.exports = {
    updateCache,
    rootPath
  };

