const fs = require('fs-extra');
const path = require('path');

async function copyFiles(srcDir, destDir) {
  try {
    // 确保目标目录存在
    await fs.ensureDir(destDir);

    // 读取源目录中的所有文件和目录
    const items = await fs.readdir(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);

      // 获取文件或目录的状态
      const stat = await fs.stat(srcPath);

      if (stat.isDirectory()) {
        // 如果是目录，则递归复制
        await copyFiles(srcPath, destPath);
      } else {
        // 如果是文件，则直接复制
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log(`成功将文件从 ${srcDir} 复制到 ${destDir}`);
  } catch (err) {
    console.error('复制文件时发生错误:', err);
  }
}

module.exports = {
    copyFiles
  };
