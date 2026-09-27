import { Backdrop } from "@mui/material";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import "./backdrop-loader.scss";

export default function BackdropLoader() {
 const { open, text } = useReduxSelector((state) => state.common.loader);

 return (
  <Backdrop open={open} className="common-backdrop-loader">
   <Card customClass="backdrop-loader-card">
    <DotLottieReact
     src="https://lottie.host/4f3eb89c-8323-4daf-89ac-46ac8decb0a3/Hfmr29sELk.lottie"
     loop
     autoplay
     className="backdrop-loader-anim"
    />
    <Text customClass="caption">{text}</Text>
   </Card>
  </Backdrop>
 );
}
