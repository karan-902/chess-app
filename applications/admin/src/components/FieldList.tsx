import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import type { TAdminFieldListProps } from "@gopvp/admin/src/types";

export default function FieldList({ fields }: TAdminFieldListProps) {
 return (
  <Box customClass="admin-fields">
   {fields.map(({ label, value, sub, tone, isChip, chipTone }) => (
    <Box key={label} customClass="admin-field">
     <Text customClass="admin-field-label">{label}</Text>
     {isChip ? (
      <CustomChip
       label={value}
       customClass={classNames("admin-status", chipTone)}
      />
     ) : (
      <Box customClass="admin-field-body">
       <Text customClass={classNames("admin-field-value", tone)}>{value}</Text>
       {sub && <Text customClass="admin-field-sub">{sub}</Text>}
      </Box>
     )}
    </Box>
   ))}
  </Box>
 );
}
