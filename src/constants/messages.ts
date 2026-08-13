import type { WithdrawMethod } from "@/types/utils";

export const deviceHandoffTitle = "Active session detected";
export const deviceHandoffBody = (deviceName: string) =>
    `You're already signed in on ${deviceName}. Continue here? That session will be ended.`;
export const deviceHandoffBodyGeneric =
    "You're already signed in on another device. Continue here? That session will be ended.";
export const deviceHandoffContinueButton = "Continue Here";
export const deviceHandoffStayButton = "Stay on Other Device";
export const deviceHandoffToastSuperseded =
    "Your session moved to another device.";
export const rejoinGameTitle = "Rejoin Match";
export const rejoinGameBody = (opponentName: string) =>
    `Your match with ${opponentName} is still live. Reconnect now before it's forfeited.`;
export const rejoinGameStakeLabel = "Stake";
export const rejoinGameOpponentLabel = "Opponent";
export const rejoinGameRejoinButton = "Rejoin Now";
export const rejoinGameExitButton = "Exit";
export const rematchOfferTitle = "Rematch?";
export const rematchOfferBody = (opponentName: string) =>
    `${opponentName} wants a rematch.`;
export const rematchOfferStakeLabel = "Stake";
export const rematchOfferAcceptButton = "Accept Rematch";
export const rematchOfferDismissButton = "Not Now";
export const activityFeedWin = (
    username: string,
    amount: string,
    streakSuffix: string,
) => `${username} won ${amount}${streakSuffix}`;
export const authBackLink = "← Back";
export const authBackToSignIn = "← Back to Sign In";
export const authEmailLabel = "Email";
export const authEmailPlaceholder = "johndoe@example.com";
export const authPasswordLabel = "Password";
export const authPasswordPlaceholder = "••••••••";
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
export const authValidationUsernameTaken = "Username not available";
export const authValidationCountryRequired = "Country is required";
export const authLoginTitle = "Welcome Back";
export const authLoginSubtitle = "Sign in to your Shatranj account";
export const authLoginNoAccountFound = "No account found with this email";
export const authLoginBack = "Back";
export const authLoginForgotPassword = "Forgot password?";
export const authLoginContinueButton = "Continue";
export const authLoginSignInButton = "Sign In";
export const authLoginIncorrectPassword = "Incorrect password";
export const authLoginEmailNotVerified =
    "Please verify your email to continue.";
export const authLoginNoAccountPrompt = "Don't have an account?";
export const authLoginCreateOneLink = "Create one";
export const authRegisterTitle = "Create Account";
export const authRegisterSubtitle = "Choose how you want to join";
export const authRegisterHaveAccountPrompt = "Already have an account?";
export const authRegisterSignInLink = "Sign in";
export const authRegisterEmailMethodTitle = "Email";
export const authRegisterEmailMethodSub = "Username · password";
export const authRegisterGoogleMethodTitle = "Google";
export const authRegisterGoogleMethodSub = "One-tap sign up";
export const authRegisterUsernameLabel = "Username";
export const authRegisterUsernamePlaceholder = "john_doe";
export const authRegisterCountryLabel = "Country";
export const authRegisterCreateAccountButton = "Create Account";
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
export const authDeviceConflictTitle = "Already logged in elsewhere";
export const authDeviceConflictDescription = (deviceName: string) =>
    `You're currently logged in on ${deviceName}. Continuing here will log that device out.`;
export const authDeviceConflictContinueButton = "Continue Here";
export const authDeviceConflictCancelButton = "Cancel";
export const authDeviceApprovalTitle = "New device detected";
export const authDeviceApprovalDescription =
    "We've emailed you to approve this sign-in. This screen will continue automatically once you approve it.";
