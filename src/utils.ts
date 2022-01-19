import fs from 'fs'
import path from 'path'
import * as messages from './messages'
import { workspace as Workspace, window as Window, QuickPickItem } from 'vscode'

// Explorer context menu command argument
export interface CommandArgument {
  fsPath: string
}

interface PackageJsonRoot {
  fsPath: string
  name: string
}

export async function pickPackageJson(): Promise<Readonly<string>> {
  // if active text editor is a package.json turn the path for it
  const editor = Window.activeTextEditor
  if (editor && editor.document.fileName.match('package.json')) {
    return editor.document.fileName
  }

  const workspaceFolders = Workspace.workspaceFolders

  if (workspaceFolders !== undefined) {
    // find if we have more than one workspace / multi root
    const nodeWorkspaces: PackageJsonRoot[] = []

    workspaceFolders.forEach((workspace) => {
      // get package json path for workspace folder
      const conf = Workspace.getConfiguration('pnpm', workspace)['packageJson']
      // look for root directory for package json
      const packageJson = path.join(workspace.uri.fsPath, conf)

      if (fs.existsSync(packageJson)) {
        nodeWorkspaces.push({ name: workspace.name, fsPath: packageJson })
      }
    })

    if (nodeWorkspaces.length > 1) {
      //if we have many show quick pick to identify the folder
      const items: QuickPickItem[] = nodeWorkspaces.map((workspace) => {
        return { label: workspace.name, description: workspace.fsPath }
      })
      const item = await Window.showQuickPick(items, { ignoreFocusOut: true, canPickMany: false })
      if (undefined === item) {
        messages.noValueError()
        return ''
      }
      return nodeWorkspaces.filter((w) => w.name === item.label)[0].fsPath
    } else if (nodeWorkspaces.length === 1) {
      return nodeWorkspaces[0].fsPath
    }
  }
  return ''
}

export function packageExists(packageJson: string) {
  try {
    const stat = fs.statSync(packageJson)
    return stat && stat.isFile()
  } catch (ignored) {
    return false
  }
}

export function useTerminal() {
  return Workspace.getConfiguration('pnpm')['runInTerminal']
}

export function getPnpmBin() {
  return Workspace.getConfiguration('pnpm')['bin'] || 'pnpm'
}

export function dontHideOutputOnSuccess() {
  return Workspace.getConfiguration('pnpm')['dontHideOutputOnSuccess']
}
