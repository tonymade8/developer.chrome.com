const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yamlFront = require('yaml-front-matter');

const postsData = {};

glob('./site/[a-z][a-z]/{**/*,*}.md', {}, (er, files) => {
  if (er) {
    throw er;
  }

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const frontMatter = yamlFront.loadFront(fileContents);
    delete frontMatter.__content;
    postsData[file] = frontMatter;
  }
});

module.exports = postsData;
