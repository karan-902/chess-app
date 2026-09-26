import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import sessionService from "@gopvp/common/src/util/sessionService";
import type { ILoginResponse } from "@/types/utils";

const FALLBACK_POLL_MS = 45000;

export function useDeviceApprovalPoll() {
    const socketRef = useRef<Socket | null>(null);
    const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(
        null,
    );

    const stop = () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
    };

    const start = (
        approvalToken: string,
        onApproved: (res: ILoginResponse) => void,
    ) => {
        stop();

        const checkStatus = async () => {
            try {
                const res = await callAPIInterface<
                    { approval_token: string },
                    ILoginResponse | { status: "pending" }
                >("POST", "/device/approval-status", {
                    approval_token: approvalToken,
                });
                if ("status" in res) return;
                stop();
                await sessionService.saveSession(res);
                onApproved(res);
            } catch (err) {
                stop();
                showApiErrorToast(err);
            }
        };

        const socketUrl = (
            import.meta.env.VITE_SOCKET_URL ?? "http://localhost:6060"
        ).trim();
        socketRef.current = io(`${socketUrl}/device-approval`, {
            auth: { token: approvalToken },
            transports: ["websocket", "polling"],
        });
        socketRef.current.on("device_approved", checkStatus);

        fallbackTimerRef.current = setInterval(checkStatus, FALLBACK_POLL_MS);
    };

    useEffect(() => stop, []);

    return { start, stop };
}