export const authDeviceApprovalBack = "Back to login";
export const deviceApprovePageTitle = "Approve this sign-in?";
export const deviceApprovePageDescription =
    "Someone is trying to sign in to your Shatranj account from a new device. If this was you, approve it below.";
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
export const lobbyTitle = "New Game";
export const lobbySubtitle = "Choose how you want to play";
export const lobbyGameModeSectionTitle = "Game Mode";
export const lobbyLiveActivitySectionTitle = "Live Activity";
export const lobbyPvpTitle = "Player vs Player";
export const lobbyPvpDesc = "Compete for real stakes";
export const lobbyPvcTitle = "vs Computer";
export const lobbyPvcDesc = "Solo · sharpen your skills";
export const lobbySetupDifficultySectionTitle = "Difficulty";
export const lobbySetupTimeControlSectionTitle = "Time Control";
export const lobbySetupStartButton = "Start Game";
export const lobbyEyebrow = "select_mode --new";
export const lobbyOnlineNowSuffix = "online now";
export const lobbyLiveWinsEmptyText = "No wins yet — be the first.";
export const appbarOnlineSuffix = "online";
export const appbarDepositButton = "Deposit";
export const bottomNavWithdrawLabel = "Withdraw";
export const lobbyLiveWinsSectionTitle = "Live wins";
export const lobbyTopRankedSectionTitle = "Top ranked";
export const lobbyViewLeaderboard = "View leaderboard →";
export const lobbyPvpBadge = "Stake";
export const matchmakingEyebrow = "queue_join --pool";
export const matchmakingTitle = "Find a Match";
export const matchmakingSubtitle = "Choose a stake pool and enter the arena";
export const matchmakingFilterAll = "All";
export const matchmakingFilterBullet = "⚡ Bullet";
export const matchmakingFilterBlitz = "🔥 Blitz";
export const matchmakingFilterRapid = "⏱ Rapid";
export const matchmakingFilterClassical = "🏛 Classical";
export const matchmakingStatsGames = "Games";
export const matchmakingStatsOnline = "Online";
export const matchmakingPoolListSectionTitle = "Stake Pools";
export const matchmakingPoolListLive = "Live";
export const matchmakingPoolListEmptyAll = "No stake pools available right now";
export const matchmakingPoolListEmptyCategory = "No pools in this category";
export const matchmakingPoolCardHot = "HOT";
export const matchmakingPoolCardWinLabel = "Win";
export const matchmakingPoolCardEntryFee = (fee: string) => `Stake ${fee}`;
export const matchmakingPoolCardOpponentReady = "Opponent ready · Claim match";
export const matchmakingPoolCardInsufficientBalance = "Add funds";
export const matchmakingCtaWager = (stake: string) => `Wager ${stake}`;
export const matchmakingCtaWinFee = (prize: string) =>
    `Win ${prize} · 12% platform fee`;
export const matchmakingCtaFindOpponentButton = "FIND OPPONENT";
export const matchmakingRailSectionTitle = "Your Queue";
export const matchmakingRailEmptyText =
    "Select a pool to see your wager summary";
export const matchmakingSearchingOpponentFound = "Opponent found!";
export const matchmakingSearchingFindingOpponent = "Finding opponent…";
export const matchmakingSearchingStartingGame = "Starting game now";
export const matchmakingSearchingTimeLeft = (seconds: number, stake: string) =>
    `${seconds}s left · ${stake} stake`;
export const matchmakingSearchingSecondsLeft = (seconds: number) =>
    `${seconds}s left`;
export const matchmakingSearchingStakeLabel = "Stake";
export const matchmakingSearchingPrizeLabel = "Prize";
export const matchmakingSearchingCancelButton = "Cancel search";
export const matchmakingConfirmTitle = "Confirm your match";
export const matchmakingConfirmDescription =
    "You'll be matched with an opponent as soon as you confirm.";
export const matchmakingConfirmCancelButton = "Cancel";
export const lobbyPlayNowButton = "Play now";
export const playPageHint = "Tap Play now to choose a stake pool.";
export const playSheetTitle = "Choose a stake pool";
export const playSheetCardPlayButton = "Play";
export const playSheetTip =
    "Rapid and Classical pools pay out the largest prizes.";
