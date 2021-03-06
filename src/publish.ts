import { window as Window } from 'vscode'
import { packageExists, pickPackageJson } from './utils'
import * as Messages from './messages'
import { runCommand } from './run-command'

export function pnpmPublish() {
  _do('publish')
}

const _do = async function (cmd: string) {
  const packageJson = await pickPackageJson()
  if (!packageExists(packageJson)) {
    Messages.noPackageError()
    return
  }

  Window.showInputBox({
    prompt: 'Optional tag (enter to skip tag)',
    placeHolder: 'latest, 1.0.0, ...',
  }).then((value) => {
    if (!value) {
      runCommand([cmd], packageJson)
      return
    }

    if (value.includes(' ')) {
      Messages.invalidTagError()
      return
    }

    runCommand([cmd, '--tag', value], packageJson)
  })
}
