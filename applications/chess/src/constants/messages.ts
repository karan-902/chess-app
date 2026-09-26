export const rejoinGameTitle = "Rejoin Match";
export const rejoinGameBody = (opponentName: string) =>
 `Your match with ${opponentName} is still live. Reconnect now before it's forfeited.`;
export const rejoinGameBetLabel = "Fee";
export const rejoinGameOpponentLabel = "Opponent";
export const rejoinGameRejoinButton = "Rejoin Now";
export const rejoinGameExitButton = "Exit";
export const rejoinGameForfeitTitle = "Forfeit the game?";
export const rejoinGameForfeitBody = (betAmount: string) =>
 `Leaving now counts as a resign — you'll forfeit ${betAmount}.`;
export const rejoinGameForfeitKeepPlayingButton = "Keep Playing";
export const rejoinGameForfeitConfirmButton = "Forfeit & Exit";
export const authBackToSignIn = "← Back to Sign In";
export const authEmailLabel = "Email";
export const authEmailPlaceholder = "Enter your email";
export const authPasswordLabel = "Password";
export const authPasswordPlaceholder = "Enter password";
export const authConfirmPasswordLabel = "Confirm Password";
export const authOr = "or";
export const authContinueWithGoogle = "Continue with Google";
export const authValidationEmailRequired = "Email is required";
export const authValidationEmailInvalid = "Enter a valid email";
export const authValidationPasswordRequired = "Password is required";
export const authValidationPasswordMinLength =
 "Password must be at least 8 characters";
export const authValidationConfirmPasswordRequired =
 "Please confirm your password";
export const authValidationPasswordsMustMatch = "Passwords do not match";
export const authValidationUsernameRequired = "Username is required";
export const authValidationUsernameMinLength =
 "Username must be at least 3 characters";
export const authValidationUsernameMaxLength =
 "Username can't be longer than 8 characters.";
export const authValidationCountryRequired = "Country is required";
export const authLoginTitle = "Welcome Back!";
export const authLoginSubtitle = "Ready up. Enter your registered email.";
export const authLoginPasswordTitle = "Access your account";
export const authLoginPasswordSubtitle =
 "Enter your password to securely access your account";
export const authLoginNoAccountFound = "No account found with this email";
export const authLoginBack = "Back";
export const authLoginChangeEmail = "Change";
export const authLoginForgotPassword = "Forgot your password?";
export const authLoginResetNow = "Reset now";
export const authLoginNextButton = "Next";
export const authLoginSignInButton = "Login";
export const authLoginEmailNotVerified =
 "Please verify your email to continue.";
export const authLoginNoAccountPrompt = "Don't have an account?";
export const authLoginSignupLink = "Sign up";
export const authRegisterTitle = "Create Account";
export const authRegisterHaveAccountPrompt = "Already have an account?";
export const authRegisterLoginLink = "Login";
export const authRegisterUsernameLabel = "Username";
export const authRegisterUsernamePlaceholder = "Enter username";
export const authRegisterUsernameClearAriaLabel = "Clear username";
export const authRegisterQuickNamesLabel = "Suggestions";
export const authRegisterCountryLabel = "Country";
export const authRegisterCreateAccountButton = "Register";
export const authRegisterRegistrationFailed =
 "Registration failed. Please try again.";
export const authEmailVerificationTitle = "Verify your email";
export const authEmailVerificationSentCodeTo = (length: number) =>
 `We sent a ${length}-digit code to`;
export const authEmailVerificationVerifiedSuccess = "Email verified!";
export const authEmailVerificationInvalidCode =
 "Invalid or expired code. Please try again.";
export const authEmailVerificationResentSuccess =
 "A new code has been sent to your email";
export const authEmailVerificationResendFailed =
 "Couldn't resend code. Please try again.";
export const authEmailVerificationExpired =
 "This code has expired — request a new one below";
export const authEmailVerificationExpiresIn = (mmss: string) =>
 `Code expires in ${mmss}`;
export const authEmailVerificationVerifyButton = "Verify Email";
export const authEmailVerificationResendWithCooldown = (seconds: number) =>
 `Resend code (${seconds}s)`;
export const authEmailVerificationResendButton = "Resend OTP";
export const authForgotPasswordTitle = "Forgot Password";
export const authForgotPasswordSentDescription =
 "Check your inbox for a reset link.";
export const authForgotPasswordDescription =
 "Enter your email and we'll send you a reset link.";
