import bodyParser = require("body-parser");
import { Application } from "express";
import * as express from "express";
import parseMail from "./routes/mailParser";

const app: Application = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
// register routes to listen to and expose
app.use("/api/parsemail", parseMail);

// initialize the webserver
const host  = process.env.YOUR_HOST || "0.0.0.0";
const port = (process.env.PORT as any as number) || 9090;

app.listen(port, host, () => {
    console.info(`App listening on port ${port}`);
});
