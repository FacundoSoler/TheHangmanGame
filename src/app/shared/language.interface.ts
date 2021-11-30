export interface ILanguage {
  hangmanSection: {
    round: string;
    hiddenWord: string;
    wordStreak: string;
    lettersEntered: string;
    guessWord: string;
    guessButton: string;
    enterLetter: string;
    restart: string;
    lives: string;
    startGame: string;
    totalTime: string;
    timeLeft: string;
    seconds: string;
    failMessage: string;
    successMessage: string;
  },
  hangmanDialogSection: {
    roundResults: string;
    results: string;
    failure: string;
    success: string;
    hiddenWord: string;
    livesLeft: string;
    wordsGuessed: string;
    totalTime: string;
    averageTime: string;
    OKbutton: string;
    bonus: string;
    newHighScore: string;
    highScoreName: string;
  }
  menuSection: {
    flagRoute: string;
    play: string;
    highScores: string;
    multiplayer: string;
  };
  footer: {
    footer: string
  };
  highScoresSection: {
    title: string;
    name: string;
    round: string;
    totalTime: string;
    date: string;
    playAgain: string;
  };
}