export const authForgotPasswordSendButton = "Send Reset Link";
export const authForgotPasswordFailed =
 "Something went wrong. Please try again.";
export const authDeviceApprovalTitle = "New device detected";
export const authDeviceApprovalDescription =
 "We've emailed you to approve this sign-in. This screen will continue automatically once you approve it.";
export const authDeviceApprovalBack = "Back to login";
export const deviceApprovePageTitle = "Approve this sign-in?";
export const deviceApprovePageDescription =
 "Someone is trying to sign in to your Chess account from a new device. If this was you, approve it below.";
export const deviceApproveButton = "Yes, this was me";
export const deviceApprovedTitle = "Device approved";
export const deviceApprovedDescription =
 "You can return to your other device now — it will sign in automatically.";
export const deviceApproveInvalidTitle = "Link expired";
export const deviceApproveInvalidDescription =
 "This approval link is no longer valid. Please try logging in again.";
export const authResetPasswordInvalidLinkTitle = "Invalid Link";
export const authResetPasswordInvalidLinkDescription =
 "This reset link is missing or invalid.";
export const authResetPasswordRequestNewLink = "Request a new link";
export const authResetPasswordTitle = "Reset Password";
export const authResetPasswordDescription =
 "Choose a new password for your account.";
export const authResetPasswordNewPasswordLabel = "New Password";
export const authResetPasswordResetButton = "Reset Password";
export const authResetPasswordLinkInvalidOrExpired =
 "Reset link is invalid or has expired.";
export const appBarDepositButton = "Deposit";
export const matchmakingPoolCardWinLabel = "Win";
export const matchmakingPoolCardEntryFee = (fee: string) => `Entry fee ${fee}`;
export const matchmakingPoolCardInsufficientBalance = "Add funds";
export const matchmakingCtaFindOpponentButton = "Find Opponent";
export const matchmakingSearchingOpponentFound = "Opponent found!";
export const matchmakingSearchingFindingOpponent = "Finding opponent…";
export const matchmakingSearchingSecondsLeft = (seconds: number) =>
 `${seconds}s left`;
export const matchmakingSearchingBetLabel = "Entry fee";
export const matchmakingSearchingPrizeLabel = "Prize";
export const matchmakingSearchingCancelButton = "Cancel search";
export const matchmakingNoOpponentFound =
 "No opponent found. Please try again.";
export const matchmakingConfirmTitle = "Confirm your match";
export const matchmakingConfirmDescription =
 "You'll be matched with an opponent as soon as you confirm.";
export const matchmakingConfirmCancelButton = "Cancel";
export const lobbyPlayNowButton = "Play now";
export const playPageHint = "Tap Play now to choose a pool.";
export const playSheetCardPlayButton = "Play";
export const playSheetTip =
 "Rapid and Classical pools pay out the largest prizes.";
export const playSheetPracticeLabel = "For fun";
export const playSheetPracticeTitle = "Practice";
export const playSheetPracticeDesc = "Free to play";
export const playSheetFriendLabel = "FRIENDLY";
export const playSheetFriendTitle = "Room";
export const playSheetFriendDesc = "Custom fee";
export const roomCreateTabLabel = "Create Room";
export const roomJoinTabLabel = "Join Room";
export const roomBetLabel = "Fee amount";
export const roomBetRequired = "Fee amount is required";
export const roomBetInsufficientBalance = "Insufficient Balance";
export const roomTimeLabel = "Duration";
export const roomMinutesSuffix = "min";
export const roomRatedLabel = "Rated";
export const roomCreateButton = "Create";
export const roomJoinCodeLabel = "Room code";
export const roomPasteLabel = "Paste";
export const roomJoinButton = "Join";
export const roomWaitingTitle = "Waiting for opponent";
export const roomWaitingDesc = "Share this code with your friend";
export const roomExpiresIn = (mmss: string) => `Expires in ${mmss}`;
export const roomCopyButton = "Copy code";
export const roomCopiedButton = "Copied!";
export const roomCancelButton = "Cancel";
export const playReasonInactivity = "Inactivity";
export const playReasonResignation = "Resign";
export const playReasonTimeout = "Timeout";
export const playReasonCheckmate = "Checkmate";
export const playReasonStalemate = "Stalemate";
export const playReasonDraw = "Draw";
export const playReasonGameOver = "Game over";
export const playOpponentFallbackComputer = "Computer";
export const playOpponentFallbackOpponent = "Opponent";
export const playToastOpponentDisconnectedTitle = "Opponent disconnected";
export const playToastOpponentDisconnectedDesc = (seconds: number) =>
 `Waiting for them to reconnect (${seconds}s)…`;
