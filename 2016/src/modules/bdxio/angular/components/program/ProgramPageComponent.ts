import {ICFPEventModel} from "../../../models/int/ICFPEventModel";
import {ICFPEvent} from "../../../models/int/ICFPEvent";
import {ICFPPresentation} from "../../../models/int/ICFPPresentation";
import {ISharedModel} from "../../../models/int/ISharedModel";
import {IConfig} from "../../../models/int/ISharedModel";
import * as moment from 'moment';
import * as _ from 'lodash';
import {ProgramOptions} from "./ProgramOptions";
import IHttpService = angular.IHttpService;
import ILocationService = angular.ILocationService;

export class ProgramPageComponent implements ng.IDirective {
    public controller:Function = ProgramPageController;
    public controllerAs:string = '$ctrl';
    public bindToController:boolean = true;
    public template:string = `
    <section style="padding: 10px">
        <h1 class="section-title text-primary inner-space-left-15">Programme BDX.IO 2016</h1>
        <div ng-if="$ctrl.config">
            <program options="$ctrl.options" presentations="$ctrl.presentations" ng-if="$ctrl.isTalksListPublished() && $ctrl.presentations"></program>
            <cfp-program options="$ctrl.options" event="$ctrl.event" ng-if="$ctrl.isProgramPublished() && $ctrl.event"></cfp-program>
            <div class="row" ng-if="!$ctrl.isTalksListPublished() && !$ctrl.isProgramPublished()">
                <h3>Un peu de patience ... </h3>
            </div>
        </div>
    </section>
    `
}

export class ProgramPageController {

    public static $inject:Array<string> = ['ISharedModel', '$http', '$location'];

    public event:ICFPEvent;
    public presentations:Array<ICFPPresentation>;
    public config:IConfig;
    public options:ProgramOptions;

    public now:moment.Moment = moment();

    public constructor(private sharedModel:ISharedModel, private $http:IHttpService, private $location:ILocationService) {
        this.options = ProgramOptions.buildDefault();
        sharedModel.dataLoaded.then(() => {
            this.config = sharedModel.data.config;
            this.event = sharedModel.data.event;
            this.presentations = _.values<ICFPPresentation>(sharedModel.data.presentations);
        });
    }

    public isTalksListPublished() {
        if (this.$location.search().forceTalksList) return true;
        if (this.$location.search().forceCfpProgram) return false;
        if (this.config) {
            return this.config.talksListPublishingDate && this.now.isAfter(this.config.talksListPublishingDate)
                && this.config.programPublishingDate && this.now.isBefore(this.config.programPublishingDate);
        }
    }

    public isProgramPublished() {
        if (this.$location.search().forceCfpProgram) return true;
        if (this.config) {
            return this.config.programPublishingDate && this.now.isAfter(this.config.programPublishingDate);
        }
    }
}