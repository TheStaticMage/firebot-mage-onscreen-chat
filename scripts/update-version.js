/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/**
 *  Copies the built script .js to Firebot's scripts folder
 */
const fs = require('fs').promises;
const path = require('path');

const main = async () => {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    const version = packageJson.version;

    console.log(`Current version: ${version}`);

    const mainFilePath = path.resolve('./src/main.ts');

    const updateScriptVersion = async (filePath, version) => {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const updatedContent = fileContent.replace(
            /const scriptVersion = '.*?';/,
            `const scriptVersion = '${version}';`
        );
        await fs.writeFile(filePath, updatedContent, 'utf8');
    };

    await updateScriptVersion(mainFilePath, version);
    console.log(`Successfully updated the version in ${mainFilePath}.`);
};

main();