export const playSheetPracticeLabel = "For fun";
export const playSheetPracticeTitle = "Practice";
export const playSheetPracticeDesc = "Free to play";
export const playSheetFriendLabel = "Play a friend";
export const playSheetFriendTitle = "Room match";
export const playSheetFriendDesc = "Create or join";
export const roomCreateTabLabel = "Create";
export const roomJoinTabLabel = "Join";
export const roomStakeLabel = "Stake amount";
export const roomStakeAmountPlaceholder = "Enter amount";
export const roomBalanceLabel = (balance: string) => `Balance ${balance}`;
export const roomStakeRequired = "Stake amount is required";
export const roomStakeInsufficientBalance = "Amount exceeds your balance";
export const roomTimeLabel = "Duration";
export const roomMinutesPlaceholder = "Enter minutes";
export const roomMinutesSuffix = "min";
export const roomRatedLabel = "Rated";
export const roomCreateButton = "Create room";
export const roomJoinCodeLabel = "Room code";
export const roomJoinCodePlaceholder = "9RLGSQ";
export const roomPasteLabel = "Paste";
export const roomJoinButton = "Join room";
export const roomWaitingTitle = "Waiting for opponent";
export const roomWaitingDesc = "Share this code with your friend";
export const roomCopyButton = "Copy code";
export const roomCopiedButton = "Copied!";
export const roomCancelButton = "Cancel";
export const playReasonInactivity = "Inactivity";
export const playReasonResignation = "Resignation";
export const playReasonAgreement = "Agreement";
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
export const playToastOpponentReconnected = "Opponent reconnected!";
export const playToastOpponentOfferedDraw = "Opponent offered a draw";
export const playToastDrawDeclined = "Draw offer declined";
export const playDrawOfferBannerText = "Opponent offered a draw";
export const playDrawOfferBannerAcceptButton = "Accept";
export const playDrawOfferBannerDeclineButton = "Decline";
export const playQuitDialogTitle = "Quit the game?";
export const playQuitDialogPvpDescription = (stakeAmount: number) =>
    `Leaving now counts as a resignation — you'll forfeit $${stakeAmount.toFixed(2)}.`;
export const playQuitDialogPvcDescription =
    "Your progress in this game will be lost.";
export const playQuitDialogStayButton = "Stay";
export const playQuitDialogQuitButton = "Quit";
export const playResignDialogTitle = "Resign the game?";
export const playResignDialogPvpDescription = (stakeAmount: number) =>
    `You'll lose the game and forfeit $${stakeAmount.toFixed(2)} to your opponent.`;
export const playResignDialogPvcDescription = "You'll lose the game.";
export const playResignDialogKeepPlayingButton = "Keep Playing";
export const playResignDialogResignButton = "Resign";
export const playActionButtonsDraw = "Draw";
export const playActionButtonsResign = "Resign";
export const playActionButtonsNewGame = "New Game";
export const playEnginePanelEngineLine = (score: string) =>
    `Stockfish 16 · Depth 28 · ${score}`;
export const playMoveHistoryReviewing = "Reviewing";
export const playMoveHistoryNoMovesYet = "No moves yet";
export const playPlayerRowThinking = "Thinking";
export const playPlayerRowYourTurn = "Your Turn";
export const playPlayerRowPlaying = "Playing";
export const playWagerBadgePractice = "Practice";
export const playWagerBadgeWageredEachSide = "wagered each side";
export const playWagerBadgeLive = "LIVE";
export const playWagerBadgeDifficultyLabels = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
};
export const playGameOverHeaderWin = "VICTORY";
export const playGameOverHeaderDraw = "DRAW";
export const playGameOverHeaderLose = "DEFEAT";
export const playGameOverMovesLabel = "MOVES";
export const playGameOverTimeLabel = "TIME";
export const playGameOverRatingLabel = "RATING";
export const playGameOverAccuracyLabel = "ACCURACY";
export const playGameOverSettlementLabel = "SETTLEMENT";
export const playGameOverBtcRateLabel = (rate: number) =>
    `→ BTC @ $${Math.round(rate).toLocaleString()}`;
