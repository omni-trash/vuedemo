const fs = require('fs')
const path = require('path')

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "vueproject";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath  = path.join(baseFolder, `${certificateName}.key`);

var today = new Date();
process.env.VUE_APP_BUILD_DATE    = (new Date()).toISOString().slice(0, 10);
process.env.VUE_APP_BUILD_VERSION = `1.${today.getFullYear() % 100}.${today.getMonth() + 1}.${today.getDate()}`;

module.exports = {
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    productionSourceMap: false,
    devServer: {
        historyApiFallback: true,
        server: {
            type: 'https',
            options: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
        },
        port: 5002
    }
}
