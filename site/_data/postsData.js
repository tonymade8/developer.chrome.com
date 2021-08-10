const yaml = require('js-yaml');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const matter = require('gray-matter');

/** @type AuthorsData */
const authorsData = require('./authorsData.json');
const authorsYaml =
  /** @type I18nAuthors */ (
    /** @type TODO */ yaml.load(
      fs.readFileSync(path.join(__dirname, 'i18n', 'authors.yaml'), 'utf-8')
    )
  ) || {};

/** @type PostsData */
const postsData = {
  authors: {},
};

/**
 *
 * @param {string} authorKey
 * @param {FrontMatterData} fronMatter
 */
function addAuthorsPost(authorKey, fronMatter) {
  if (authorKey in postsData.authors) {
    postsData.authors[authorKey].elements.push(fronMatter);
  } else {
    postsData.authors[authorKey] = {
      ...authorsData[authorKey],
      description: `i18n.authors.${authorKey}.description`,
      elements: [fronMatter],
      key: authorKey,
      title: `i18n.authors.${authorKey}.title`,
      url: `/authors/${authorKey}/`,
    };
  }
}

glob('./site/[a-z][a-z]/{**/*,*}.md', {}, (er, files) => {
  if (er) {
    throw er;
  }

  /** @type FrontMatterData[] */
  const fileContents = files
    .map(file => {
      const filePath = path.join(process.cwd(), file);
      const fileData = fs.readFileSync(filePath, 'utf8');
      return matter(fileData).data;
    })
    .filter(f => f.date)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const fileContent of fileContents) {
    if (fileContent.authors) {
      for (const authorKey of fileContent.authors) {
        if (authorKey in authorsYaml) {
          addAuthorsPost(authorKey, fileContent);
        }
      }
    }
  }
});

module.exports = postsData;