export const playGameOverBtcFallbackLabel = "→ BTC";
export const playGameOverNewGameButton = "Back";
export const playGameOverAnalysisButton = "Analysis";
export const playGameOverShareButton = "Share";
export const playGameOverRematchButton = "Rematch";
export const playGameOverWaitingForOpponent = (secs?: number) =>
    `Waiting for opponent… ${secs}s`;
export const playGameOverAcceptRematchButton = "Accept Rematch";
export const playGameOverRematchFoundStarting = "Rematch found — starting…";
export const playPromotionTitle = "Promote pawn";
export const playPromotionQueen = "Queen";
export const playPromotionRook = "Rook";
export const playPromotionBishop = "Bishop";
export const playPromotionKnight = "Knight";
export const walletTitle = "Wallet";
export const walletSubtitle = "Manage your funds and track performance";
export const walletStatsUsdValue = "USD Value";
export const walletStatsAllTimePnl = "All-time P&L";
export const walletStatsTotalWins = "Total Wins";
export const walletStatsWinRate = "Win Rate";
export const walletBalanceCardTotalBalance = "Total Balance";
export const walletBalanceCardWithdrawable = "Withdrawable:";
export const walletStatsDeposited = "Deposited";
export const walletStatsWithdrawn = "Withdrawn";
export const walletStatsNetPayouts = "Net Payouts";
export const walletActionCardDepositTab = "↓ Deposit";
export const walletActionCardWithdrawTab = "↑ Withdraw";
export const walletActionCardGenerateAddressButton = "DEPOSIT";
export const walletActionCardRequestWithdrawalButton = "REQUEST WITHDRAWAL";
export const walletTransactionsSectionTitle = "Recent Transactions";
export const walletTransactionsEmptyText = "No transactions yet.";
export const walletTransactionsLoadMore = "Load more";
export const walletTransactionProcessingLabel = "Processing";
export const walletDepositAmountPlaceholder = "0.00";
export const walletDepositButtonLoading = "Creating payment…";
export const walletDepositCheckoutHint = "Opening Speed checkout…";
export const walletDepositInvalidAmount = "Enter an amount to deposit.";
export const walletWithdrawInvalidAmount = "Enter an amount to withdraw.";
export const walletWithdrawExceedsBalance =
    "Amount exceeds your withdrawable balance.";
export const walletWithdrawInvalidDestination = "Enter a destination address.";
export const walletWithdrawButtonLoading = "Processing…";
export const walletWithdrawSuccess = "Withdrawal requested.";
export const walletWithdrawFailed = "Withdrawal failed. Please try again.";
export const walletDepositFailed = "Couldn't start deposit. Please try again.";
export const walletDepositCompletedToast = (amount: string) =>
    `Deposit confirmed — ${amount} added to your balance.`;
export const walletWithdrawCompletedToast = (amount: string) =>
    `Withdrawal of ${amount} completed.`;
export const walletWithdrawMethodLabel = "Withdraw via";
export const walletWithdrawDestinationLabel = (method: string) =>
    `Destination (${method})`;
export const walletWithdrawMethodOptions: Array<{
    value: "lightning" | "onchain";
    label: string;
    placeholder: string;
}> = [
    {
        value: "lightning",
        label: "Lightning",
        placeholder: "LN address or invoice",
    },
    {
        value: "onchain",
        label: "Bitcoin (on-chain)",
        placeholder: "Bitcoin address",
    },
];
export const walletWithdrawableLabel = "Available to withdraw";
export const walletWithdrawableCaveat =
    "Winnings only — deposits aren't withdrawable.";
export const walletEyebrow = "wallet --balance";
export const walletEmptyTitle = "Fund your account";
export const walletEmptyDesc =
    "Deposit to start staking on chess matches. Your winnings are always instantly withdrawable.";
