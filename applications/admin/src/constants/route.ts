export const ROUTES = {
 LOGIN: "/login",
 DASHBOARD: "/",
 PROFILE: "/profile",
 PROBLEMS: "/problems",
 PROBLEM_DETAIL: "/problems/:id",
} as const;

export const problemPath = (id: string) => `${ROUTES.PROBLEMS}/${id}`;
