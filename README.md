<p align="center">
  <img src="https://raw.githubusercontent.com/Jcanno/vscode-pnpm/master/pnpm.png?raw=true" alt="vscode-pnpm: VSCode extensions to manage pnpm commands." width="150">
  <br>
</p>
<p align="center">VSCode-Pnpm: VSCode extensions to manage pnpm commands.</p>

## Features

### Commands

- `pnpm init`
- `pnpm install`
- `pnpm add`
- `pnpm add --dev`
- `pnpm remove <pkg>`
- `pnpm start`
- `pnpm test`
- `pnpm build`
- `pnpm publish [tag]`
- `pnpm run <script>`

### Explorer context menu

`pnpm install` also available in the `package.json` file's explorer context menu.

### TouchBar support

Support for Macbook Pro Touch Bar. Following pnpm commands are available:

- pnpm install
- pnpm start
- pnpm test
- pnpm build

### Run last executed script

You can also run the last executed script by typing `pnpm run last...`.

### Terminate a script

You can terminate a script with the `terminate` command. It uses the `tree-kill` module that you can find on `pnpm`.
It has different behaviors on Unix or Windows.
