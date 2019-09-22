#!/bin/bash

echo "Merging and minifying js"
uglifyjs ynab_request.js ynab_config_manager.js ynab_categories_manager.js ynab_budgets_manager.js ynab_auth.js init.js -o minified/source.min.js --compress

echo "Minifying css"
uglifycss style.css --output minified/style.min.css 
