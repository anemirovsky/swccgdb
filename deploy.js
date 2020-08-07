const util = require("util");
const exec = util.promisify(require("child_process").exec);

(async () => {
  const { stdout } = await exec("doppler enclave secrets --config prd --json");

  const envVars = JSON.parse(stdout);

  const deployCmd = Object.entries(envVars).reduce(
    (command, [envName, { computed: envValue }]) => {
      return `${command} -e ${envName}="${envValue}"`;
    },
    "now --regions pdx1"
  );

  const { stdout: success, stderr: failure } = await exec(deployCmd);

  console.log(success, failure);
})();
