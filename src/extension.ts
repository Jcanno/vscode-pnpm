import { commands as Commands, ExtensionContext } from 'vscode'
import { pnpmInstallPackages } from './install'
import { terminal } from './run-command'
import { outputChannel } from './output'
import { pnpmAddPackages, pnpmAddPackage, pnpmAddPackageDev } from './add'
import { pnpmRunScript, pnpmBuild, pnpmRunLastScript, pnpmStart, pnpmTest } from './run'

export const activate = function (context: ExtensionContext) {
  const disposables = [
    Commands.registerCommand('pnpm-script.installPackages', pnpmInstallPackages),
    Commands.registerCommand('pnpm-script.addPackages', pnpmAddPackages),
    Commands.registerCommand('pnpm-script.addPackage', pnpmAddPackage),
    Commands.registerCommand('pnpm-script.addPackageDev', pnpmAddPackageDev),
    Commands.registerCommand('pnpm-script.runScript', pnpmRunScript),
    Commands.registerCommand('pnpm-script.build', pnpmBuild),
    Commands.registerCommand('pnpm-script.runScriptLast', pnpmRunLastScript),
    Commands.registerCommand('pnpm-script.test', pnpmTest),
    Commands.registerCommand('pnpm-script.start', pnpmStart),
    // Commands.registerCommand('pnpm-script.init', pnpmInit),
    // Commands.registerCommand('pnpm-script.outdated', pnpmOutdated),
    // Commands.registerCommand('pnpm-script.removePackage', pnpmRemovePackage),
    // Commands.registerCommand('pnpm-script.publish', pnpmPublish),
    // Commands.registerCommand('pnpm-script.raw', pnpmRawCommand),
    // Commands.registerCommand('pnpm-script.terminate', pnpmTerminate),
  ]

  context.subscriptions.push(...disposables, outputChannel)
}

export function deactivate() {
  if (terminal) {
    terminal.dispose()
  }
}
