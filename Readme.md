# pxtorem-css

### A nodejs cli that convert px to rem in any css file

<br>

## Description
Convert px to rem in css with advanced functionality. pxtorem helps you reduce time when you write css code. This tool build with pure nodejs.

Features:

* You can convert px to rem in css anywhere within a second.
* You can choose css directory and also output directory.
* You can include and exclude css file when convert
* Even you can ignore css attribute not to convert
* You can customize options with pxtorem.config.json in your project


## Installation

Locally:
```bash
npm i pxtorem-css
```

Globally:
```bash
npm i -g pxtorem-css
```

## Usage
```bash
$ pxtorem [options]

Options:
  -init,--init [type]       Init pxtorem options json (preset: "pxtorem.config.json")
  -s, --size [type]         Select html size (default: "16", preset: "16")
  -d, --dir [type...]       Select css directory (default: ["/"], preset: "/")
  -t, --type [type]         Select css ext type example: .scss (default: ".css", preset: ".css")
  -i, --ignore [type...]    Ignore css attribute (default: [], preset: [])
  -r, --replace [type]      For replace file name (default: false, preset: false)
  -o, --output [type]       Output directory (default: "", preset: "")
  -in, --include [type...]  For include css file path (default: [], preset: [])
  -ex, --exclude [type...]  For exclue css file path (default: [], preset: [])
  -c, --config [type]       For json config file (default: "", preset: "")
  -h, --help                display help for command

```

### Example
`$ pxtorem` : change all directories css file. <br>

`$ pxtorem -d public/css` : change all css file inside public/css dir.<br>

`$ pxtorem -d public/css -t .scss` : change all .scss extname file inside public/css dir.<br>

`$ pxtorem -d public/css -t .scss -o public/remcss` : change all .scss extname file inside public/css dir and write file to public/remcss dir.<br>

`$ pxtorem -d public/css -i box-shadow margin-left padding-left` : change all css file inside public/css dir except box-shadow margin-left padding-left attribute px.<br>

`$ pxtorem -d public/css -r my/name/rem/.ext` : change all css filename example: style.css to mystylerem.css<br>

`$ pxtorem -c pxtorem.json` : Customize your options with json file in your project folder<br>

`$ pxtorem -init` : generate pxtorem.config.json (or you can give custom name) into your project folder<br>

### pxtorem.json Example
```bash
{
    "size": "16",
    "dir": ["public/css"],
    "type": ".css",
    "ignore": ["margin", "padding", "box-shadow"],
    "replace": "{your custom word}/name/{your custom word}/.ext",
    "output": "",
    "include": [],
    "exclude": []
}
```

## Contribution
If you want to contribute or report any bug, you welcome

<br>
Don't forget to give a star 😍