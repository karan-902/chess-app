import classNames from "classnames";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { walletSuccessLottie, walletTickLottie } from "@gopvp/common/src/components/images";
import "./success-checkmark.scss";

interface ISuccessCheckmarkProps {
    customClass?: string;
}

export function SuccessCheckmark({ customClass }: ISuccessCheckmarkProps) {
    return (
        <div className={classNames("common-success-checkmark", customClass)}>
            <DotLottieReact src={walletSuccessLottie} autoplay speed={0.6} className="confetti-lottie" />
            <DotLottieReact src={walletTickLottie} autoplay speed={0.6} className="checkmark-lottie" />
        </div>
    );
}

export default SuccessCheckmark;
