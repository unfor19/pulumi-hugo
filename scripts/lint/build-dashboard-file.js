const fs = require("fs");
const yaml = require("yaml");
const markdownlint = require("markdownlint");
const path = require("path");

/**
 * REGEX for grabbing the the front matter of a Hugo markdown file. Example:
 *
 *     ---
 *     ...props
 *     ---
 */
const AUTO_GENERATED_HEADING_REGEX = /###### Auto generated by ([a-z0-9]\w+)[/]([a-z0-9]\w+) on ([0-9]+)-([a-zA-z]\w+)-([0-9]\w+)/g;

/**
 * Validates if a title exists, has length, and does not have a length over 60 characters.
 * More info: https://moz.com/learn/seo/title-tag
 *
 * @param {string} title The title tag value for a given page.
 */
function getPageTitle(title) {
    if (!title) {
        return "Missing page title";
    } else if (typeof title === "string") {
        const titleLength = title.trim().length;
        if (titleLength === 0) {
            return "Page title is empty";
        } else if (titleLength > 60) {
            return "Page title exceeds 60 characters";
        }
    } else {
        return "Page title is not a valid string";
    }
    return title;
}

/**
 * Builds an array of markdown files to lint and checks each file's front matter
 * for formatting errors.
 *
 * @param {string[]} paths An array of paths to search for markdown files.
 * @param {Object} [result] The result object returned after finishing searching.
 * @returns {Object} The markdown file paths to search and an error object for the files front matter.
 */
function searchForMarkdown(paths, result) {
    
    if (!result) {
        result = {
            files: [],
            frontMatter: [],
        };
    }

    // Grab the first file in the list and generate
    // its full path.
    const file = paths[0];
    const fullPath = path.resolve(__dirname, file);

    // Check if the path is a directory
    const isDirectory = fs.statSync(fullPath).isDirectory();

    // Get the file suffix so we can grab the markdown files.
    const fileParts = file.split(".");
    const fileSuffix = fileParts[fileParts.length - 1];

    // Ignore auto generated docs.
    if (file.indexOf("/content/docs/reference/pkg") > -1) {
        const remaining = paths.slice(1, paths.length);
        return searchForMarkdown(remaining, result);
    }
    // If the path is a directory we want to add the contents of the directory
    // to the list.
    if (isDirectory) {
        const contents = fs.readdirSync(fullPath).map(function (file) {
            return fullPath + "/" + file;
        });
        paths[0] = contents;

        // Flatten the array.
        const newPaths = [].concat.apply([], paths);
        return searchForMarkdown(newPaths, result);
        // Else check if the file suffix is a markdown
        // and add it the resulting file list.
    }
    if (fileSuffix === "md") {
        try {
            // Read the file contents so we can grab the file header.
            const content = fs.readFileSync(fullPath, "utf8");

            const parsed = yaml.parseAllDocuments(content)[0].toJSON()

            // console.log(parsed);

            // Grab the file header.
            // const frontMatter = content.match(FRONT_MATTER_REGEX);

            const obj = parsed

            // Remove the dash blocks around the file header.
            // const fContent = frontMatter[0].split("---").join("");

            // Read the yaml.
            // const obj = yaml.load(fContent);

            // If the page is auto generated, a redirect, or not indexed do not parse the front matter.
            // const autoGenerated = obj.no_edit_this_page === true || content.match(AUTO_GENERATED_HEADING_REGEX);
            // const redirectPassthrough = typeof obj.redirect_to === "string";
            // const noIndex = obj.block_external_search_index === true;
            // const allowLongTitle = !!obj.allow_long_title;

            result.frontMatter.push(parsed);
            // result.files.push(fullPath);

            
        } catch (e) {
            // Include the error message in the front matter error object
            // so we can display it to the user.
            result.frontMatter[fullPath] = {
                error: e.message,
            };
            result.files.push(fullPath);
        }
    }

    // If there are remaining paths in the list, keep going.
    const remaining = paths.slice(1, paths.length);
    if (remaining.length > 0) {
        return searchForMarkdown(remaining, result);
    }
    return result;
}

/**
 * Builds an array of markdown files to search through from a
 * given path.
 *
 * @param {string} parentPath The path to search for markdown files
 */
function getMarkdownFiles(parentPath) {
    const fullParentPath = path.resolve(__dirname, parentPath);
    const dirs = fs.readdirSync(fullParentPath).map(function (dir) {
        return path.join(parentPath, dir);
    });

    return searchForMarkdown(dirs);
}

const output = getMarkdownFiles(`../../themes/default/content/resources`).frontMatter.map(f => {
    return {
        title: f.title,
        date: f.main ? f.main.sortable_date :  null,
        url: f.url_slug,
        type: f.type,
    }
}).sort((a,b) => {
    if (a.date < b.date) {
        return 1;
    }
    if (a.date > b.date) {
        return -1;
    }
    return 0;
}).filter(f => {
    return f.date > new Date().toISOString() && f.type === 'webinars'
})

console.log(output);