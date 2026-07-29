import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedVisitorId: string | null = null;

export async function getDeviceFingerprint(): Promise<string> {
    if (cachedVisitorId) return cachedVisitorId;
    const agent = await FingerprintJS.load();
    const result = await agent.get();
    cachedVisitorId = result.visitorId;
    return cachedVisitorId;
}
