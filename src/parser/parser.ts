import axios from "axios";
import App = require("../conf/config");

const compGroupsURL: string = App.Config.CACHET_SERVER_URI + "/api/v1/components/groups";
const compURL: string = App.Config.CACHET_SERVER_URI + "/api/v1/components";
const incidentURL: string = App.Config.CACHET_SERVER_URI + "/api/v1/incidents";

/**
 * Function to check whether the component is enabled or not
 * @param enabledComponents
 * @param params
 */
function checkEnabledComponents(enabledComponents: any, params: any) {
    let componentFlag = false;
    for (const component of enabledComponents) {
        console.log("(checkEnabledComponents) COMPONENT Name " + component.name);
        if (component.name.trim() === params.componentName.trim()) {
            console.log("(checkEnabledComponents) COMPONENT EXISTS");
            componentFlag = true;
            params.componentId = component.id;
            params.tags = component.tags;
            updateComponent(params);
            break;
        }
    }
    if (!componentFlag) {
        // POST Method here
        console.log("(checkEnabledComponents) Component POST here");
        postComponent(params);
    }
}

/**
 * Create a new Component Group
 * @param params
 */
function postComponentGroup(params: any) {
    const jsonData: any = {};
    if (params.groupName !== "") {
        jsonData.name = params.groupName;
        jsonData.order = 2;
        jsonData.collapsed = 2; // For setting group always collapsed 0 for not colapsed, 1 for always, 2 on error
    }

    axios.post(compGroupsURL, jsonData, {
        baseURL: compGroupsURL,
        headers: {
            "Content-Type": "application/json",
            "X-Cachet-Token": App.Config.CACHET_TOKEN,
        },
        method: "POST",
        timeout: 30000,
    })
        .then((resp) => {
            console.log("(postComponentGroup) COMPONENT GROUP RESPONSE JSON => " + JSON.stringify(resp.data.data));

            params.groupId = resp.data.data.id;
            postComponent(params);
        })
        .catch((error) => {
            console.log(error);
        });
}

/**
 * Create a new Component
 * @param params
 */
function postComponent(params: any) {

    const jsonData: any = {};
    console.log("(postComponent) PARAMS => " + JSON.stringify(params));
    if (params.componentName && params.componentName !== "") {
        jsonData.name = params.componentName;
        const statusMessage: string = params.status.toLowerCase();
        jsonData.description = params.componentName;
        jsonData.enabled = true;
        jsonData.tags = checkTag(params.tags, params.componentString, statusMessage);
        if (jsonData.tags.length === 0) {
            jsonData.status = 1;
        } else {
            jsonData.status = 4;
        }
        jsonData.tags = jsonData.tags.join();
    }

    if (params.groupId >= 1) {
        jsonData.group_id = params.groupId;
    }

    console.log("(postComponent) COMPONENT POST JSON => " + JSON.stringify(jsonData));

    axios.post(compURL, jsonData, {
        baseURL: compURL,
        headers: {
            "Content-Type": "application/json",
            "X-Cachet-Token": App.Config.CACHET_TOKEN,
        },
        method: "POST",
        timeout: 30000,
    })
        .then((resp) => {
            const respData = resp.data.data;
            console.log("(postComponent) COMPONENT POST RESPONSE => " + JSON.stringify(respData));
            params.componentId = resp.data.data.id;
            postIncident(params);
        })
        .catch((error) => {
            console.log(error);
        });
}

/**
 * Update a component
 * @param params
 */
function updateComponent(params: any) {
    console.log("(updateComponent) COMPONENT PUT PARAMS => " + JSON.stringify(params));

    const jsonData: any = {};
    if (params.componentName !== "") {
        jsonData.name = params.componentName;
        const statusMessage: string = params.status.toLowerCase();
        jsonData.enabled = true;
        jsonData.tags = checkTag(params.tags, params.componentString, statusMessage);
        if (jsonData.tags.length === 0) {
            jsonData.status = 1;
        } else {
            jsonData.status = 4;
        }
        jsonData.tags = jsonData.tags.join();
    }
    if (params.groupId >= 1) {
        jsonData.group_id = params.groupId;
    }

    console.log("(updateComponent) COMPONENT PUT JSON => " + JSON.stringify(jsonData));

    axios.put(compURL + "/" + params.componentId, jsonData, {
        baseURL: compURL,
        headers: {
            "Content-Type": "application/json",
            "X-Cachet-Token": App.Config.CACHET_TOKEN,
        },
        method: "PUT",
        timeout: 30000,
    })
        .then((resp) => {
            const respData = resp.data.data;
            console.log("(updateComponent) COMPONENT PUT RESPONSE => " + JSON.stringify(resp.data.data));
            params.componentId = resp.data.data.id;
            postIncident(params);
        })
        .catch((error) => {
            console.log(error);
        });
}

/**
 * POST an incedent
 * @param params
 */
