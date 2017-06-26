/**
 * site.js
 * based on zepto.js
 *
 */

$(function () {
	/*----------  Toggle navbar and sidebar  ----------*/
	
	let navbar = $('#navbar');
	let toggleNavBtn = $('#toggle-nav');
	toggleNavBtn.tap(function () {
		navbar.toggleClass('active');
	});

	let sidebar = $('#sidebar');
	let toggleSidebarBtns = $('.toggle-sidebar');
	let body = $('body');
	toggleSidebarBtns.tap(function () {
		body.toggleClass('no-scroll');
		sidebar.toggleClass('active');
	});
});