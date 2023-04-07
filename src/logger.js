const fs = require('fs');
const path = require('path');

const errorDir = path.join(__dirname, '../logs/error');
const dataDir = path.join(__dirname, '../logs/uploadHistory.csv');

module.exports.init = () => {
	// If log files do not exist, create them.
	const logFolders = path.join(__dirname, '../logs/error');
	if (!fs.existsSync(logFolders)) fs.mkdirSync(logFolders, { recursive: true });

	if(!fs.existsSync(dataDir)) {
		fs.writeFileSync(dataDir, 'Date, File, Tweet ID\n');
	}
};

module.exports.error = (fileName, errType, err, data) => {
	const time = getTime();
	const filePath = path.join(errorDir, `${time.replace(' ', '_')}.txt`);
	fs.writeFileSync(filePath, `${time}\n${errType}\n\nFile name: ${fileName}\nError: ${err}\nData: ${data}`);
};

module.exports.data = (date, filename, id) => {
	if(!fs.existsSync(dataDir)) {
		fs.writeFileSync(dataDir, 'Date, File, Tweet ID\n');
	}
	fs.appendFileSync(dataDir, `${date},"${filename}",${id}\n`);
};

function getTime() {
	const date = new Date();
	return `${date.getMonth()}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}.${date.getMinutes()}`;
}