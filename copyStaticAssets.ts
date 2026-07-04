import * as shell from "shelljs";

shell.cp("-R", "env", "dist/src/");
shell.cp("-R", "src/certs", "dist/src/");
shell.cp("-R", "src/interfaces/utils/carbon-credit-f4e237c3a82e.json", "dist/src/interfaces/utils/");
// shell.cp("-R", "src/config/ssl/server.*", "dist/src/config/ssl/");