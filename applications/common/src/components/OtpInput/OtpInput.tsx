import {
    OTPInput,
    REGEXP_ONLY_DIGITS_AND_CHARS,
    type SlotProps,
} from "input-otp";
import classNames from "classnames";
import "./otpInput.scss";

interface IOtpInputProps {
    length: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    customClass?: string;
    alphanumeric?: boolean;
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
    alphanumeric,
}: IOtpInputProps) {
    return (
        <OTPInput
            maxLength={length}
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            inputMode={alphanumeric ? "text" : "numeric"}
            pattern={alphanumeric ? REGEXP_ONLY_DIGITS_AND_CHARS : undefined}
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