export const playToastOpponentReconnected = "Opponent connected!";
export const playOpponentGraceLabel = (seconds: number) =>
 `Reconnecting… ${seconds}s`;
export const playPotLabel = "Pot";
export const playToastDrawDeclined = "Draw offer declined";
export const playDrawOfferBannerText = "Opponent offered a draw";
export const playDrawOfferBannerAcceptButton = "Accept";
export const playDrawOfferBannerDeclineButton = "Decline";
export const playResignDialogTitle = "Resign the game?";
export const playResignDialogPvpDescription = (betAmount: number) =>
 `You'll lose the game and forfeit $${betAmount.toFixed(2)} to your opponent.`;
export const playResignDialogPvcDescription = "You'll lose the game.";
export const playResignDialogKeepPlayingButton = "Keep Playing";
export const playResignDialogResignButton = "Resign";
export const playActionButtonsDraw = "Draw";
export const playActionButtonsResign = "Resign";
export const playMoveHistoryPreviousMoveAriaLabel = "Previous move";
export const playMoveHistoryNextMoveAriaLabel = "Next move";
export const playWagerBadgeDifficultyLabels = {
 easy: "Easy",
 medium: "Medium",
 hard: "Hard",
};
export const playGameOverHeaderWin = "VICTORY";
export const playGameOverHeaderDraw = "DRAW";
export const playGameOverHeaderLose = "DEFEAT";
export const playGameOverSettlementLabel = "SETTLEMENT";
export const playGameOverNewGameButton = "Back";
export const playGameOverRematchButton = "Rematch";
export const playGameOverWaitingForOpponent = (secs?: number) =>
 `Waiting for opponent… ${secs}s`;
export const playGameOverAcceptRematchButton = "Accept Rematch";
export const playPromotionTitle = "Promote pawn";
export const playPromotionQueen = "Queen";
export const playPromotionRook = "Rook";
export const playPromotionBishop = "Bishop";
export const playPromotionKnight = "Knight";
export const walletWithdrawableCaveat = "Deposits aren't withdrawable.";
export const depositModalTitle = "Deposit";
export const depositModalDepositingTitle = (amount: number) =>
 `Depositing $${amount}`;
export const depositModalTagline = "Fast, Secured & Transparent";
export const depositModalHowToLink = "How to deposit crypto?";
export const depositModalSpeedBadge = "Buy crypto instantly with";
export const amountInputLabel = "Enter Amount";
export const depositModalGenerateButton = "Generate QR Code";
export const depositModalStepsTitle = "Follow the steps";
export const depositModalStepsCloseAriaLabel = "Close steps";
export const depositModalStep1Title = "Select Cryptocurrency";
export const depositModalStep1Desc = "Choose the crypto you want to deposit.";
export const depositModalStep2Title = "Enter Deposit Amount";
export const depositModalStep2Desc = "Enter the amount you wish to deposit.";
export const depositModalStep3Title = "Generate QR Code";
export const depositModalStep3Desc =
 "Select your network to generate a QR code.";
export const depositModalStep3Note =
 "Make sure the network (Bitcoin or Lightning) matches your selected method.";
export const depositModalStep4Title = "Scan QR & Send Funds";
export const depositModalStep4Desc =
 "Scan the QR with your crypto wallet and authorize the transaction.";
export const depositModalStep4Note =
 "Sending funds on the wrong network may result in permanent loss.";
export const depositModalStep5Title = "Wait for Confirmation";
export const depositModalStep5Desc =
 "Once confirmed, your Chess wallet will be credited.";
export const depositModalAmountRequired = "Amount is required";
export const depositModalMinAmountError = (min: number) =>
 `Minimum deposit amount is $${min}.`;
export const depositModalMaxAmountError = (max: number) =>
 `Maximum deposit amount is $${max}.`;
export const depositModalGenerateFailed =
 "Couldn't generate a payment QR. Please try again.";
export const depositModalBtcOnlyWarning =
 "Deposits must be in BTC only. Other currencies will be lost.";
export const depositModalScanHint =
 "Scan/copy with your crypto wallet to deposit instantly.";
export const depositModalCopyButton = "Copy";
export const depositModalCopied = "Copied";
export const depositModalExpiresIn = (mmss: string) => `Expires in ${mmss}`;
export const depositModalExpired =
 "This QR has expired — go back and generate a new one.";
export const depositModalPaymentReceived = "Payment received!";

