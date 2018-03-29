# pnpm-package-group

## Requirements

* Node ≥ 8.9.0

## What is this for

To install packages from a hierarchical tree

## How to use

### Preparation

#### Install a node package manager

By default, `pnpm-package-group` uses [`pnpm`](https://github.com/pnpm/pnpm).
If you want to use another package manager, add option `--pnpm=<your-package-manager>` or setting environment variable `PNPM_PKG_GROUP=<your-package-manager>`.

#### Create a YAML file

File `file.yaml`:

```yaml
global:
  __struct: global
  __comment:
    All packages in this tree will be installed globally
  PackageManagers:
    NodePackageManager:
      - npm
      - pnpm
      - yarn
    ThisTool:
      - pnpm-package-group
flat:
  __struct: flat
  __comment:
    All packages in this tree will be installed locally
    in directory '__tree__/flat/__pkgs__/node_modules'
    regardless of branches
  MyDependencies:
    __comment: Packages that are used by this package
    ProductionDependencies:
      UtilityFunctions:
        - deepmerge
        - ramda
        - number-enum
      YAML:
        - js-yaml
      IO:
        - fs-force
        - get-stdin
    DevelopmentDependencies:
      - jest-cli
      - just-try
      - x-iterable
nested:
  __struct: nested
  __comment:
    Each package will be installed in their own folder
  React:
    ReactJS:
      - react
      - react-dom
    ReactNative:
      - react-native
```

### Usage

#### Copy & Paste YAML text

**Step 1:** Copy yaml text above

**Step 2:** Enter the following command

```sh
pnpm-package-group
```

**Step 3:** Paste and Close stdin (<kbd>Ctrl + D</kbd> on Linux/macOS/UNIX)

#### Specify file name

```sh
pnpm-package-group file.yaml
```

### Notes

#### Use another package manager

* `pnpm-package-group` invokes `pnpm` by default.
* You can force `pnpm-package-group` to use **`npm`** by either:
  * Adding option `--pnpm=npm`.
  * Setting environment variable `PNPM_PKG_GROUP` to `npm`.
* You can force `pnpm-package-group` to use **`yarn`** by either
  * Adding options `--pnpm=yarn --local-syntax='add {list}' --global-syntax='global add {list}'`.
  * Setting environment variables `PNPM_PKG_GROUP_LOCAL_SYNTAX` to `add {list}` and `PNPM_PKG_GROUP_GLOBAL_SYNTAX` to `global add {list}`.
