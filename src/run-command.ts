import { ChildProcess, exec } from 'child_process'
import { window as Window, Terminal } from 'vscode'
import { outputChannel } from './output'
import { runInTerminal, Options } from 'run-in-terminal'
import { useTerminal, getPnpmBin, dontHideOutputOnSuccess } from './utils'
import kill from 'tree-kill'

export let terminal: Terminal = null

export interface ChildCommand {
  child: ChildProcess
  cmd: string
  killedByUs?: boolean
}

export const childs: Map<number, ChildCommand> = new Map()

export function terminate(pid: number) {
  const childCommand = childs.get(pid)
  if (childCommand && childCommand.child) {
    outputChannel.appendLine('')
    outputChannel.appendLine(`Killing process: ${childCommand.cmd} (pid:${pid})`)
    outputChannel.appendLine('')
    childCommand.killedByUs = true
    kill(pid, 'SIGTERM')
  }
}

export function runCommand(args: string[], packageJson: string) {
  const cwd = packageJson.replace(/package.json$/i, '')

  const options = {
    cwd: cwd,
    env: process.env,
  }

  if (useTerminal()) {
    if (typeof Window.createTerminal === 'function') {
      runCommandInIntegratedTerminal(args, cwd)
    } else {
      runCommandInTerminal(args, options)
    }
  } else {
    runCommandInOutputWindow(args, cwd)
  }
}

function runCommandInTerminal(args: string[], options?: Options): void {
  runInTerminal(getPnpmBin(), args, options)
}

function runCommandInIntegratedTerminal(args: string[], cwd: string): void {
  const cmdArgs = Array.from(args)
  if (!terminal || terminal.exitStatus) {
    terminal = Window.createTerminal('Pnpm')
  }
  terminal.show(true)
  if (cwd) {
    // Replace single backslash with double backslash.
    const textCwd = cwd.replace(/\\/g, '\\\\')
    terminal.sendText(['cd', `"${textCwd}"`].join(' '))
  }
  cmdArgs.splice(0, 0, getPnpmBin())
  terminal.sendText(cmdArgs.join(' '))
}

function runCommandInOutputWindow(args: string[], cwd: string) {
  const cmd = getPnpmBin() + ' ' + args.join(' ')

  const child = exec(cmd, { cwd: cwd, env: process.env })

  if (child) {
    childs.set(child.pid, { child: child, cmd: cmd })

    child.on('exit', (code, signal) => {
      if (signal === 'SIGTERM' || childs.get(child.pid).killedByUs) {
        outputChannel.appendLine('')
        outputChannel.appendLine('Successfully killed process')
        outputChannel.appendLine('')
        outputChannel.appendLine('--------------------')
        outputChannel.appendLine('')
      }

      if (code === 0) {
        outputChannel.appendLine('')
        outputChannel.appendLine('--------------------')
        outputChannel.appendLine('')
        if (!dontHideOutputOnSuccess()) {
          outputChannel.hide()
        }
      }

      childs.delete(child.pid)
    })

    outputChannel.appendLine(cmd)
    outputChannel.appendLine('')

    const append = function (data: string) {
      outputChannel.append(data)
    }

    child.stderr.on('data', append)
    child.stdout.on('data', append)
    outputChannel.show(true)
  }
}
