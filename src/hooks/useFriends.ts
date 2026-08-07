import { useCallback, useEffect, useRef, useState } from "react";
import { callAPIInterface } from "@/utils";
import { useSocket } from "@/context/SocketContext";
import type {
    IFriendListItem,
    IFriendRequestResponse,
    ISearchResultItem,
    ISendFriendRequestBody,
    IMessageResponse,
} from "@/types/utils";

const SEARCH_DEBOUNCE_MS = 500;

export function useFriends() {
    const { socket } = useSocket();
    const [friends, setFriends] = useState<IFriendListItem[]>([]);
    const [friendsLoading, setFriendsLoading] = useState(true);
    const [requests, setRequests] = useState<IFriendRequestResponse[]>([]);
    const [requestsLoading, setRequestsLoading] = useState(true);

    const loadFriends = useCallback(async () => {
        try {
            const res = await callAPIInterface<undefined, IFriendListItem[]>(
                "GET",
                "/friends",
            );
            setFriends(res);
        } catch {
        } finally {
            setFriendsLoading(false);
        }
    }, []);

    const loadRequests = useCallback(async () => {
        try {
            const res = await callAPIInterface<
                undefined,
                IFriendRequestResponse[]
            >("GET", "/friends/requests");
            setRequests(res);
        } catch {
        } finally {
            setRequestsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFriends();
    }, [loadFriends]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    useEffect(() => {
        if (!socket) return;

        const onFriendOnline = (data: { friend_id: string }) => {
            setFriends((prev) =>
                prev.map((f) =>
                    f.id === data.friend_id ? { ...f, is_online: true } : f,
                ),
            );
        };
        const onFriendOffline = (data: { friend_id: string }) => {
            setFriends((prev) =>
                prev.map((f) =>
                    f.id === data.friend_id ? { ...f, is_online: false } : f,
                ),
            );
        };

        const onFriendRequestReceived = (data: IFriendRequestResponse) => {
            setRequests((prev) => [data, ...prev]);
        };
        const onFriendRequestAccepted = () => {
            loadFriends();
        };

        socket.on("friend_online", onFriendOnline);
        socket.on("friend_offline", onFriendOffline);
        socket.on("friend_request_received", onFriendRequestReceived);
        socket.on("friend_request_accepted", onFriendRequestAccepted);
        return () => {
            socket.off("friend_online", onFriendOnline);
            socket.off("friend_offline", onFriendOffline);
            socket.off("friend_request_received", onFriendRequestReceived);
            socket.off("friend_request_accepted", onFriendRequestAccepted);
        };
    }, [socket, loadFriends]);

    const sendRequest = useCallback(async (addresseeId: string) => {
        await callAPIInterface<ISendFriendRequestBody, IMessageResponse>(
            "POST",
            "/friends/request",
            { addressee_id: addresseeId },
        );
    }, []);

    const acceptRequest = useCallback(
        async (requestId: string) => {
            await callAPIInterface<undefined, IMessageResponse>(
                "PUT",
                `/friends/request/${requestId}/accept`,
            );
            await Promise.all([loadFriends(), loadRequests()]);
        },
        [loadFriends, loadRequests],
    );

    const declineRequest = useCallback(
        async (requestId: string) => {
            await callAPIInterface<undefined, IMessageResponse>(
                "PUT",
                `/friends/request/${requestId}/decline`,
            );
            await loadRequests();
        },
        [loadRequests],
    );

    return {
        friends,
        friendsLoading,
        requests,
        requestsLoading,
        sendRequest,
        acceptRequest,
        declineRequest,
    };
}

export function useFriendSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ISearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const trimmed = query.trim();
        if (!trimmed) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await callAPIInterface<
                    undefined,
                    ISearchResultItem[]
                >("GET", `/friends/search?q=${encodeURIComponent(trimmed)}`);
                setResults(res);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const markRequestSent = useCallback((userId: string) => {
        setResults((prev) =>
            prev.map((r) =>
                r.id === userId ? { ...r, friend_status: "pending_sent" } : r,
            ),
        );
    }, []);

    return { query, setQuery, results, loading, markRequestSent };
}
