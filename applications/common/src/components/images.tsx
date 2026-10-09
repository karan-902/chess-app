import {
 ArrowLeft,
 Check,
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 Copy,
 Crown,
 Eye,
 EyeOff,
 Filter,
 Handshake,
 Info,
 Mail,
 MapPin,
 Medal,
 Pencil,
 Rocket,
 Timer,
 Trophy,
 X,
 Zap,
} from "lucide-react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import ErrorIcon from "@mui/icons-material/Error";
import HandshakeIcon from "@mui/icons-material/Handshake";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WarningIcon from "@mui/icons-material/Warning";
import { imageIconS3Url, lottieBaseUrl } from "@gopvp/common/src/constants/env";

export type { LucideIcon } from "lucide-react";
export type { SvgIconComponent } from "@mui/icons-material";

export function GoogleIcon() {
 return (
  <svg
   width="1em"
   height="1em"
   viewBox="0 0 24 24"
   fill="none"
   xmlns="http://www.w3.org/2000/svg"
  >
   <path
    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    fill="#4285F4"
   />
   <path
    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    fill="#34A853"
   />
   <path
    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    fill="#FBBC05"
   />
   <path
    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    fill="#EA4335"
   />
  </svg>
 );
}

export const icons = {
 accountBalanceWallet: AccountBalanceWalletIcon,
 arrowBack: ArrowBackIcon,
 arrowForward: ArrowForwardIcon,
 arrowLeft: ArrowLeft,
 callMade: CallMadeIcon,
 callReceived: CallReceivedIcon,
 check: Check,
 checkCircle: CheckCircleIcon,
 checkCircleOutline: CheckCircleOutlineIcon,
 chevronDown: ChevronDown,
 chevronLeft: ChevronLeft,
 chevronRight: ChevronRight,
 chevronUp: ChevronUp,
 close: CloseIcon,
 contentPaste: ContentPasteIcon,
 copy: Copy,
 crown: Crown,
 edit: EditIcon,
 error: ErrorIcon,
 eye: Eye,
 eyeOff: EyeOff,
 filter: Filter,
 google: GoogleIcon,
 handshake: HandshakeIcon,
 info: Info,
 infoFilled: InfoIcon,
 keyboardArrowDown: KeyboardArrowDownIcon,
 mail: Mail,
 mapPin: MapPin,
 pencil: Pencil,
 person: PersonIcon,
 rocket: Rocket,
 timer: Timer,
 trophy: Trophy,
 warning: WarningIcon,
 x: X,
 zap: Zap,
};

export {
 AccountBalanceWalletIcon,
 ArrowBackIcon,
 ArrowForwardIcon,
 ArrowLeft,
 CallMadeIcon,
 CallReceivedIcon,
 Check,
 CheckCircleIcon,
 CheckCircleOutlineIcon,
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 CloseIcon,
 ContentPasteIcon,
 Copy,
 Crown,
 EditIcon,
 ErrorIcon,
 Eye,
 EyeOff,
 Filter,
 Handshake,
 HandshakeIcon,
 Info,
 InfoIcon,
 KeyboardArrowDownIcon,
 Mail,
 MapPin,
 Medal,
 Pencil,
 PersonIcon,
 Rocket,
 ScheduleIcon,
 Timer,
 WarningIcon,
 X,
 Zap,
};
export type TIconName = keyof typeof icons;
export const logo = `${imageIconS3Url}/chrome-wallet/logo.svg`;
export const qrLogo = `${imageIconS3Url}/chrome-wallet/qr-logo.svg`;
export const speedLogo = `${imageIconS3Url}/chrome-wallet/speed-logo.svg`;
export const walletSuccessLottie = `${lottieBaseUrl}/5af90008-6c9c-4727-a240-0deb476caf0e/pFJSoGdjVw.lottie`;
export const walletTickLottie = `${lottieBaseUrl}/d37350e0-64f5-4044-bb79-e62d80e17255/Awvs7VIH5s.lottie`;
