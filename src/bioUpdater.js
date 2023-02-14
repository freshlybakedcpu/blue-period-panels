const got = require('got');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

const config = require('../config.js');

module.exports.run = (totalPanels) => {
	const consumer_key = config.consumer_key;
	const consumer_secret = config.consumer_secret;

	const bio = 'Posts random panels from Tsubasa Yamaguchi\'s manga "Blue Period" four times per day.'
				+ ' ' + `Currently running with ${totalPanels} panels.`;

	const endpointURL = `https://api.twitter.com/1.1/account/update_profile.json?username=BLPpanels&description=${encodeURIComponent(bio)}`;

	const oauth = OAuth({
		consumer: {
			key: consumer_key,
			secret: consumer_secret,
		},
		signature_method: 'HMAC-SHA1',
		hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
	});

	async function postRequest() {
		const token = {
			key: config.access_token,
			secret: config.access_token_secret,
		};

		const authHeader = oauth.toHeader(oauth.authorize({
			url: endpointURL,
			method: 'POST',
		}, token));

		const req = await got.post(endpointURL, {
			responseType: 'json',
			headers: {
				Authorization: authHeader['Authorization'],
			},
		});

		if (req.body) {
			return req.body;
		} else {
			throw new Error('Unsuccessful request');
		}
	}

	(async () => {
		try {
			const response = await postRequest();
			console.dir(response, {
				depth: null,
			});
		} catch (e) {
			console.log(e);
		}
	})();

};