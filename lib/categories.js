import fs from 'fs';
import path, { dirname } from 'path';


const categoriesDirectory = path.join(process.cwd(), 'posts')

function* getFilesGenerator(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFilesGenerator(res);
    } else {
      yield res;
    }
  }
}

function* getDirectoriesGenerator(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield res;
      yield* getDirectoriesGenerator(res);
    }
  }
}

function getFiles(dir) {
  const fileNames = [];
  for (const fileName of getFilesGenerator(dir)) {
    fileNames.push(fileName);
  }
  return fileNames;
}

function getDirectories(dir) {
  const dirNames = [];
  for (const dirName of getDirectoriesGenerator(dir)) {
    dirNames.push(dirName);
  }
  return dirNames;
}


function getSortedCategoriesData() {
  const dirNames = getDirectories(categoriesDirectory);
  const allCategoriesData = dirNames.map(dirName => {
    return {
    }
  })

  return allCategoriesData;
}

export function getAllCategorySlugs() {
  const dirNames = getDirectories(categoriesDirectory);
  dirNames.push('');

  return dirNames.map(dirName => {
    dirName = dirName.replace(new RegExp(`^${categoriesDirectory}/`), '');
    if (dirName === '') {
      return {
        params: {
          slug: []
        }
      }
    }
    return {
      params: {
        slug: dirName.split(path.sep)
      }
    };
  });
}

export function getCategoryData(slug) {
  let pathArray;
  if (slug === undefined) {
    slug = ['.'];
    pathArray = [];
  }
  else {
    pathArray = slug.slice(0);
  }
  pathArray.unshift('categories')

  const fullPath = path.join(categoriesDirectory, ...slug);
  const fileNames = fs.readdirSync(fullPath, { withFileTypes: true });
  let children = fileNames.map(fileName => {
    let name = fileName.name;
    let href = '';
    const isCategory = fileName.isDirectory();

    if (!isCategory) {
      name = name.replace(/\.md$/, '');
    }

    const hrefSuffix = isCategory ? '/categories' : '/posts';
    href = `${hrefSuffix}/${slug.join('/')}/${name}`

    return {
      name,
      href,
      isCategory
    }
  })

  return {
    pathArray,
    children
  }
}