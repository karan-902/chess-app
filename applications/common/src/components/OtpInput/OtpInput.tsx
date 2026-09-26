import {
    OTPInput as InputOtp,
    REGEXP_ONLY_DIGITS_AND_CHARS,
    type SlotProps,
} from "input-otp";
import classNames from "classnames";
import "./otp-input.scss";

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
            className={classNames("otp-slot", isActive && "active")}
        >
            {char}
            {hasFakeCaret && <div className="otp-slot-caret" />}
        </div>
    );
}

export function OTPInput({
    length,
    value,
    onChange,
    onComplete,
    customClass,
    alphanumeric,
}: IOtpInputProps) {
    return (
        <InputOtp
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

export default OTPInput;
