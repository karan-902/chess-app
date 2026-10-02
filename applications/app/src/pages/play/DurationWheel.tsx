import { useEffect, useRef } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import type { IDurationWheelProps } from "@gopvp/common/src/types/component";
import { minText } from "@gopvp/app/src/constants/message";
import { DURATION_WHEEL_ITEM_HEIGHT } from "@gopvp/app/src/constants/limit";
import { DURATION_MINUTES } from "@gopvp/app/src/constants/option";

export default function DurationWheel({
 value,
 onChange,
}: IDurationWheelProps) {
 const listRef = useRef<HTMLDivElement>(null);
 const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
 const initialValueRef = useRef(value);

 useEffect(() => {
  listRef.current?.scrollTo({
   top:
    (initialValueRef.current - DURATION_MINUTES[0]) *
    DURATION_WHEEL_ITEM_HEIGHT,
  });
 }, []);

 const scrollToValue = (minutes: number) => {
  listRef.current?.scrollTo({
   top: (minutes - DURATION_MINUTES[0]) * DURATION_WHEEL_ITEM_HEIGHT,
   behavior: "smooth",
  });
 };

 const handleScroll = () => {
  clearTimeout(scrollTimeoutRef.current);
  scrollTimeoutRef.current = setTimeout(() => {
   const el = listRef.current;
   if (!el) return;
   const index = Math.round(el.scrollTop / DURATION_WHEEL_ITEM_HEIGHT);
   const picked =
    DURATION_MINUTES[Math.min(Math.max(index, 0), DURATION_MINUTES.length - 1)];
   if (picked !== value) onChange(picked);
  }, 120);
 };

 return (
  <Box customClass="duration-wheel">
   <Box customClass="duration-wheel-highlight" />
   <Box customClass="duration-wheel-list" ref={listRef} onScroll={handleScroll}>
    <Box customClass="duration-wheel-pad" />
    {DURATION_MINUTES.map((minutes) => (
     <Text
      key={minutes}
      customClass={classNames(
       "duration-wheel-item",
       minutes === value && "active",
      )}
      onClick={() => {
       onChange(minutes);
       scrollToValue(minutes);
      }}
     >
      {minutes} {minText}
     </Text>
    ))}
    <Box customClass="duration-wheel-pad" />
   </Box>
  </Box>
 );
}
