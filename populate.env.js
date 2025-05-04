const fs = require('fs').promises;
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const dotenv = require('dotenv').config({path: 'src/.env'}); ;

const targetPath = path.join(__dirname, './src/environments/environment.ts'); 
const envConfigFile = `export const environment = {
    production: false,
    base_backend : {
        url : '${process.env.url}'
    },
    flutterwave: {
        publick_key: '${process.env.publick_key}'
    }
};
`;

async function setEnvVariables() {
     try {
          await fs.writeFile(targetPath, envConfigFile);
          console.log(successColor, `${checkSign} Successfully generated ${targetPath}`);
     } catch (error) {
          console.error(`Error writing environment variables to file: ${error}`);
     }
}

setEnvVariables();