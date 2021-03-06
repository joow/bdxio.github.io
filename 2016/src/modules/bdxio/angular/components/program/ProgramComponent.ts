import {ICFPPresentation} from "../../../models/int/ICFPPresentation";
import Dictionary = _.Dictionary;
import {ProgramOptions} from "./ProgramOptions";
export class ProgramComponent implements ng.IDirective {

    public controller:Function = ProgramController;
    public controllerAs:string = '$ctrl';
    public bindToController:boolean = true;

    public scope = {
        presentations: '=',
        options: '='
    };

    public template:string = `
        <div class="row" ng-repeat="(track, presentations) in $ctrl.presentationsByTrack">
            <div class="col-sm-12">
                <h3 class="title-track text-secondary">
                    <i ng-class="$ctrl.options.trackClasses[track]"></i>{{ track }}
                </h3>
                <ul class="program-list-speaker">
                    <li class="item-container col-xs-12 col-sm-6 col-md-4 col-lg-4 no-padding" ng-repeat="prez in presentations" data-sr="enter bottom, move 24px, reset">
                        <div class="item-content" ng-morph-modal="$ctrl.createMorphSettingsFor(prez)">
                            <div class="content-partner">
                                <div class="header-prez" ng-show="prez.speakers" ng-class="$ctrl.options.typeClasses[prez.type]">
                                    <ul class="container-avatar-speaker">
                                        <li class="avatar-speaker" ng-repeat="speaker in prez.speakers" ng-style="speaker.getAvatarStyle()"></li>
                                    </ul>
                                </div>
                                <span class="name-speaker">{{ prez.toSpeakersList() }}</span>
                                <h4 class="desc-talk">{{ prez.title }}</h4>
                                <div class="footer-prez" ng-class="$ctrl.options.typeClasses[prez.type]" ng-if="prez.type">
                                    <span ng-show="prez.type">{{ prez.type }}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `
}
export class ProgramController {

    public static $inject:Array<string> = [];

    private presentations:Array<ICFPPresentation>;
    private presentationsByTrack:Dictionary<ICFPPresentation[]>;
    private options:ProgramOptions;

    public constructor() {
        this.presentationsByTrack = _.chain(this.presentations).filter((prez:ICFPPresentation) => prez.track).orderBy('type').groupBy('track').value();
    }

    public createMorphSettingsFor(prez:ICFPPresentation):any {
        var speakers = prez.toSpeakersList();
        return {
            closeEl: '.close',
            target: 'body',
            modal: {
                template: `
                <div class="modal-morph">
                    <span class="glyphicon glyphicon-remove close"></span>
                    <div class="row">
                        <div class="col-md-12 header-modal">
                            <div class="row">
                                <h3 class="col-md-8 text-white highlight-text-bold force-inner-space-left-30 title">${prez.title} (${prez.type})</h3>
                                <div class="col-md-4 text-right">
                                    <span class="date-new text-white inner-space-right-15">
                                        <i class="fa fa-users space-right-5"></i> ${speakers}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 content-modal">
                            <div class="col-md-12">
                                <p class="row"><b>Track : ${prez.track}</b></p>
                                <p class="row"><b>Type : ${prez.type}</b></p>
                                <p class="row">${prez.markedSummary()}</p>
                            </div>
                        </div>
                    </div>
                </div>`,
                fade: true
            }
        };
    }
}