export const walletSortTitle = "Sort";
export const walletFilterAll = "All";
export const walletFilterPayouts = "Payouts";
export const walletFilterStakes = "Stakes";
export const walletFilterDeposits = "Deposits";
export const walletFilterWithdrawals = "Withdrawals";
export const walletSortNewest = "Newest first";
export const walletSortAmount = "Amount (high→low)";
export const walletTxFilterEmpty = "No transactions in this filter.";
export const depositModalTitle = "Deposit";
export const depositModalCloseAriaLabel = "Close deposit modal";
export const depositModalTagline = "Fast, Secured & Transparent";
export const depositModalHowToLink = "How to deposit crypto?";
export const depositModalSpeedBadge = "Buy crypto instantly with";
export const depositModalAmountLabel = "Enter Amount";
export const depositModalBitcoinTab = "Bitcoin";
export const depositModalLightningTab = "Lightning";
export const depositModalGenerateButton = "Generate QR Code";
export const depositModalCloseLink = "Close";
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
export const depositModalGenerating = "Generating…";
export const depositModalGenerateFailed =
    "Couldn't generate a payment QR. Please try again.";
export const depositModalBackAriaLabel = "Back";
export const depositModalDepositingTitle = (amount: number) =>
    `Depositing $${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
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
export const depositModalPaymentReceivedDesc =
    "Your wallet balance has been updated.";

export const withdrawModalTitle = "Withdraw";
export const withdrawModalWithdrawableCaveat =
    "Funds from settled games only — active stakes aren't withdrawable yet.";
export const withdrawModalAmountLabel = "Amount (USD)";
export const withdrawModalMethodLabel = "Withdraw via";
export const withdrawModalDestinationLabel = "Destination";
export const withdrawModalDestinationPlaceholder =
    "Bitcoin address or Lightning invoice";
export const withdrawModalMethodOptions: {
    value: WithdrawMethod;
    label: string;
}[] = [
    { value: "lightning", label: "Lightning" },
    { value: "onchain", label: "On-chain" },
];
export const withdrawModalSubmitButton = "Request withdrawal";
export const withdrawModalInvalidAmount = "Enter a valid amount";
export const withdrawModalExceedsBalance =
    "Amount exceeds your withdrawable balance";
export const withdrawModalInvalidDestination = "Enter a destination address";
export const withdrawModalFailed = "Withdrawal failed. Please try again.";
export const withdrawModalSuccessTitle = "Withdrawal requested";
export const withdrawModalSuccessDesc =
    "We're processing your withdrawal — it'll arrive shortly.";

export const leaderboardLoadError = "Couldn't load the leaderboard right now.";
export const leaderboardEmpty = "No ranked players yet.";
export const leaderboardRankFallback = "–";

export const historyTimeControlLabel = (minutes: number) => `${minutes} min`;

export const matchesSubtabHistory = "History";
export const matchesSubtabGlobal = "Global";
export const matchesSubtabStats = "Stats";

export const matchesEmptyTitle = "Welcome!";
export const matchesEmptyDesc =
    "Make your first move — start a staked match from the Play tab and win real money from your opponent.";

export const matchesYouLabel = "You";
export const matchesVsLabel = "VS";

export const matchesStatsTitle = "Chess";
export const matchesStatsSubtitle =
    "Play 5 matches to get a rank in Leaderboard ";
export const matchesStatsDaysLabel = (n: number) => `Days ${n}`;
export const matchesStatsWinRateLabel = "Win rate";
export const matchesStatsGamesPlayedLabel = "Games played";
export const matchesStatsBestStreakLabel = "Best streak";
export const matchesStatsCurrentStreakLabel = "Current streak";
export const matchesStatsFallback = 0;

export const walletPageBalanceLabel = "Total Balance";
export const walletPageWithdrawableLabel = "Withdrawable";
export const walletPageTransactionsTitle = "Recent Transactions";
export const walletPageEmptyTitle = "No transactions yet";
export const walletPageEmptyDesc =
    "Your deposits, withdrawals, and match payouts will show up here.";
export const walletFilterTitle = "Filter Transactions";
export const walletFilterTypeLabel = "Type";
export const walletFilterFromLabel = "From";
export const walletFilterToLabel = "To";
export const walletFilterApplyButton = "Apply Filters";
export const walletFilterResetButton = "Reset";

export const appbarWalletTooltip = "View wallet";
export const appbarViewProfile = "View Profile";
export const rulesStakingTitle = "How staking works";
export const rulesStakingDesc =
    "Every match is winner-take-most. Both players stake the same amount when the game starts; the winner takes the pot minus a 12% platform fee.";
export const rulesPayoutsTitle = "Payouts";
export const rulesPayoutsList = [
    "Checkmate, resignation, or win on time all pay the same amount.",
    "Draws split the pot evenly, minus the fee.",
    "Going inactive past your pool's timeout forfeits the game to your opponent.",
];
export const rulesMatchingTitle = "Fair matching";
export const rulesMatchingDesc =
    "You're matched by rating and stake size, not queue order — so the board you get is close to even before the first move.";
export const rulesAboutVersion = "Shatranj · v1.0.0";
export const rulesAboutCredit =
    'Piece set "cburnett" by Colin M.L. Burnett, CC BY-SA 3.0';

export const profileEyebrow = "whoami --edit";
export const profileTitle = "Profile";
export const profileSubtitle = "Manage your account details";
export const profileEditButton = "Edit Profile";
export const profileValidationUsernameRequired = "Username is required";
export const profileValidationUsernameMinLength =
    "Username must be at least 3 characters";
export const profileUpdateSuccess = "Profile updated";
export const profileUpdateFailed = "Failed to update profile";
export const profileEloLabel = "ELO";
export const profileStreakWidgetTitle = "Streak";
export const profileStreakWinsSuffix = "wins";
export const profileBestStreakRow = (n: number) => `best ${n}W`;
export const profilePersonalInfoLabel = "Personal Info";
export const profileUsernameLabel = "Username";
export const profileEmailLabel = "Email";
export const profileEmailHint = "Email cannot be changed";
export const profileCountryLabel = "Country";
export const profileAppearanceLabel = "Appearance";
export const profileDarkModeLabel = "Dark Mode";
export const profileEloRatingLabel = "ELO Rating";
export const profileEloRatingHint =
    "Rating updates automatically after each game";
export const profileRatingsByCategoryLabel = "Ratings";
export const profileSaveChangesButton = "Save Changes";
export const profileChangeAvatarButton = "Change Avatar";
export const profileAvatarPickerTitle = "Choose an avatar";
export const profileAvatarUpdateSuccess = "Avatar updated";
export const profileAvatarUpdateFailed = "Couldn't update avatar";

export const skillLevelEyebrow = "onboarding --skill";
export const skillLevelTitle = "Choose Your Skill Level";
export const skillLevelSubtitle =
    "This sets your starting rating — you can't change it once you've played a game";
export const skillLevelEloSuffix = (elo: number) => `${elo} ELO`;
export const skillLevelContinueButton = "Continue";
export const skillLevelAlreadyPlayedError =
    "Skill level can't be set after you've played a game";
export const skillLevelSetFailedTitle = "Failed to set skill level";
export const skillLevelSetFailedDescription = "Please try again.";

export const selectCountryTitle = "Select Your Country";
export const selectCountrySubtitle =
    "We need your country to enable deposits, withdrawals, and matchmaking.";
export const selectCountryContinueButton = "Continue";
export const selectCountrySetFailed =
    "Couldn't save your country. Please try again.";
export const sidebarNavLogoTitle = "Go to Lobby";
export const sidebarNavStreakSuffix = "W streak";
export const sidebarNavRatingHint = (elo: number) =>
    `${elo} rating · View profile`;
export const passwordStrengthCriterionLength = "At least 8 characters";
export const passwordStrengthCriterionLower = "One lowercase letter";
export const passwordStrengthCriterionUpper = "One uppercase letter";
export const passwordStrengthCriterionNumber = "One number";
export const passwordStrengthCriterionSpecial = "One special character";
export const passwordStrengthTierLabels = {
    weak: "Weak",
    fair: "Fair",
    strong: "Strong",
};
export const countrySelectSearchPlaceholder = "Search country…";
export const countrySelectSelectPlaceholder = "Select country";
export const countrySelectNoResults = "No results";
export const appBarOnlineLabel = "online";
export const appBarMessagesAriaLabel = "Messages";
export const appBarAccountSettingsAriaLabel = "Account settings";
export const appBarViewProfile = "View Profile";
export const appBarWallet = "Wallet";
export const appBarLogout = "Log Out";
export const appBarEloAriaLabel = (tier: string, elo: number) =>
    `${tier} tier, ${elo} rating`;
export const appBarStreakAriaLabel = (streak: number) =>
    `${streak} game win streak`;
export const appBarStreakSuffix = "W streak";
export const appBarEloCoachmarkText = "Tap to see your rank progress →";
export const appBarWalletBalanceAriaLabel = "View wallet";

export const apiRateLimited = "Too many attempts, please wait.";

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
        text: "I always believed if I work hard and keep improving, I can achieve anything in chess.",
        author: "Gukesh Dommaraju",
        title: "World Chess Champion 2024",
    },
    {
        text: "Every chess master was once a beginner. The key is to never stop learning.",
        author: "Irving Chernev",
        title: "Chess Author & Player",
    },
    {
        text: "Chess is the art of analysis. You must train yourself to think several moves ahead.",
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
        text: "Chess is not just about the board — it's about the courage to make the decisive move.",
        author: "Magnus Carlsen",
        title: "5x World Chess Champion",
    },
    {
        text: "Chess is everything: art, science, and sport. It demands the very best of a human being.",
        author: "Anatoly Karpov",
        title: "12th World Chess Champion",
    },
    {
        text: "When you see a good move, look for a better one. Chess rewards patience above all.",
        author: "Emanuel Lasker",
        title: "2nd World Chess Champion",
    },
];

export const friendsEyebrow = "friends --list";
export const friendsTitle = "Friends";
export const friendsSearchPlaceholder = "Search by username…";
export const friendsSectionOnline = "Online";
export const friendsSectionOffline = "Offline";
export const friendsSectionRequests = "Requests";
export const friendsEmptyTitle = "No friends yet";
export const friendsEmptyDesc =
    "Search for a username above to send your first friend request.";
export const friendsNoSearchResults = "No players found with that username.";

export const friendsRequestReceivedLabel = "wants to be friends";
export const friendsRequestAccept = "Accept";
export const friendsRequestDecline = "Decline";
export const friendsRequestAccepted = "Friend request accepted.";
export const friendsRequestDeclined = "Friend request declined.";
export const friendsRequestSent = "Friend request sent.";
export const friendsRequestSendFailed = "Couldn't send friend request.";

export const friendsAddButton = "Add friend";
export const friendsPendingSent = "Request sent";
export const friendsPendingReceived = "Respond to request";
export const friendsAlreadyFriends = "Friends";

export const friendsChallengeButton = "Challenge";
export const friendsChallengeModalTitle = (username: string) =>
    `Challenge ${username}`;
export const friendsChallengeChooseStake = "Choose a stake";
export const friendsChallengeSendButton = (amount: string) =>
    `Send Challenge — ${amount}`;
export const friendsChallengeSent = "Challenge sent.";
export const friendsChallengeSendFailed = "Couldn't send challenge.";

export const friendsChallengeWaitingTitle = (username: string) =>
    `Waiting on ${username}…`;
export const friendsChallengeWaitingDesc = (amount: string) =>
    `${amount} challenge sent`;
export const friendsChallengeCancelButton = "Cancel challenge";

export const friendsChallengeReceivedTitle = "Challenge received";
export const friendsChallengeReceivedDesc = (
    username: string,
    amount: string,
) => `${username} challenged you to a ${amount} game`;

export const friendsChallengeExpiredToast = "The challenge expired.";
export const friendsChallengeDeclinedToast = (username: string) =>
    `${username} declined your challenge.`;
export const friendsChallengeCancelledToast = "The challenge was cancelled.";
export const friendsChallengeErrorFallback =
    "Something went wrong with that challenge.";
export const MIN_DEPOSIT_USD = 1;
export const MAX_AMOUNT_DIGITS = 4;
