chrome.extension.sendMessage({}, function (response: any) {
	const readyStateCheckInterval = setInterval(function () {
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
		/Core (\S+)/,
		/Core 2 Duo (\S+)/,
		/Core 2 Quad (\S+)/,
		/Xeon (\S+)/,
		/Xeon Gold (\S+)/,
		/Xeon Silver (\S+)/,
		/Atom (\S+)/,
		/Celeron (\S+)/,
		/Pentium (\S+)/,
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
	dump('cpus', cpus);

	if (cpus.length) {
		const mostFrequent = mode(cpus);
		console.log('mostFrequent', mostFrequent);

		// let url = 'https://cors-anywhere.herokuapp.com/https://browser.geekbench.com/v4/cpu/search?dir=desc&sort=multicore_score&q=' + mostFrequent;
		let url = 'https://cors-anywhere.herokuapp.com/https://browser.geekbench.com/processor-benchmarks';
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
		//console.log('html', html);
		const doc = new DOMParser().parseFromString(html, "text/html");
		//console.log(doc);
		const cpuLinks = doc.querySelectorAll('div.tab-pane:nth-child(2) td.name a') as NodeListOf<HTMLAnchorElement>;
		//dump('cpuLinks', cpuLinks);
		const scores = Array.from(cpuLinks).filter(a => {
			return a.innerText.includes(mostFrequent);
		}).map(a => {
			return {
				name: a.innerText.trim(),
				score: a.parentElement.nextSibling.nextSibling.innerText,
				link: a.getAttribute('href')
			}
		});
		scores = scores.slice(0, 5);	// not too much
		dump('scores', scores);

		let table = '<table>';
		for (const score of scores) {
			table += `<tr>
				<td>
					<a href="https://browser.geekbench.com${score.link}">${score.name}</a>
				</td>
				<td>${score.score}</td>
			</tr>`;
		}
		table += '</table>';
		const div = document.createElement('div');
		div.className = 'geekbench';
		div.innerHTML = table;
		document.body.appendChild(div);
	}
}

// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function mode(arr: Array<any>) {
	return arr.sort((a, b) =>
		arr.filter(v => v === a).length
		- arr.filter(v => v === b).length
	).pop();
}

function dump(name: string, aVar: any) {
	console.group(name);
	for (const index in aVar) {
		if (typeof aVar[index] != 'function') {
			console.log(index, typeof aVar[index], aVar[index]);
		}
	}
	console.groupEnd();
}
