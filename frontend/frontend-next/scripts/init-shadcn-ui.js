const { exec } = require("child_process");
const path = require("path");

const shadcnUiPath = path.join(
  __dirname,
  "..",
  "node_modules",
  ".bin",
  "shadcn-ui"
);

exec(
  "npm install shadcn-ui@latest",
  (installError, installStdout, installStderr) => {
    if (installError) {
      console.error(`Install Error: ${installError.message}`);
      return;
    }
    if (installStderr) {
      console.error(`Install Stderr: ${installStderr}`);
      return;
    }
    console.log(`Install Stdout: ${installStdout}`);

    exec(`${shadcnUiPath} init`, { shell: true }, (error, stdout, stderr) => {
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
  }
);
