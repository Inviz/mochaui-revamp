<?php

/*

Script: mocha.js.php
	Dynamically concatenate source javascript files during development.
	
Copyright:
	Copyright (c) 2007-2008 Greg Houston, <http://greghoustondesign.com/>.		
	
Note:
	This is not recommended for live sites since it does not cache, compress or gzip the outputted file. 	 

Use:
	In the source code, edit the files you wish to merge. By default all the javascript files in the source directory are merged. When your site is ready to go live, it is recommended that you take the output of this file, compress it and rename it "mocha.js".

Example:
	(start code)
	<script type="text/javascript" src="scripts/source/combine-javascript.php"></script>
	(end)

*/

// Array of files to merge
$files = array(
	'dev/mocha/scripts/source/Core/Core.js',
	'dev/mocha/scripts/source/Window/Window.js',
	'dev/mocha/scripts/source/Window/Modal.js',		
	'dev/mocha/scripts/source/Window/Windows-from-html.js',		
	'dev/mocha/scripts/source/Window/Windows-from-json.js',
	'dev/mocha/scripts/source/Window/Arrange-cascade.js',
	'dev/mocha/scripts/source/Window/Arrange-tile.js',	
	'dev/mocha/scripts/source/Desktop/Tabs.js',			
	'dev/mocha/scripts/source/Desktop/Desktop.js',	
	'dev/mocha/scripts/source/Desktop/Dock.js',
	'dev/mocha/scripts/source/Desktop/Workspaces.js'
);

// Get the path to your web directory
$docRoot = $_SERVER['DOCUMENT_ROOT'];

// Merge code
$code = '';
foreach ($files as $file) {
	$code .= file_get_contents("$docRoot/$file");
}

$filename = "mocha.js";	 

// Send HTTP headers
header("Cache-Control: must-revalidate");
header("Content-Type: text/javascript");
header('Content-Length: '.strlen($code));
header("Content-Disposition: inline; filename=$filename");	
   
// Output merged code
echo $code;

?>