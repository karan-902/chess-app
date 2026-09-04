import type { IPvcSnapshot } from "@/types/components";

const FINGERPRINT_KEY = "sj_fingerprint";

export function getStoredFingerprint(): string | null {
    try {
        return localStorage.getItem(FINGERPRINT_KEY);
    } catch {
        return null;
    }
}

export function setStoredFingerprint(fingerprint: string) {
    try {
        localStorage.setItem(FINGERPRINT_KEY, fingerprint);
    } catch {}
}

export function markGameFinished(id: string) {
    try {
        sessionStorage.setItem(`gr_finished:${id}`, "1");
    } catch {}
}

export function isGameFinished(id: string) {
    try {
        return sessionStorage.getItem(`gr_finished:${id}`) === "1";
    } catch {
        return false;
    }
}

export function getPvcColor(id: string): string | null {
    try {
        return sessionStorage.getItem(`pvc_color:${id}`);
    } catch {
        return null;
    }
}

export function setPvcColor(id: string, color: string) {
    try {
        sessionStorage.setItem(`pvc_color:${id}`, color);
    } catch {}
}

export function savePvcSnapshot(id: string, snapshot: IPvcSnapshot) {
    try {
        sessionStorage.setItem(`pvc_snapshot:${id}`, JSON.stringify(snapshot));
    } catch {}
}

export function loadPvcSnapshot(id: string): IPvcSnapshot | null {
    try {
        const raw = sessionStorage.getItem(`pvc_snapshot:${id}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearPvcSnapshot(id: string) {
    try {
        sessionStorage.removeItem(`pvc_snapshot:${id}`);
    } catch {}
}
