Array.from(document.querySelectorAll('div.tab-pane:nth-child(2) td.name a')).map((a) => {
	return {
		name: a.innerText.trim(),
		score: a.parentElement.nextSibling.nextSibling.innerText,
		link: a.getAttribute('href')
	}
});

// search
Array.from(document.querySelectorAll('div.tab-pane:nth-child(2) td.name a')).filter(a => {
	return a.innerText.includes('i5-7260U');
}).map(a => {
	return {
		name: a.innerText.trim(),
		score: a.parentElement.nextSibling.nextSibling.innerText,
		link: a.getAttribute('href')
	}
});
