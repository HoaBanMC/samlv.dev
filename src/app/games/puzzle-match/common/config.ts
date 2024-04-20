export const STORE_NAME = {
    FLIP_CELL: 'flip-cell-match-config',
    TIC_TAC_TOE: 'tic-tac-toe-match-config',
    MEMORY: 'play-memory-match-config',
    MAGIC_DICE: 'the-magic-dice-match-config'
}

export const SOUND_MATCH = 'sound-match-config'

export const LIST_GAME = [
    {
        code: 'flip-cell',
        name: 'Lật Ô',
        img: 'https://media.baamboozle.com/bbzl-prod-eu-west-5/img/game-icons/baamboozle.png'
    },
    {
        code: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        img: 'https://media.baamboozle.com/bbzl-prod-eu-west-5/img/game-icons/tictactoe.png'
    },
    {
        code: 'play-memory',
        name: 'Memory',
        img: 'https://media.baamboozle.com/bbzl-prod-eu-west-5/img/game-icons/memory.png'
    },
    {
        code: 'the-magic-dice',
        name: 'The magic dice',
        img: 'https://media.baamboozle.com/bbzl-prod-eu-west-5/img/game-icons/snakesandladders.png'
    }
]

export const listOption = [
    {
        team: 1,
        size: [9, 16, 24]
    },
    {
        team: 2,
        size: [8, 16, 24]
    },
    {
        team: 3,
        size: [9, 15, 24]
    },
    {
        team: 4,
        size: [8, 16, 24]
    }
]

export enum EnumTypeNotQues {
    WIN_POINT = 1,
    LOSE_POINT = 6,
    OTHER_TEAM_LOSE_POINT = 2,
    SWAP_POINT_WITH_TEAM = 3,
    TAKE_POINT_FROM_TEAM = 4,
    GIVE_POINT_TO_TEAM = 5,
    OTHER_TEAM_WIN_POINT = 7,
    GO_LAST_PLACE = 8,
    GO_FIRST_PLACE = 9
}

export interface TeamT {
    id: number;
    score: number;
    oldScore: number;
}

export interface CardT {
    id: number;
    question: any;
    hasFlip: boolean;
    text: string;
    image: string;
    score: number;
    type: number;
}

export enum EnumTypeCard {
    QUESTION = 1,
    NOT_QUES = 2
}

export const checkAnswer = (questionAnswer, userAnswer) => {
    return userAnswer && userAnswer.length === questionAnswer.length
        && userAnswer.every((value, index) => {
            return ((value && value.length > 0) ? value.trim().toLowerCase() : value) == ((questionAnswer[index] &&
                questionAnswer[index].length > 0) ? questionAnswer[index].trim().toLowerCase() : questionAnswer[index])
        })
}

export function shuffleArray(arr: any) {
    function swap(i: number) {
        const j = Math.floor(Math.random() * (i + 1));
        if (arr[i] === arr[j - 1] || arr[i] === arr[j + 1] ||
            arr[j] === arr[i - 1] || arr[j] === arr[i + 1] ||
            (arr[j - 1] < 0 && arr[i] < 0) || (arr[i - 1] < 0 && arr[j] < 0) ||
            (arr[j + 1] < 0 && arr[i] < 0) || (arr[i + 1] < 0 && arr[j] < 0)) {
            swap(i);
        }
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    for (let i = arr.length - 1; i > 0; i--) {
        swap(i)
    }
    return arr;
}
