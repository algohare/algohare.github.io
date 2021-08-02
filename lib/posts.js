import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
const rslug = require('remark-slug');
const headings = require('remark-autolink-headings');
const highlight = require('remark-highlight.js')

import math from 'remark-math'
import remark2rehype from 'remark-rehype'
import katex from 'rehype-katex'
const stringify = require('rehype-stringify')



import utilStyles from '../styles/utils.module.scss';
import moment from 'moment';

const postsDirectory = path.join(process.cwd(), 'posts');

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

function getFiles(dir) {
  const fileNames = [];
  for (const fileName of getFilesGenerator(dir)) {
    fileNames.push(fileName);
  }
  return fileNames;
}

export function getSortedPostsData() {
  // Get file Names under /posts
  const fileNames = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const allPostsData = fileNames.filter(fileName => {
    return !fileName.isDirectory();
  }).map(fileName => {
    return fileName.name;
  }).
  map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdwon file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    }
    else if (a > b) {
      return -1;
    }
    else {
      return 0;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = getFiles(postsDirectory);

  return fileNames.map(fileName => {
    fileName = fileName.replace(new RegExp(`^${postsDirectory}/`), '');
    fileName = fileName.replace(/\.md$/, '');
    return {
      params: {
        slug: fileName.split(path.sep)
      }
    };
  })
}

const _getPostDataArray = async (slug) => {
  const fullPathCategory = path.join(postsDirectory, ...slug);

  let fileNames = fs.readdirSync(fullPathCategory, {withFileTypes: true});
  fileNames = fileNames.filter(x => !x.isDirectory());
  return await Promise.all(fileNames.map(async fileName => {
    const name = fileName.name.replace(/\.md$/, '');
    const postData = await _getPostData(slug.concat(name))
    return Object.assign(postData, {href: ['/posts', ...slug, name].join(path.sep)})
  }));
};

const _getPostData = async (slug) => {
  const fullPath = path.join(postsDirectory, ...slug.slice(0, -1), slug[slug.length-1]+'.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(rslug)
    .use(headings, {
      'behavior': 'append',
      'content': {
          type: 'element',
          tagName: 'span',
          properties: {className: ['icon', 'icon-link', utilStyles.iconlink]},
        }
    })
    .use(html)
    .use(highlight)
    .use(math)
    .use(remark2rehype)
    .use(katex)
    .use(stringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...matterResult.data,
  }
}

export async function getPostData(slug) {
  const postDataArray = await _getPostDataArray(slug.slice(0, -1));
  const sortedPostDataArray = postDataArray.sort((lhs, rhs) => {
    const ldate = moment(lhs.date);
    const rdate = moment(rhs.date);
    if (ldate < rdate) return 1;
    else if (ldate === rdate) return 0
    else return -1;
  });

  let postData = await _getPostData(slug);

  let titleArray = ['categories'].concat(slug.slice(0, -1));
  titleArray = titleArray.map((item, index) => {
    return {
      title: item,
      href: '/' + path.join(...titleArray.slice(0, index+1))
    }
  });

  Object.assign(postData,
    {
      categoryData: {
        titleArray,
        sortedPostDataArray,
        activeIndex: sortedPostDataArray.findIndex(x => x.slug[x.slug.length-1] === slug[slug.length-1])
      }
    });
  return postData;
}