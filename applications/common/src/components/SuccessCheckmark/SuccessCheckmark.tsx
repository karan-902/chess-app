import classNames from "classnames";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./successCheckmark.scss";

interface ISuccessCheckmarkProps {
    customClass?: string;
    confettiGif?: string;
    confettiLottieSrc?: string;
    tickLottieSrc?: string;
}

export default function SuccessCheckmark({
    customClass,
    confettiGif,
    confettiLottieSrc,
    tickLottieSrc,
}: ISuccessCheckmarkProps) {
    return (
        <div className={classNames("common-success-checkmark", customClass)}>
            {confettiLottieSrc ? (
                <DotLottieReact
                    src={confettiLottieSrc}
                    autoplay
                    speed={0.6}
                    className="confetti-gif"
                />
            ) : (
                confettiGif && (
                    <img className="confetti-gif" src={confettiGif} alt="" />
                )
            )}
            {tickLottieSrc ? (
                <DotLottieReact
                    src={tickLottieSrc}
                    autoplay
                    speed={0.6}
                    className="checkmark-lottie"
                />
            ) : (
                <svg className="checkmark-svg" viewBox="0 0 52 52">
                    <path
                        className="checkmark-check"
                        fill="none"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                </svg>
            )}
        </div>
    );
}
