import {ICFPPresentation} from "../int/ICFPPresentation";
import {ICFPSpeaker} from "../int/ICFPSpeaker";
import * as marked from "marked";

export class CFPPresentation implements ICFPPresentation {

    id:string;
    title:string;
    summary:string;
    speakers:Array<ICFPSpeaker>;
    track:string;
    type:string;
    from:Date;
    to:Date;
    room:string;

    public toSpeakersList():string {
        return _.map(this.speakers, (speaker:ICFPSpeaker) => (speaker.firstName ? speaker.firstName + ' ' + speaker.lastName : speaker.name) + (speaker.company ? ' (' + speaker.company + ')' : '')).join(', ');
    }

    public markedSummary() {
        return marked(this.summary);
    }
}