function postIncident(params: any) {

    let incidentName = params.status;
    if (params.incidentName !== "") {
        incidentName = params.incidentName + " " + params.status;
    }
    const incidentMessage = params.emailSubject + "\n\r\n            " + params.emailBody;
    // params.componentName + " " + params.status;
    const incidentStatus = 4;
    const incidentVisiblity = 0;

    const statusMessage: string = params.status.toLowerCase();
    let componentStatus: number;
    if (statusMessage === "up") {
        componentStatus = 1;
    } else if (statusMessage === "down") {
        componentStatus = 4;
    }

    const jsonData: any = {};
    jsonData.name = incidentName;
    jsonData.message = incidentMessage;
    jsonData.status = incidentStatus;
    jsonData.visible = incidentVisiblity;
    jsonData.component_id = params.componentId;
    jsonData.component_status = componentStatus;
    jsonData.notify = true;

    console.log("(postIncident) INCIDENT POST JSON => " + JSON.stringify(jsonData));

    axios.post(incidentURL, jsonData, {
        baseURL: compURL,
        headers: {
            "Content-Type": "application/json",
            "X-Cachet-Token": App.Config.CACHET_TOKEN,
        },
        method: "POST",
        timeout: 30000,
    })
        .then((resp) => {
            const respData = resp.data.data;
            console.log("(postIncident) INCIDENT POST RESPONSE => " + JSON.stringify(respData));
        })
        .catch((error) => {
            console.log(error);
        });
}

/**
 * Function to check the component dependency and add/remove tag
 * @param params
 * @param tag
 * @param status
 */
function checkTag(params: any, tag: any, status: any) {
    const keysList = [];
    // for (const key in params) {
    //     keysList.push(key);
    // }
    for (const key of Object.keys(params)) {
        keysList.push(key);
    }

    if (keysList.indexOf("") > -1) {
        const index = keysList.indexOf("");
        keysList.splice(index, 1);
        keysList.push("cachet");
    }

    const formattedTag = tag.trim().toLowerCase().replace(/[ ]/g, "-");
    if (status === "DOWN") {
        if (keysList.indexOf(formattedTag) === -1) {
            keysList.push(formattedTag);
        }
    } else if (status === "UP") {
        if (keysList.indexOf(formattedTag) > -1) {
            const index = keysList.indexOf(formattedTag);
            keysList.splice(index, 1);
        }
    }
    return keysList;
}

/**
 * Function to check the 'ComponentGroup' name, which is extracted from the mail address
 * (Eg: For 'status+Armatus_DU_production@sandboxXXXXXXXXXXXXXX.mailgun.org', the Component
 * Group name will be 'Armatus DU production')
 * @param params : any
 */
export function checkComponentGroup(params: any) {
    return new Promise((resolve, reject) => {
        axios.request({
            baseURL: compGroupsURL,
            method: "GET",
            timeout: 30000,
        }).then((resp) => {
            const groupRespData = resp.data.data;
            const parameters: any = {};
            let groupFlag = false;
            let groupid: number;

            parameters.groupName = params.groupName;
            parameters.componentName = params.componentName;
            parameters.publicComponentName = params.publicComponentName;
            parameters.groupId = groupid;
            parameters.status = params.status;
            parameters.description = params.description;
            parameters.emailBody = params.emailBody;
            parameters.emailSubject = params.emailSubject;
            parameters.incidentName = params.incidentName;
            parameters.componentString = params.componentString;

            for (const entry of groupRespData) {
                if (entry.name.trim() === params.groupName.trim()) {
                    console.log("(checkComponentGroup) COMPONENT GROUP EXISTS");
                    groupid = entry.id;
                    groupFlag = true;
                    parameters.groupId = entry.id;
                    const enabledCompStr = "enabled_components";
                    const enabledComponents = entry[enabledCompStr];
                    checkEnabledComponents(enabledComponents, parameters);
                    break;
                }
            }

            if (!groupFlag) {
                console.log("(checkComponentGroup) doesn't exist");
                // POST method for Group
                // on success POST or PUT for Component
                postComponentGroup(parameters);
            }
            resolve(200);
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}

/**
 * Function to get the component name
 * @param description
 */
export function getComponentName(inString: string, inStringType: string) {
    let publicComponentName = "";
    console.log("Inside getComponentName");
    if (inStringType === "email") {
        console.log(5);
        const userName = inString.split("@", 1);
        const splittedArray = userName[0].split("+", 4);
        publicComponentName = splittedArray[2].replace(/[_]/g, " ");
        return publicComponentName;
    } else if (inStringType === "body") {
        console.log(6);
        const bodyParser = App.Config.KEY_SERVICE_MAP.BODY_PARSER;
        for (const key in bodyParser) {
            if (inString.search(key) !== -1) {
                console.log(9);
                return bodyParser[key];
            }
        }
        console.log(8);
        return "IGNORE";
    } else if (inStringType === "subject") { // subject
        console.log(7);
        const subjectParser = App.Config.KEY_SERVICE_MAP.SUBJECT_PARSER;
        for (const key in subjectParser) {
            if (inString.search(key) !== -1) {
                return subjectParser[key];
            }
        }
        return "IGNORE";
    } else {
        return "IGNORE";
    }
}

export function getComponentGroupName(emailRecipient: string) {
    const userName = emailRecipient.split("@", 1);
    const splittedArray = userName[0].split("+", 4);
    let componentGroupName = "";
    componentGroupName = splittedArray[1].replace(/[_]/g, " ");
    return componentGroupName;
}

export function getStatus(inString: string) {
    console.log("inString", inString);
    let statusStringArray: any = App.Config.STATUS_KEY_MAP.UP;
    /**
     * Perform a search in inString for the presence of any
     * of the keys in the DOWN and UP Array. The Key in these Arrays
     * are user specific and which are case-sensitive.
     */
    if (new RegExp(statusStringArray.join("|")).test(inString)) {
        return "UP";
    }
    statusStringArray = App.Config.STATUS_KEY_MAP.DOWN;
    if (new RegExp(statusStringArray.join("|")).test(inString)) {
        return "DOWN";
    } else {
        return "NONE";
    }

}
