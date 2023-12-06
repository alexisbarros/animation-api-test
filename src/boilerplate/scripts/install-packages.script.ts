import * as chp from "child_process";

(() => {
  chp
    .execSync(
      "npm install --save dotenv mongoose jsonwebtoken @types/jsonwebtoken @loopback/authentication @loopback/authentication-jwt @loopback/security",
      { cwd: "../../../" }
    )
    .toString();
})();
