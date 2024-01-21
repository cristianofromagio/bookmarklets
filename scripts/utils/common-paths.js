/**
 * refs:
 *  - https://github.com/PlasmoHQ/plasmo/blob/main/cli/plasmo/src/features/extension-devtools/common-path.ts
 */

const
  { existsSync } = require("fs"),
  { resolve } = require("path"),
  { cwd } = require("process");

module.exports = {
  getCommonPath: (
    currentDirectory = cwd()
  ) => {
    const srcPath = resolve(currentDirectory, "src")

    return {
      currentDirectory,
      rootDirectory: currentDirectory,
      sourceDirectory: existsSync(srcPath) ? srcPath : currentDirectory,
      packageFilePath: resolve(currentDirectory, "package.json"),

      buildDirectory: resolve(currentDirectory, "dist"),
    }
  }
}
