import { ILocationsApi } from "azure-devops-node-api/LocationsApi";
import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { IReleaseApi } from "azure-devops-node-api/ReleaseApi";

export module MockWebApi {
    export var calledBearer = false;
    export var taggerCall = {
        callType: '',
        tags: <string[]>[],
        id: 0,
        project: ''
    }

    var mockCredHandler = { // a mock IRequestHandler
        prepareRequest: (options: any) => { },
        canHandleAuthentication: (res) => true,
        handleAuthentication: (httpClient: any, protocol: any, options: any, objs: any, finalCallback: any) => { }
    };

    export function getBearerHandler(token) { 
        console.log("--- MOCK: return fake bearer handler");
        calledBearer = true;
        return mockCredHandler; 
    }

    export class WebApi {
        constructor(tpcUri, credHandler) {
        }

        getLocationsApi() {
            return Promise.resolve(<ILocationsApi>{
                getResourceArea(areaId: string) {
                    return Promise.resolve({
                        locationUrl: "theUrl"
                    });
                }
            });
        }

        getBuildApi() {
            return Promise.resolve(<IBuildApi>{
                addBuildTags(tags: string[], teamProject: string, buildId: number) {
                    console.log("--- MOCK: calling buildAPI.addBuildTags");
                    taggerCall.callType = 'Build';
                    taggerCall.tags = tags;
                    taggerCall.project = teamProject;
                    taggerCall.id = buildId;
                    return Promise.resolve(tags);
                }
            });
        }

        getReleaseApi(resourceUrl?: string) {
            return Promise.resolve(<IReleaseApi>{
                addReleaseTags(tags: string[], teamProject: string, releaseId: number) {
                    console.log("--- MOCK: calling releaseAPI.addReleaseTags");
                    taggerCall.callType = 'Release';
                    taggerCall.tags = tags;
                    taggerCall.project = teamProject;
                    taggerCall.id = releaseId;
                    return Promise.resolve(tags);
                }
            });
        }
    }
}