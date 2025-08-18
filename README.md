# Multi-Tools Hub

This is a web application that provides a collection of online tools.

## Structure

- `index.html`: The main page of the application.
- `manifest.json`: A list of all the tools available in the application.
- `css/`: Contains the stylesheets.
- `js/`: Contains the client-side Javascript code.
- `scripts/`: Contains the Node.js scripts for building the application.
- `templates/`: Contains the HTML templates for generating the tool pages.
- `tools/`: The output directory for the generated tool pages. This directory is in `.gitignore`.

## How to build

To generate the individual tool pages, you need to have Node.js installed.
Run the following command from the root of the repository:

```bash
node scripts/generate-tools.js
```

This will populate the `tools/` directory with the HTML files for each tool.
