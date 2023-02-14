# blue-period-panels
Entry point: `bot.js`

### A few components are missing for security concerns and storage limitations:  
##### Create the directories `panels` and `pfps`.  
Files in `panels` follow the naming convention `${Volume}-${Chapter}-${Page(s)}-${Panel}.jpg`  
e.g. 1-1-22-1.jpg, 2-6-86,87-1.png.  
  
Files in `pfps` follow a similar naming convention, simply preceded by `BLPpanels`  
e.g. BLPpanels-1-1-2,3-1.jpg, BLPpanels-9-34-3,4-6.jpg  
  
##### Create the file `config.js` in the main directory with the following contents:
```
module.exports = {
	consumer_key: 'CONSUMER_KEY_HERE',
	consumer_secret: 'SECRET_CONSUMER_KEY_HERE',
	access_token: 'ACCESS_TOKEN_HERE',
	access_token_secret: 'SECRET_ACCESS_TOKEN_HERE',
};
```
