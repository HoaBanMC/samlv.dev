
import { Component, OnInit } from "@angular/core";
import { listOption, SOUND_MATCH, STORE_NAME } from "../common/config";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { questions } from "../questions";
import { MathjaxModule } from "../../../components/mathjax/mathjax.module";
import { ModalCommonComponent } from "../../../components/modal-common/modal-common.component";
import { ModalCommonService } from "../../../components/modal-common/modal-common.service";
import { MODAL_ID } from "../../../components/modal-common/modal-id.const";

@Component({
    selector: "app-magic-dice",
    templateUrl: "./magic-dice.component.html",
    styleUrls: ["./magic-dice.component.scss"],
    standalone: true,
    imports: [
    FormsModule,
    ModalCommonComponent,
    MathjaxModule
]
})
export class MagicDiceComponent implements OnInit {
    idInitMagicDice = MODAL_ID.GAMES.PUZZLE_MATCH.INIT_MAGIC_DICE;

    listOption = listOption;
    teamCount = 2;
    gridSizes = this.listOption[1];
    gridSizeSelected;

    listQuestion;

    correctSrc = '/assets/audios/correct.wav';
    incorrectSrc = '/assets/audios/incorrect.wav';
    doneSrc = '/assets/audios/done.mp3';
    audio;

    isSoundOn = true;

    subscription: Subscription;

    constructor(
        private modalCommonService: ModalCommonService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subscription = this.activatedRoute.queryParams.subscribe((q: any) => {
            if (q['team'] && q['size']) {
                const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.MAGIC_DICE)) || {};
                if (!localInfo?.listCard?.length) {
                    const data = {
                        team: this.teamCount,
                        size: this.gridSizes.size[this.gridSizeSelected]
                    };
                    localStorage.setItem(STORE_NAME.MAGIC_DICE, JSON.stringify(data));
                }
                this.initGame();
            } else {
                const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.MAGIC_DICE)) || {};
                if (localInfo && (!localInfo['listCard']?.length || localInfo['state'] === 1)) {
                    if (this.listQuestion?.length >= this.gridSizes.size[0]) {
                        this.gridSizeSelected = 0;
                        const data = {
                            team: this.teamCount,
                            size: this.gridSizes.size[this.gridSizeSelected]
                        };
                        localStorage.setItem(STORE_NAME.MAGIC_DICE, JSON.stringify(data));
                    } else {
                        this.gridSizeSelected = null;
                    }
                    setTimeout(() => {
                        this.modalCommonService.openModal(this.idInitMagicDice);
                    }, 500);
                } else {
                    this.initGame();
                }
            }
        });
        if (localStorage.getItem(SOUND_MATCH)) {
            this.isSoundOn = JSON.parse(localStorage.getItem(SOUND_MATCH));
        } else {
            this.isSoundOn = true;
            localStorage.setItem(SOUND_MATCH, JSON.stringify(this.isSoundOn));
        }
    }

    initGame() {
        this.listQuestion = questions?.map(x => {
            x.dataStandard['userOptionText'] = [];
            return x;
        });
    }

    changeTeam(opt) {
        this.teamCount = opt.team;
        this.gridSizes = opt;
        if (this.gridSizeSelected > this.gridSizes.size.length - 1) {
            this.gridSizeSelected = this.gridSizes.size.length - 1;
        }
    }

    changeSize(index) {
        this.gridSizeSelected = index;
    }

    playMatch() {
        // if ((this.listQuestion?.length + 3) < this.gridSizes.size[0]) {
        //     console.log('listQuestion must large than size!');
        //     return;
        // }
        // const data = {
        //     team: this.teamCount,
        //     size: this.gridSizes.size[this.gridSizeSelected]
        // };
        // localStorage.setItem(STORE_NAME.MAGIC_DICE, JSON.stringify(data));
        // this.initGame();
        // this.modalCommonService.closeModal(this.idInitGameFlip);
    }
}