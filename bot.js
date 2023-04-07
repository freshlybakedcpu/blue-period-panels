const fs = require('fs');
const twit = require('twit');
const path = require('path');
const cron = require('node-cron');

const config = require('./config.js');
const logger = require('./src/logger.js');
const panelLister = require('./src/panelLister.js');

const Twitter = new twit(config);

console.log('Bot v3.0 running...\n');
logger.init();
panelLister.run();

function main() {
	// e.g. 1-1-49-1.jpg
	const fileRegex = /^[0-9]+-[0-9]+-([0-9]+|[0-9]+,[0-9]+)-[0-9]+(\.(jpe?g|png))$/;
	const imgList = fs.readdirSync(path.join(__dirname, '/panels')).filter(e => fileRegex.test(e));
	const fileName = imgList[Math.floor(Math.random() * imgList.length)];
	const b64image = fs.readFileSync(path.join(__dirname, '/panels', fileName), { encoding: 'base64' });

	// Panel information formatted in filename as volume-chapter-page-panel
	const info = fileName.replace(path.extname(fileName), '').split('-');

	Twitter.post('media/upload', { media_data: b64image }, function(err, data) {
		if (err) {
			logger.error(fileName, 'Error uploading', err, data);
			console.log('error:', err);
		} else {
			Twitter.post('statuses/update', {
				status: `Volume ${info[0]}, Chapter ${info[1]}, Page ${info[2].replace(',', ' and ')}`,
				media_ids: new Array(data.media_id_string),
			},
			function(err, tweetData) {
				console.log(tweetData);
				if (err) {
					logger.error(fileName, 'Error tweeting', err, tweetData);
					console.log('error:', err);
				} else {
					logger.data(getTime(), fileName, tweetData.id);
				}
			},
			);
		}
	});
}

// Run main script four times per day
cron.schedule('0 */4 * * *', () => {
	main();
});

// Update profile picture weekly
cron.schedule('0 0 * * 0', () => {
	panelLister.run();

	// Updating profile picture
	// e.g. BLPpanels-1-1-2,3-1.jpg
	const fileRegex = /^(BLPpanels)-[0-9]+-[0-9]+-([0-9]+|[0-9]+,[0-9]+)-[0-9]+(\.(jpe?g|png))/;
	const imgList = fs.readdirSync(path.join(__dirname, 'pfps')).filter(e => fileRegex.test(e));
	const imgName = imgList[Math.floor(Math.random() * imgList.length)];
	const b64image = fs.readFileSync(path.join(__dirname, 'pfps', imgName), { encoding: 'base64' });

	Twitter.post('account/update_profile_image', { image: b64image }, function(err) {
		if(err) {
			console.error(err);
		}
	});
});

function getTime() {
	const date = new Date();
	const hours = (date.getHours() % 12 === 0) ? 12 : date.getHours() % 12;
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const period = (date.getHours < 12) ? 'a.m.' : 'p.m.';
	return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${hours}:${minutes} ${period}`;
}