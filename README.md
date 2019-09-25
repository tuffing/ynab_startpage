# YNAB Startpage

A simple start page that shows the current budgeting progress in selected categories on YNAB. 

My challenge for this project was strictly no frameworks. 

Currently targeted at Firefox, and desktop / laptop screens. Eventually I'll test in Chrome / Webkit / tablets and look into a responsive option for mobiles. 

## Getting Started

Set your firefox/chrome configuration to make this your homepage and or start page. Either directly linking to https://tuffing.github.io/ynab_startpage/ or making a copy yourself and linking from there (recommended).

You'll need a [YNAB personal api key](https://api.youneedabudget.com/#personal-access-tokens)

First time you load the screen there will be nothing to show.

 1. Click on the cog in the top right corner
 2. In the Auth token box paste in your personal access token
 3. Next to budgets press 'Fetch'
 4. Your budgets will now appear (presuming the key was correct)
 5. Select a budget
 6. Next to Categories press 'Fetch'
 7. From the select box select the categories you want to show. Hold down shift to hold multiple
 8. When done either close the dialog box or refresh the page. Your categories should now fetch.

* The startpage will only update once an hour *

### Firefox new tab screen - using an extension

If you want to make this work on your new tab screen, the easiest method is to use an extension like https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/

Using an extension will work, but this will come at the expense of the address bar not being auto selected for you. This might get annoying quick, unfortunately this is currently not possible to get working while using an extension.

### Firefox new tab screen - using a custom config file

This method is a little more work. It comes with the advantage that when you create a new tab the address bar will be auto selected for you - just like with the default functionality.

The following instructions came from this thread https://support.mozilla.org/en-US/questions/1251199

Create two files:

 1. In your Firefox directory `autoconfig.cfg`
 2. In your firefox directory under defaults/pref `autoconfig.js`


In autoconfig.cfg place the following:
```
//
var {classes:Cc,interfaces:Ci,utils:Cu} = Components;
var newTabURL = "about:blank";
aboutNewTabService = Cc["@mozilla.org/browser/aboutnewtab-service;1"].getService(Ci.nsIAboutNewTabService);
aboutNewTabService.newTabURL = newTabURL;
```

In your autoconfig.js file place the following. This might not be needed, depending on your build:
```
//
pref("general.config.filename", "autoconfig.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
```

Restart 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

