"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
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
function parseIframe() {
    return __awaiter(this, void 0, void 0, function () {
        var cpus, patterns, _i, patterns_1, p, match, mostFrequent_1, url, res, html, doc, cpuLinks, scores, table, _a, scores_1, score, div;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log(document.location.href);
                    cpus = [];
                    patterns = [
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
                    for (_i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
                        p = patterns_1[_i];
                        match = document.body.textContent.match(p);
                        if (match) {
                            //dump('match', match);
                            if (match[1]) {
                                cpus.push(match[1]);
                            }
                        }
                    }
                    dump('cpus', cpus);
                    if (!cpus.length) return [3 /*break*/, 3];
                    mostFrequent_1 = mode(cpus);
                    console.log('mostFrequent', mostFrequent_1);
                    url = 'https://cors-anywhere.herokuapp.com/https://browser.geekbench.com/processor-benchmarks';
                    console.log(url);
                    return [4 /*yield*/, fetch(url, {
                            // mode: 'no-cors',
                            headers: {
                                'Origin': 'chrome_ebay_cpu',
                                'X-Requested-With': 'chrome_ebay_cpu',
                            }
                        })];
                case 1:
                    res = _b.sent();
                    dump('res headers', res.headers);
                    return [4 /*yield*/, res.text()];
                case 2:
                    html = _b.sent();
                    doc = new DOMParser().parseFromString(html, "text/html");
                    cpuLinks = doc.querySelectorAll('div.tab-pane:nth-child(2) td.name a');
                    scores = Array.from(cpuLinks).filter(function (a) {
                        return a.innerText.includes(mostFrequent_1);
                    }).map(function (a) {
                        return {
                            name: a.innerText.trim(),
                            score: a.parentElement.nextSibling.nextSibling.innerText,
                            link: a.getAttribute('href')
                        };
                    });
                    scores = scores.slice(0, 5); // not too much
                    dump('scores', scores);
                    table = '<table>';
                    for (_a = 0, scores_1 = scores; _a < scores_1.length; _a++) {
                        score = scores_1[_a];
                        table += "<tr>\n\t\t\t\t<td>\n\t\t\t\t\t<a href=\"https://browser.geekbench.com" + score.link + "\">" + score.name + "</a>\n\t\t\t\t</td>\n\t\t\t\t<td>" + score.score + "</td>\n\t\t\t</tr>";
                    }
                    table += '</table>';
                    div = document.createElement('div');
                    div.className = 'geekbench';
                    div.innerHTML = table;
                    document.body.appendChild(div);
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function mode(arr) {
    return arr.sort(function (a, b) {
        return arr.filter(function (v) { return v === a; }).length
            - arr.filter(function (v) { return v === b; }).length;
    }).pop();
}
function dump(name, aVar) {
    console.group(name);
    for (var index in aVar) {
        if (typeof aVar[index] != 'function') {
            console.log(index, typeof aVar[index], aVar[index]);
        }
    }
    console.groupEnd();
}
