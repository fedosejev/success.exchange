var program = require('commander');
var slug = require('slug');
var mkdirp = require('mkdirp');
var touch = require('touch');
var fs = require('fs');
var moment = require('moment');
var title;
var titleSlug;
var directoryPath;

var ENTRIES_NAME = 'books';
var ENTRY_NAME = 'book';

program
  .option('-t, --title [name]', 'Book title')
  .parse(process.argv);

if (program.title) {
  title = program.title;
  titleSlug = slug(title, { lower: true });
} else {
  console.error('Missing title. Use --title flag.');
  return;
}

directoryPath = './public/' + ENTRIES_NAME + '/' + titleSlug

mkdirp(directoryPath, function (error) {
  if (error) {
    console.log(error);
    return;
  }

  console.log('✓ Created ' + directoryPath);

  touch.sync(directoryPath + '/_content.md');

  console.log('✓ Created ' + directoryPath + '/_content.md');

  fs.writeFile(directoryPath + '/_data.json', createDataJson(ENTRY_NAME), function (error) {
    if (error) {
      console.log(error);
      return;
    }

    console.log('✓ Created ' + directoryPath + '/_data.json');

    copyIndexFile(directoryPath, ENTRIES_NAME);

    console.log('✓ Copied index.ejs');

    addEntrySlugToAListOfEntrySlugs(titleSlug, ENTRIES_NAME);

    console.log('✓ Added ' + titleSlug + ' to ./public/' + ENTRIES_NAME + '/_data.json');
  });

});

function createDataJson(entriesName) {
  var date = moment().format('YYYY/MM/DD');
  moment.locale('en');
  var dateString = moment().format('Do MMMM YYYY');

  var data = {
    index: {
      title: title,
      date: date,
      dateString: dateString,
      layout: '../_' + entriesName + '/_layout'
    }
  };

  return JSON.stringify(data, null, 2);
}

function copyIndexFile(toLocation, entriesName) {
  var FILE_NAME = 'index.ejs';
  var SOURCE_FILE = './templates/' + entriesName + '/' + FILE_NAME;
  fs.createReadStream(SOURCE_FILE).pipe(fs.createWriteStream(toLocation + '/' + FILE_NAME));
}

function addEntrySlugToAListOfEntrySlugs(entrySlug, entriesName) {
  var listOfEntries = JSON.parse(fs.readFileSync('./public/' + entriesName + '/_data.json', 'utf8'));

  if (listOfEntries[entriesName].indexOf(entrySlug) === -1) {
    listOfEntries[entriesName].push(entrySlug);
  }

  fs.writeFileSync('./public/' + entriesName + '/_data.json', JSON.stringify(listOfEntries, null, 2), 'utf-8', {'flags': 'w+'});
}
