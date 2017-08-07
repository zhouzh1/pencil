/**
 * plugin: tagcloud
 * function: change font-size(unit: em) of tag text according to count of tag's articles
 * author: zhouzh1
 */

function tagcloud(config, articles, pages, tags, categories, archives, pageLinks) {
	let tagsCount = Object.keys(tags).length;
	// if not exist any tags, return null
	if (tagsCount > 0) {
		let smallest = 0.5;
		let normal = 1;
		let biggest = 2;
		// calculate count of articles which were attached some tags
		let total = 0;
		for (let tag in tags) {
			total += tags[tag].length;
		}
		let average = Math.floor(total / tagsCount);
		let htmlBlock = '<div class="tag-cloud">';
		for (let tag in tags) {
			let count = tags[tag].length;
			// calculate font-size of tag text
			let fontSize = normal * (count / average);
			if (fontSize < smallest) {
				fontSize = smallest;
			}
			if (fontSize > biggest) {
				fontSize = biggest;
			}
			let link = `<a href="/tag/${tag}" class="tag-link" style="font-size: ${fontSize}em">${tag}</a>`;
			htmlBlock += link;
		}
		htmlBlock += '</div>';
		return htmlBlock;
	}
	else {
		return null;
	}
}

module.exports = tagcloud;				