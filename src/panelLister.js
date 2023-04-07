const fs = require('fs');
const path = require('path');

const bioUpdater = require('./bioUpdater.js');

const panelDir = path.join(__dirname, '../panels');
const fileRegex = /^[0-9]+-[0-9]+-([0-9]+|[0-9]+,[0-9]+)-[0-9]+(\.(jpe?g|png))$/;

module.exports.run = () => {
	if (!fs.existsSync(panelDir)) return;

	let imgList = fs.readdirSync(panelDir).filter(e => fileRegex.test(e));
	imgList = imgList.map(e => e.replace(path.extname(e), '').split('-'));

	imgList.forEach(panel => {
		panel.forEach((e, i, a) => {
			if(i === 2) {
				a[i] = e.split(',').map(page => parseInt(page));
				return;
			}
			a[i] = parseInt(e);
		});
	});

	imgList.sort(function(a, b) {
		for(let i = 0; i < imgList[0].length; i++) {
			let c0 = a[i], c1 = b[i];
			if(Array.isArray(a[i])) c0 = a[i][0];
			if(Array.isArray(b[i])) c1 = b[i][0];

			if(c0 > c1) return 1; // b sorted before a
			if(c0 < c1) return -1; // a sorted before b
		}
		return 0;
	});

	console.log(imgList);

	const listDir = path.join(__dirname, '../docs/index.md');

	if(!fs.existsSync(listDir)) {
		fs.writeFileSync(listDir, '');
	} else {
		fs.truncateSync(listDir, 0);
	}

	fs.appendFileSync(listDir, `# Total: ${imgList.length}\n`);
	fs.appendFileSync(listDir, '```');

	let currentVolume = -1;
	let currentChapter = -1;
	let currentPage = -1;
	imgList.forEach((e, i, a) => {
		if(e[0] > currentVolume) {
			fs.appendFileSync(listDir, `Volume ${e[0]}\n`);
			currentVolume = e[0];
			currentChapter = -1;
		}
		if(e[1] > currentChapter) {
			fs.appendFileSync(listDir, `\tChapter ${e[1]}\n`);
			currentChapter = e[1];
			currentPage = -1;
		}
		if(e[2][0] > currentPage) {
			fs.appendFileSync(listDir, `\t\tPage ${e[2]}: `);
			currentPage = e[2][0];
		}
		if (i + 1 >= a.length) {
			fs.appendFileSync(listDir, `${e[3]}  \n`);
		} else if(a[i + 1][1] > currentChapter || a[i + 1][2][0] > currentPage) {
			fs.appendFileSync(listDir, `${e[3]}  \n`);
		}
	});
	fs.appendFileSync(listDir, '```');
	// Updates Twitter bio with the current number of panels
	bioUpdater.run(numberWithCommas(imgList.length));
};

function numberWithCommas(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}