
## require-template

Browserify transform used to require html template in js file.

## Install

```
npm install --save-dev require-template
```

## Usage

### 1.inlcude html template in one html file

`src/template/index.html`


	<div>This is is the application html template </div>

	
`src/script/app.js`


	var appTpl = require('../template/index.html');
	
	$('body').append(appTmpl);

### 2.include different html templates in one html file

`src/template/page.html`

	<-- #header-->
	<header>This is the page header</header>

	<-- #content-->
	<section class="content">This is the page header</header>
	
	<-- #footer-->
	<footer>This is the page header</footer>	
	
`src/script/header.js`


	var headerTpl = require('../template/page.html').header;
	
	module.exports = function render(root){
		$(root).append(headerTpl);
	}
	
`src/script/content.js`


	var contentTpl = require('../template/page.html').content;
	
	module.exports = function render(root){
		$(root).append(contentTpl);
	}
	
`src/script/footer`


	var footerTpl = require('../template/page.html').footer;
	
	module.exports = function render(root){
		$(root).append(footerTpl);
	}

	
`src/script/app.js`


	var renderHeader = require('./header.js');
	var renderFooter = require('./footer.js');
	var renderContent = require('./content.js');		
	
	var $root = $('<div class="application"></div>');
	renderHeader($root);
	renderContent($root);
	renderFooter($root);		
	
The devider of the templates in one file is in the following format :

	<-- #templateIdName -->

the **templateIdName** is the reference of the template.

### 3. dynamic render with template 

For exmplae , using `_.template()` with underscore.js

`src/template/index.html`

	<div><%=output%></div>

`scr/script/app.js`	

	var tpl = require('./template/index.html');
	
	var compiler = _.template(tpl);
	var data = {
	           	   output:'Hello Wrold'
	           };
	var result = compiler(data)	;
	
	$('body').append(result);


				