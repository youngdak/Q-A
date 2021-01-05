import "module-alias/register";
import Startup from "@src/startup";

(async () => {
	await new Startup().start();
})();
