[:var_set('', """
# Compile command
aoikdyndocdsl -s README.src.md -g README.md
""")]\
[:HDLR('heading', 'heading')]\
# AoikAntDesignReactStarter
Ant Design React starter kit.

## Table of Contents
[:toc(beg='next', indent=-1)]

## Setup
Run:
```
yarn install
```

## Usage

### Develop
Run:
```
yarn run dev

yarn run dev:mock
```

### Lint
Run:
```
yarn run tsc

yarn run eslint

yarn run eslint:fix

yarn run stylelint

yarn run stylelint:fix
```

### Build
Run:
```
yarn run build

yarn run build:analyze
```
