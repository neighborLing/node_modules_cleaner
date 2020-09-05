const path = require('path');
const fs = require('fs');

function isNodeModules(filePath) {
  return /node_modules$/.test(filePath);
}

function isDirectory(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, {
      bigint: false,
    }, (err, stat) => {
      resolve(stat.isDirectory());
    })
  })
}

function removeDir(dir) {
  let files = fs.readdirSync(dir)
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let newPath = path.join(dir, file);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}

/**
 * @param {*} rootPath 开始路径
*/
async function node_modules_cleaner(rootPath) {
  // 路径下所有的文件
  const fileArr = fs.readdirSync(rootPath);
  for (let i = 0; i < fileArr.length; i++) {
    const file = fileArr[i];
    const filePath = path.resolve(`${rootPath}/${file}`);
    if (await isDirectory(filePath)) {
      if (isNodeModules(filePath)) {
        removeDir(filePath);
      } else {
        node_modules_cleaner(filePath);
      }
    }
  }
}

node_modules_cleaner(path.resolve(__dirname, '../'));