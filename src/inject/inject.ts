chrome.extension.sendMessage({}, function(response) {
	const readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		setTimeout(parseIframe, 2000);
		// ----------------------------------------------------------
	}
	}, 100);
});

async function parseIframe() {
	console.log(document.location.href);
	let cpus = [];

	let patterns = [
		/Intel Core i.-(\w+)/,
	];
	for (let p of patterns) {
		let match = document.body.textContent.match(p);
		if (match) {
			//dump('match', match);
			if (match[1]) {
				cpus.push(match[1]);
			}
		}
	}
	// dump('cpus', cpus);

	if (cpus.length) {
		const mostFrequent = mode(cpus);
		console.log('mostFrequent', mostFrequent);

		let url = 'https://cors-anywhere.herokuapp.com/https://browser.geekbench.com/v4/cpu/search?dir=desc&sort=multicore_score&q=' + mostFrequent;
		console.log(url);
		const res = await fetch(url, {
			// mode: 'no-cors',
			headers: {
				'Origin': 'chrome_ebay_cpu',
				'X-Requested-With': 'chrome_ebay_cpu',
			}
		});
		dump('res headers', res.headers);
		const html = await res.text();
		console.log('html', html);
	}
}

// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function mode(arr){
	return arr.sort((a,b) =>
		arr.filter(v => v===a).length
		- arr.filter(v => v===b).length
	).pop();
}

function dump(name, aVar) {
	console.group(name);
	for (const index in aVar) {
		if (typeof aVar[index] != 'function') {
			console.log(index, typeof aVar[index], aVar[index]);
		}
	}
	console.groupEnd();
}
