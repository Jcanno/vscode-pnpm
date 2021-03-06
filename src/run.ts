import fs from 'fs'
import { window as Window, QuickPickItem } from 'vscode'
import * as Messages from './messages'
import { runCommand } from './run-command'
import { pickPackageJson, packageExists } from './utils'

let lastScript: {
  packageJson: string
  script: string
}

export async function pnpmRunScript() {
  const packageJson = await pickPackageJson()
  if (!packageExists(packageJson)) {
    Messages.noPackageError()
    return
  }

  const scripts = readScripts(packageJson)
  if (!scripts) {
    return
  }

  const items: QuickPickItem[] = Object.keys(scripts).map((key) => {
    return { label: key, description: scripts[key] }
  })

  Window.showQuickPick(items).then((value) => {
    lastScript = {
      packageJson: packageJson,
      script: value.label,
    }
    runCommand(['run', value.label], packageJson)
  })
}

export async function pnpmTest() {
  const packageJson = await pickPackageJson()
  if (!packageExists(packageJson)) {
    Messages.noPackageError()
    return
  }

  const scripts = readScripts(packageJson)
  if (!scripts) {
    return
  }

  if (!scripts.test) {
    Messages.noTestScript()
    return
  }

  lastScript = {
    packageJson: packageJson,
    script: 'test',
  }
  runCommand(['run', 'test'], packageJson)
}

export async function pnpmStart() {
  const packageJson = await pickPackageJson()
  if (!packageExists(packageJson)) {
    Messages.noPackageError()
    return
  }

  const scripts = readScripts(packageJson)
  if (!scripts) {
    return
  }

  if (!scripts.start) {
    Messages.noStartScript()
    return
  }

  lastScript = {
    packageJson: packageJson,
    script: 'start',
  }
  runCommand(['run', 'start'], packageJson)
}

export async function pnpmBuild() {
  const packageJson = await pickPackageJson()
  if (!packageExists(packageJson)) {
    Messages.noPackageError()
    return
  }

  const scripts = readScripts(packageJson)
  if (!scripts) {
    return
  }

  if (!scripts.build) {
    Messages.noBuildScript()
    return
  }

  lastScript = {
    packageJson: packageJson,
    script: 'build',
  }
  runCommand(['run', 'build'], packageJson)
}

export async function pnpmRunLastScript() {
  if (lastScript) {
    const rootPath = lastScript.packageJson

    if (rootPath !== null && !packageExists(rootPath)) {
      Messages.noPackageError()
      return
    }

    runCommand(['run', lastScript.script], rootPath)
  } else {
    Messages.noLastScript()
  }
}

const readScripts = function (packgeJson: string) {
  try {
    const content = fs.readFileSync(packgeJson).toString()
    const json = JSON.parse(content)

    if (json.scripts) {
      return json.scripts
    }

    Messages.noScriptsInfo()
    return null
  } catch (ignored) {
    Messages.noPackageError()
    return null
  }
}