export const withdrawModalTitle = "Withdraw";
export const withdrawModalWithdrawableCaveat =
 "Only winnings are withdrawable.";
export const withdrawModalDestinationLabel = "Destination";
export const withdrawModalDestinationPlaceholder =
 "Bitcoin address or Lightning invoice";
export const withdrawModalSubmitButton = "Request withdrawal";
export const withdrawModalInvalidAmount = "Enter a valid amount";
export const withdrawModalMinAmountError = (min: number) =>
 `Minimum withdrawal amount is $${min}.`;
export const withdrawModalExceedsBalance = "Insufficient withdrawable balance";
export const withdrawModalInvalidDestination = "Enter a destination address";
export const withdrawModalFailed = "Withdrawal failed. Please try again.";
export const withdrawModalSuccessTitle = "Withdrawal completed";

export const leaderboardLoadError = "Couldn't load the leaderboard right now.";
export const leaderboardEmpty = "No ranked players yet.";
export const leaderboardRankFallback = "–";
export const leaderboardScopeDailyLabel = "Daily";
export const leaderboardScopeWeeklyLabel = "Weekly";
export const leaderboardScopeMonthlyLabel = "Monthly";
export const leaderboardScopeAllLabel = "All Time";
export const leaderboardSortEarningsLabel = "Top Earners";
export const leaderboardSortWinsLabel = "Most Wins";
export const leaderboardPlayerScoreLabel = "Score";
export const leaderboardPlayerGrossIncomeLabel = "Gross Income";
export const leaderboardPlayerWinsLabel = "Wins";
export const leaderboardPlayerLoadFailed = "Couldn't load this player's stats.";

export const historyTimeControlLabel = (minutes: number) => `${minutes} min`;

export const matchesSubtabHistory = "My results";
export const matchesSubtabGlobal = "Worldwide";
export const matchesSubtabStats = "My Stats";

export const matchesEmptyTitle = "Welcome!";
export const matchesEmptyDesc =
 "Make your first move — start a staked match from the Play tab and win real money from your opponent.";
export const matchesLoadError = "Couldn't load your matches right now.";

export const matchesGlobalEmptyTitle = "No games yet";
export const matchesGlobalEmptyDesc =
 "Global activity will show up here once matches start rolling in.";


export const matchesYouLabel = "You";

export const matchesVsLabel = "VS";

export const matchesStatsTitle = "Chess";
export const matchesStatsBestStreakLabel = "Best streak";
export const matchesStatsCurrentStreakLabel = "Current streak";
export const matchesStatsFallback = 0;

export const walletPoweredByLabel = "POWERED BY";
export const walletPageBalanceLabel = "Total Balance";
export const walletPageWithdrawableLabel = "Withdraw Balance";
export const walletPageTransactionsTitle = "Transactions";
export const walletPageEmptyTitle = "No transactions yet";
export const walletPageEmptyDesc =
 "Your deposits, withdrawals, and match payouts will show up here.";
export const walletFilterTitle = "Filter Transactions";
export const walletFilterTypeLabel = "Type";
export const walletFilterFromLabel = "From";
export const walletFilterToLabel = "To";
export const walletFilterApplyButton = "Apply Filters";
export const walletFilterResetButton = "Reset";

export const rulesStakingTitle = "How staking works";
export const rulesStakingDesc =
 "Every match is winner-take-most. Both players stake the same amount when the game starts; the winner takes the pot minus a 12% platform fee.";
export const rulesPayoutsTitle = "Payouts";
export const rulesPayoutsList = [
 "Checkmate, resign, or win on time all pay the same amount.",
 "Draws split the pot evenly, minus the fee.",
 "Going inactive past your pool's timeout forfeits the game to your opponent.",
];
export const rulesMatchingTitle = "Fair matching";
export const rulesMatchingDesc =
 "You're matched by rating and stake size, not queue order — so the board you get is close to even before the first move.";
export const rulesAboutVersion = "Chess · v1.0.0";
export const rulesAboutCredit =
 'Piece set "cburnett" by Colin M.L. Burnett, CC BY-SA 3.0';

export const profileTitle = "Profile";
export const profileEditButton = "Edit Profile";
export const profileValidationUsernameRequired = "Username is required";
export const profileValidationUsernameMinLength =
 "Username must be at least 3 characters";
export const profileUpdateSuccess = "Profile updated";
export const profileUpdateFailed = "Failed to update profile";
export const profileUsernameLabel = "Username";
export const profileAppearanceLabel = "Appearance";
export const profileDarkModeLabel = "Dark Mode";
export const profileRatingsByCategoryLabel = "Ratings";
export const profileSaveChangesButton = "Save Changes";

