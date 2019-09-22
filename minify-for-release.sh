#!/bin/bash

echo "Merging and minifying js"
uglifyjs js/ynab_request.js js/ynab_config_manager.js js/ynab_categories_manager.js js/ynab_budgets_manager.js js/ynab_auth.js js/init.js -o minified/source.min.js --compress

echo "Minifying css"
uglifycss css/style.css --output minified/style.min.css 
