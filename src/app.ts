import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import bodyParser from "body-parser";
import { Container } from "inversify";
import { bindings } from "./inversify.config";
import userAgent from "express-useragent";
import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname+'/.env' });

(async () => {
	const port = 3000;
	const container = new Container();

	await container.loadAsync(bindings);

	const server = new InversifyExpressServer(container, null, {
		rootPath: "/api/",
	}, null);
	server.setConfig((app) => {
		app.use(
			bodyParser.urlencoded({
				extended: true,
			})
		);
		app.use(bodyParser.json());
		app.use(userAgent.express());
	});

	const app = server.build();

	app.listen(port, () => {
		console.log(`Server running at http://127.0.0.1:${port}/`);
	});
})();
