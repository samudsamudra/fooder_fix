const { exec } = require("child_process");
const path = require("path");

const shadcnUiPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "shadcn-ui",
  "bin",
  "shadcn-ui"
);

exec(`node ${shadcnUiPath} init`, { shell: true }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});
