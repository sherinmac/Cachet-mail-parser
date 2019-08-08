import { Request, Response, Router } from "express";
import * as parser from "../parser/parser";

const parseMail: Router = Router();

parseMail.post("/", (req: Request, response: Response) => {

    console.log("EMAIL BODY => " + JSON.stringify(req.body));
    if (req.body) {
        const emailRecipient: string = req.body.recipient;
        const emailSubject: string = req.body.subject;
        const emailBody: string = req.body["body-plain"];
        const senderSplit = req.body.sender.split("@", 2);
        const senderDomain = senderSplit[1];
        const domainArray = ["citrusinformatics.com", "gmail.com"];
        const hostSplittedString: string = "";
        const hostSplittedArray = [];
        const host: string = "";
        const description: string = "";

        let statusType: string = "";
        let componentString: string;
        let componentGroupName: string;
        /**
         * Get the status key (any of the key in STATUS_KEY_MAP.{UP|DOWN}) in the
         * app config,whether it is UP or DOWN, it should be available in the mail
         * subject.
         */
        statusType = parser.getStatus(emailSubject);
        console.log("statusType", statusType);
        componentGroupName = parser.getComponentGroupName(emailRecipient);
        if (statusType && statusType !== "NONE") {
            componentString = parser.getComponentName(emailBody, "body");
            console.log("componentString 1", componentString);
            if (componentString === "IGNORE") {
                componentString = parser.getComponentName(emailSubject, "subject");
                console.log("componentString 2", componentString);
            }
        }

        console.log("EMAIL SUBJECT         => " + emailSubject);
        console.log("EMAIL RECEPIENT       => " + emailRecipient);
        console.log("COMPONENT NAME        => " + componentString + "!");
        console.log("COMPONENT GROUP NAME  => " + componentGroupName + "!");
        console.log("HOST                  => " + host);
        console.log("DESCRIPTION           => " + description);

        // Checking for domain is authentic
        if (!componentString) {
            console.log("COMPONENT NAME NOT AVAILABLE!!");
            response.sendStatus(200);
        } else {
            const parameters: any = {};
            parameters.groupName = componentGroupName;
            parameters.componentName = componentString;
            // parameters.publicComponentName = publicComponentName;
            parameters.status = statusType;
            parameters.description = emailBody;
            parameters.host = host;
            parameters.emailBody = emailBody;
            parameters.emailSubject = emailSubject;
            parameters.incidentName = componentString.replace(/[_]/g, " "); // + incidendAppend;
            parameters.componentString = componentString.replace(/[_]/g, " ");

            const res = parser.checkComponentGroup(parameters);
            res.then((ret: number) => {
                response.sendStatus(ret);
            }).catch((error) => {
                response.send(error);
            });
        }
    }
});

parseMail.get("/", (req, res) => {
    // handle request here
    res.send("CACHET UP");
});

export default parseMail;
