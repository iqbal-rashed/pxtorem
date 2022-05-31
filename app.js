const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

function getListOfFile(dir, type, fileList) {
    let files = fs.readdirSync(dir);
    fileList = fileList || [];
    files.forEach((f) => {
        if (!f.startsWith(".")) {
            let filePath = path.join(dir, f);
            if (fs.statSync(filePath).isDirectory()) {
                fileList = getListOfFile(filePath, type, fileList);
            } else {
                if (f.endsWith(type)) {
                    fileList.push(filePath);
                }
            }
        }
    });
    return fileList;
}

function pxtorem(
    { size, dir, type, ignore, replace, output, include, exclude },
    spinner
) {
    let finalArr = [];
    dir.forEach((v) => {
        const finalDir = path.join(process.cwd(), v);
        finalArr = finalArr.concat(getListOfFile(finalDir, type));
    });
    let finalPathArr = finalArr.map((v) => path.resolve(v)) || [];

    if (include.length > 0) {
        include.forEach((v) => {
            if (finalPathArr.indexOf(v) === -1) {
                finalPathArr.push(v);
            }
        });
    }

    if (exclude.length > 0) {
        exclude.forEach((v) => {
            if (finalPathArr.indexOf(v) !== -1) {
                finalPathArr.splice(finalPathArr.indexOf(v), 1);
            }
        });
    }
    if (finalPathArr.length === 0) {
        spinner.fail(chalk.red("At the end no css file found"));
        process.exit(1);
    }
    finalPathArr.forEach((v) => {
        try {
            let fileName = path.basename(v);
            if (replace) {
                fileName = fileName.replace(
                    new RegExp(path.extname(v), "g"),
                    ""
                );
                fileName = replace.replace(new RegExp("/name/", "g"), fileName);

                fileName = fileName.replace(
                    new RegExp("/.ext", "g"),
                    path.extname(v)
                );
                console.log(fileName);
            }
            const readFileData = fs.readFileSync(v, "utf-8");
            if (!readFileData) {
                throw new Error("Css file empty");
            }
            if (!size) {
                throw new Error("Html size not valid");
            }
            const changeData = changePxToRem(readFileData, size, ignore);
            if (output) {
                const destination = path.join(output, fileName);

                fs.writeFileSync(destination, changeData, {
                    encoding: "utf-8",
                    flag: "w",
                });
            } else {
                fs.writeFileSync(v, changeData, {
                    encoding: "utf-8",
                    flag: "w",
                });
            }
        } catch (error) {
            spinner.fail(chalk.red("Something went wrong", error.message));
        }
    });
}

function changePxToRem(data, size, ignore) {
    const myRegex = /[-]?([a-z]*[-])?[a-z]*?\:.*?.*?px(;)?.*/g;
    const finalRegex =
        /[-]?([a-z]*[-])?[a-z]*?\:.*?([0-9]*[.])?[0-9]*?px+(\s+([0-9]*[.])?[0-9]*?px)*/g;
    const attributeValueRegex =
        /[-]?([a-z]*[-])?[a-z]*?\:.*?([0-9]*[.])?[0-9]*?px/g;
    const valueRegex = /([0-9]*[.])?[0-9]*?px/g;

    let result = data.match(finalRegex);

    if (!result) {
        console.log(chalk.red("Match result not found"));
        process.exit(1);
    }
    let filterResult = [];
    if (Array.isArray(ignore) && ignore.length > 0) {
        filterResult = result.filter((res) => {
            for (let i = 0; i < ignore.length; i++) {
                const element = ignore[i];
                if (res.includes(element + ":")) {
                    return res;
                }
            }
        });
    }
    let finalResult = result.filter((v) => !filterResult.includes(v)) || [];

    let valueResult = finalResult.map((v) => {
        return v.match(valueRegex);
    });

    // result.forEach((v) => {
    //     const pxValue = v.slice(0, -2);
    //     const valueRegex = new RegExp(`${pxValue}px`, "g");
    //     finalData = finalData.replace(
    //         valueRegex,
    //         `${pxValue / parseFloat(size)}rem`
    //     );
    // });
    let finalData = data;
    for (let i = 0; i < finalResult.length; i++) {
        const element = finalResult[i];
        const valueArr = valueResult[i];
        let replaceElement = element;
        for (let j = 0; j < valueArr.length; j++) {
            const value = valueArr[j];
            const pxValue = value.slice(0, -2);
            replaceElement = replaceElement.replace(
                value,
                `${parseFloat(pxValue) / parseFloat(size)}rem`
            );
        }

        // console.log(replaceElement);
        finalData = finalData.replace(element, replaceElement);
    }
    return finalData;
}

module.exports = pxtorem;
