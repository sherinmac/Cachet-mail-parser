/**
 * Application configurations
 */
export class Config {
    /**
     *  Modify the following CACHET_SERVER_URI and CACHET_TOKEN
     */
    public static readonly CACHET_SERVER_URI: string = "https://<Your-Cachet-server>";
    public static readonly CACHET_TOKEN: string = "<Cachet-server-token>";
    /**
     * Please add the search key and service name in KEY_SERVICE_MAP
     * First parameter should be the search Key and 2nd one should be the component name
     */
    public static KEY_SERVICE_MAP: any = {
        BODY_PARSER: {
        },
        SUBJECT_PARSER: {
            "DU-ETL-Scripts": "DU-ETL-Scripts",
            "Devl-Middleware-DU-Portal-BE": "DU-Portal-BE",
            "Devl-Postgraphql_duportal": "DU-Portal-BE",
            "Devl-Postgraphql_ggs": "DU-Portal-BE",
            "Devl-Postgraphql_s360": "DU-Portal-BE",
            "Devl-Solve360-Webhook": "Solve360-Webhook-Anomaly",
            "ETL-DMS-ADV": "ETL-DMS-ADV",
            "ETL-DMS-AutoMate": "ETL-DMS-AutoMate",
            "ETL-DMS-AutoNation": "ETL-DMS-AutoNation",
            "ETL-DMS-AutoSoft": "ETL-DMS-AutoSoft",
            "ETL-DMS-CDK": "ETL-DMS-CDK",
            "ETL-DMS-DPC": "ETL-DMS-DPC",
            "ETL-DMS-DealerBuilt": "ETL-DMS-DealerBuilt",
            "ETL-DMS-DealerTrack": "ETL-DMS-DealerTrack",
            "ETL-DMS-PBS": "ETL-DMS-PBS",
            "ETL-DMS-Quorum": "ETL-DMS-Quorum",
            "ETL-DMS-Reynolds": "ETL-DMS-Reynolds",
            "ETL-DMS-SIS": "ETL-DMS-SIS",
            "ETL-DMS-UCS": "ETL-DMS-UCS",
            "ETL-DU-Load": "ETL-DU-Load",
            "ETL-DU-Solve360": "ETL-DU-Solve360",
            "Test-Middleware-DU-Portal-BE": "DU-Portal-BE",
            "Test-Postgraphql_duportal": "DU-Portal-BE",
            "Test-Postgraphql_ggs": "DU-Portal-BE",
            "Test-Postgraphql_s360": "DU-Portal-BE",
            "Test-Solve360-Webhook": "Solve360-Webhook-Anomaly",
            "UAT-Middleware-DU-Portal-BE": "DU-Portal-BE",
            "UAT-Postgraphql_ggs": "DU-Portal-BE",
            "UAT-Postgraphql_s360": "DU-Portal-BE",
            "UAT-Solve360-Webhook": "Solve360-Webhook-Anomaly",
            "devl-adudssportal.sandbox.dealeruplift.net": "DU-Portal-FE",
            "devl-api.sandbox.dealeruplift.net": "Solve360Web",
            "test-adudssportal.sandbox.dealeruplift.net": "DU-Portal-FE",
            "test-api.sandbox.dealeruplift.net": "Solve360Web",
            "uat-adudssportal.sandbox.dealeruplift.net": "DU-Portal-FE",
            "uat-api.sandbox.dealeruplift.net": "Solve360Web",
        },
    };
    public static STATUS_KEY_MAP: any = {
        DOWN: ["stopped", "DOWN", "Anomaly", "failed"],
        UP: ["UP", "started", "No anomaly", "normal"],
    };
}
