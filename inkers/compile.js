const fs = require('fs');
const glob = require('glob');

const ignoreFiles = [
    "script.js",
    "compile.js",
    "index.html",
    "package.json"
]

glob("**/*.js", {}, (err, files) => {
    let result = "";
    files.sort((a, b) => {
        const isUpperCase = (word) => {
            return word[0] !== word.toLowerCase()[0];
        }
        const pathA = a.split("/");
        const fileNameA = pathA[pathA.length - 1];
        const pathB = b.split("/");
        const fileNameB = pathB[pathB.length - 1];
        if (isUpperCase(fileNameA) && !isUpperCase(fileNameB)) {
            
            return -1;
        } else if (isUpperCase(fileNameB) && !isUpperCase(fileNameA)) {
            
            return 1;
        } else {
            return 0;
        }
    }).filter(f=>!ignoreFiles.includes(f) && !f.startsWith("node_modules")).forEach(f=> {
        const rawContents = fs.readFileSync(f).toString();
        let contents = "";
        let lines = rawContents.split("\n");
        if (lines.length > 200) {
            console.error(`File ${f} contains too many lines, please split it!`)
            process.exit(1);
        }
        for (let line of lines) {
            if (!line.includes("$IGNORE$") && !line.startsWith("module") && !line.startsWith("import") && !line.startsWith("export")) {
                contents += line + "\n"
            }
        }
        result += contents + "\n";
    })
    fs.writeFileSync('script.js', result, );
})