export const selectCountryTitle = "Select Your Country";
export const selectCountrySubtitle =
 "We need your country to enable deposits, withdrawals, and matchmaking.";
export const selectCountryContinueButton = "Continue";
export const selectCountrySetFailed =
 "Couldn't save your country. Please try again.";
export const countrySelectSearchPlaceholder = "Search country…";
export const countrySelectSelectPlaceholder = "Select country";
export const appBarWallet = "Wallet";
export const appBarLogout = "Log Out";
export const appBarBack = "Back";
export const apiRateLimited = "Too many attempts, please wait.";
export const apiSomethingWentWrong = "Something went wrong. Please try later.";
export const authLoginSuccess = "Signed in successfully.";
export const authRegisterSuccess = "Account created.";
export const authGoogleLoginFailed = "Google sign-in failed. Please try again.";
export const selectCountrySetSuccess = "Country saved.";
export const leaderboardLoadFailed = "Couldn't load the leaderboard.";
export const poolsLoadFailed = "Couldn't load games.";
export const gameLoadFailed = "Couldn't load this game.";
export const matchHistoryLoadFailed = "Couldn't load your matches.";
export const matchStatsLoadFailed = "Couldn't load your stats.";
export const walletBalanceLoadFailed = "Couldn't load your balance.";
export const walletTransactionsLoadFailed = "Couldn't load transactions.";
export const profileLoadFailed = "Couldn't load your profile.";
export const usernameSuggestionsFailed = "Couldn't load username suggestions.";

export const authLeftQuoteAriaLabel = (n: number) => `Quote ${n}`;
export const authLeftBrandName = "SHATRANJ";
export const authLeftTagline = "Chess · Crypto · Competition";

export const authLeftLoginHeadlineLines = [
 "Your next move",
 "awaits, Champion.",
];
export const authLeftLoginDesc =
 "Welcome back to the arena. Your opponents are waiting — are you ready?";
export const authLeftLoginFeatures = [
 {
  icon: "⚡",
  title: "Pick Up Where You Left",
  sub: "Resume your ranked streak instantly",
 },
 {
  icon: "🏆",
  title: "Leaderboard Standing",
  sub: "See how you rank against the world",
 },
 {
  icon: "◈",
  title: "Wallet Ready",
  sub: "Your ETH balance is waiting to grow",
 },
];
export const authLeftLoginQuotes = [
 {
  text:
   "I always believed if I work hard and keep improving, I can achieve anything in chess.",
  author: "Gukesh Dommaraju",
  title: "World Chess Champion 2024",
 },
 {
  text:
   "Every chess master was once a beginner. The key is to never stop learning.",
  author: "Irving Chernev",
  title: "Chess Author & Player",
 },
 {
  text:
   "Chess is the art of analysis. You must train yourself to think several moves ahead.",
  author: "Mikhail Botvinnik",
  title: "6th World Chess Champion",
 },
];

export const authLeftRegisterHeadlineLines = [
 "Play Chess.",
 "Stake Crypto.",
 "Dominate.",
];
export const authLeftRegisterDesc =
 "The world's first chess platform where every move carries real stakes.";
export const authLeftRegisterFeatures = [
 {
  icon: "♟",
  title: "Real-time Matchmaking",
  sub: "Play against ranked opponents worldwide",
 },
 {
  icon: "◈",
  title: "Crypto Stakes",
  sub: "Wager ETH and win real rewards",
 },
 {
  icon: "★",
  title: "ELO Rating System",
  sub: "Track and grow your competitive ranking",
 },
];
export const authLeftRegisterQuotes = [
 {
  text:
   "Chess is not just about the board — it's about the courage to make the decisive move.",
  author: "Magnus Carlsen",
  title: "5x World Chess Champion",
 },
 {
  text:
   "Chess is everything: art, science, and sport. It demands the very best of a human being.",
  author: "Anatoly Karpov",
  title: "12th World Chess Champion",
 },
 {
  text:
   "When you see a good move, look for a better one. Chess rewards patience above all.",
  author: "Emanuel Lasker",
  title: "2nd World Chess Champion",
 },
];

export const MIN_TRANSACTION_USD = 1;
export const MAX_DEPOSIT_USD = 99;
export const USERNAME_MAX_LENGTH = 8;
export const MAX_AMOUNT_DIGITS = 2;
