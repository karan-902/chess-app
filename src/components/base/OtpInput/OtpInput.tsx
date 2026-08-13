import { OTPInput, type SlotProps } from "input-otp";
import classNames from "classnames";
import "./otpInput.scss";

interface IOtpInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    customClass?: string;
}

function OtpSlot({ char, isActive, hasFakeCaret }: SlotProps) {
    return (
        <div
            className={classNames("otp-slot", isActive && "otp-slot--active")}
        >
            {char}
            {hasFakeCaret && <div className="otp-slot-caret" />}
        </div>
    );
}

export default function OtpInput({
    length,
    value,
    onChange,
    onComplete,
    customClass,
}: IOtpInputProps) {
    return (
        <OTPInput
            maxLength={length}
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            containerClassName={classNames("common-otp-input", customClass)}
            render={({ slots }) => (
                <>
                    {slots.map((slot, i) => (
                        <OtpSlot key={i} {...slot} />
                    ))}
                </>
            )}
        />
    );
}
