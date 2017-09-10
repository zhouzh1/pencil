/**
 * site.js
 * based on zepto.js
 */

$(function () {
	hljs.initHighlightingOnLoad();
	// toggle navbar
	let navbar = $('#navbar').get(0);
	let navbarHeight = navbar.scrollHeight;
	let toggleNavBtn = $('#toggle-nav');
	toggleNavBtn.on('touchend', function() {
		let height = navbar.offsetHeight;
		if (height == 0) {
			navbar.style.height = navbarHeight + 'px';
		}
		else if (height == navbarHeight) {
			navbar.style.height = 0;
		}
	});

	// toggle sidebar
	let sidebar = $('#sidebar');
	let toggleSidebarBtns = $('.toggle-sidebar');
	let body = $('body');
	toggleSidebarBtns.on('touchend', function () {
		body.toggleClass('no-scroll');
		sidebar.toggleClass('active');
	});
});