import "angular";
import "angular-route";
import "marked";

import {HomePageComponent} from "./components/home/HomePageComponent";
import {WelcomeContentComponent} from "./components/home/WelcomeContentComponent";
import {NewsListComponent} from "./components/home/NewsListComponent";
import {SummaryContentComponent} from "./components/home/SummaryContentComponent";
import {LocationContentComponent} from "./components/home/LocationContentComponent";
import {NewsletterSubscriptionComponent} from "./components/home/NewsletterSubscriptionComponent";
import {SharedModel} from "../models/impl/SharedModel";
import {ISharedModel} from "../models/int/ISharedModel";
import {AttendeesListComponent} from "./components/attendees/AttendeesListComponent";
import {AttendeesPageComponent} from "./components/attendees/AttendeesPageComponent";
import {PartnersPageComponent} from "./components/partners/PartnersPageComponent";
import {PartnersListComponent} from "./components/partners/PartnersListComponent";
import {FAQPageComponent} from "./components/faq/FAQPageComponent";
import {CarouselComponent} from "./components/carousel/CarouselComponent";
import {ErrorSourceComponent} from "./components/util/ErrorSourceComponent";
import {ConferenceLocationComponent} from "./components/util/ConferenceLocationComponent";
import {FriendsListComponent} from "./components/partners/FriendsListComponent";
import {ProgramPageComponent} from "./components/program/ProgramPageComponent";
import {CFPProgramComponent} from "./components/program/CFPProgramComponent";
import {CFPEventModel} from "../models/impl/CFPEventModel";
import {ProgramComponent} from "./components/program/ProgramComponent";
import {LiveStreamPageComponent} from "./components/videos/LiveStreamPageComponent";
import {ProgramPrintPageComponent} from "./components/program/ProgramPrintPageComponent";
import {TalkAssetsComponent} from "./components/program/TalkAssetsComponent";
import {CFPPresentationDetailsComponent} from "./components/program/CFPPresentationDetailsComponent";

angular.module("bdxio.app", ["ngRoute"])
    .component("homePage", new HomePageComponent())
    .component("welcomeContent", new WelcomeContentComponent())
    .component("newsList", new NewsListComponent())
    .component("summaryContent", new SummaryContentComponent())
    .component("locationContent", new LocationContentComponent())
    .component("newsletterSubscription", new NewsletterSubscriptionComponent())
    .component("attendeesPage", new AttendeesPageComponent())
    .component("partnersPage", new PartnersPageComponent())
    .component("faqPage", new FAQPageComponent())
    .component("programPage", new ProgramPageComponent())
    .component("programPrintPage", new ProgramPrintPageComponent())
    .component("liveStreamPage", new LiveStreamPageComponent())

    .directive("errSrc", () => new ErrorSourceComponent())
    .directive("attendeesList", () => new AttendeesListComponent())
    .directive("partnersList", () => new PartnersListComponent())
    .directive("friendsList", () => new FriendsListComponent())
    .directive("carousel", () => new CarouselComponent())
    .directive("conferenceLocation", () => new ConferenceLocationComponent())
    .directive("cfpProgram", () => new CFPProgramComponent())
    .directive("cfpPresentationDetails", () => new CFPPresentationDetailsComponent())
    .directive("talkAssets", () => new TalkAssetsComponent())
    .directive("program", () => new ProgramComponent())

    .service("ISharedModel", SharedModel)
    .service("ICFPEventModel", CFPEventModel)

    .filter("marked", () => marked)

    .config(["$routeProvider", ($routeProvider) => {
        $routeProvider
            .when("/", { template: "<home-page></home-page>" })
            .when("/attendees", { template: "<attendees-page></attendees-page>" })
            .when("/partners", { template: "<partners-page></partners-page>" })
            .when("/faq", { template: "<faq-page></faq-page>" })
            .when("/program", { template: "<program-page></program-page>" })
            .when("/program/print", { template: "<program-print-page></program-print-page>" })
            .when("/livestream", { template: "<live-stream-page></live-stream-page>" })
            .when("", { redirectTo: "/" })
            .otherwise({ redirectTo: "/" });
    }])
    .run(["ISharedModel", (sharedModel: ISharedModel) => {
        console.info("BDX I/O App module ran !");
    }]);
