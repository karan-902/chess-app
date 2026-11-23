import { expect, test, type Page, type Route } from "@playwright/test";
import {
 accountCreatedText,
 clearUsernameText,
 countryRequiredText,
 emailRequiredText,
 enterValidEmailText,
 joinTheWinnersText,
 newSuggestionText,
 passwordAlmostText,
 passwordFairText,
 passwordStrongText,
 passwordTooLongText,
 passwordWeakText,
 usernameMaxLengthText,
 usernameMinLengthText,
 usernameRequiredText,
 weakPasswordText,
} from "../src/constants/message";
import {
 PASSWORD_MAX_BYTES,
 USERNAME_CHECK_DEBOUNCE_MS,
 USERNAME_MAX_LENGTH,
} from "../src/constants/limit";
import {
 hidePasswordText,
 noResultsText,
 showPasswordText,
 somethingWentWrongText,
} from "../../common/src/constants/message";

const COUNTRIES = [
 { code: "IN", name: "India" },
 { code: "ID", name: "Indonesia" },
 { code: "US", name: "United States" },
];
const SUGGESTIONS = ["swiftfox", "boldowl"];
const VALID = {
 username: "alice01",
 email: "alice01@test.com",
 password: "Alice@123",
 country: "India",
};
const SUGGESTION_SETTLE_MS = USERNAME_CHECK_DEBOUNCE_MS * 2;

const apiError = (message: string, type: string) => ({
 errors: [{ message, type }],
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function mockAuthApi(page: Page) {
 await page.route("**/auth/countries", (route) =>
  route.fulfill({ json: { countries: COUNTRIES } }),
 );
 await page.route("**/auth/random-name**", (route) =>
  route.fulfill({ json: { usernames: SUGGESTIONS } }),
 );
 await page.route("**/auth/register", (route) =>
  route.fulfill({ json: { message: accountCreatedText } }),
 );
}

async function mockRegister(
 page: Page,
 handler: (route: Route) => Promise<void> | void,
) {
 await page.route("**/auth/register", handler);
}

async function mockSlowRegister(page: Page, delayMs: number) {
 const counter = { count: 0 };
 await mockRegister(page, async (route) => {
  counter.count += 1;
  await wait(delayMs);
  await route.fulfill({ json: { message: accountCreatedText } });
 });
 return counter;
}

async function captureRegisterBody(page: Page) {
 const captured: { body: unknown } = { body: null };
 await mockRegister(page, (route) => {
  captured.body = route.request().postDataJSON();
  return route.fulfill({ json: { message: accountCreatedText } });
 });
 return captured;
}

function countRequests(page: Page, path: string) {
 const counter = { count: 0 };
 page.on("request", (request) => {
  if (request.url().includes(path)) counter.count += 1;
 });
 return counter;
}

const getSideScroll = (page: Page) =>
 page.evaluate(
  () =>
   document.documentElement.scrollWidth - document.documentElement.clientWidth,
 );

async function openCountries(page: Page) {
 await page.getByRole("combobox").click();
 await expect(page.getByRole("option", { name: "India" })).toBeVisible();
}

async function pickCountry(page: Page, name: string) {
 await openCountries(page);
 await page.getByRole("option", { name, exact: true }).click();
}

async function fillValidForm(
 page: Page,
 overrides: Partial<typeof VALID> = {},
) {
 const values = { ...VALID, ...overrides };
 await page.locator("#username").fill(values.username);
 await page.locator("#email").fill(values.email);
 await page.locator("#password").fill(values.password);
 await pickCountry(page, values.country);
}

const registerButton = (page: Page) =>
 page.getByRole("button", { name: "Register", exact: true });

test.beforeEach(async ({ page }) => {
 await mockAuthApi(page);
 await page.goto("/register");
});

test.describe("username", () => {
 test("rejects 2 characters and only spaces, accepts exactly 3 and 10", async ({
  page,
 }) => {
  const username = page.locator("#username");
  await username.fill("ab");
  await expect(page.getByText(usernameMinLengthText)).toBeVisible();
  await username.fill("     ");
  await expect(page.getByText(usernameRequiredText)).toBeVisible();
  await username.fill("abc");
  await expect(page.getByText(usernameMinLengthText)).toHaveCount(0);
  await expect(page.getByText(usernameRequiredText)).toHaveCount(0);
  await username.fill("abcdefghij");
  await expect(page.getByText(usernameMaxLengthText)).toHaveCount(0);
 });

 test("11 characters shows the max error and keeps Register disabled", async ({
  page,
 }) => {
  await fillValidForm(page, { username: "abcdefghijk" });
  await expect(page.getByText(usernameMaxLengthText)).toBeVisible();
  await expect(registerButton(page)).toBeDisabled();
 });

 test("an emoji name passes the form, then the API error shows and the page stays", async ({
  page,
 }) => {
  await mockRegister(page, (route) =>
   route.fulfill({
    status: 400,
    json: apiError("Username cannot contain emoji.", "invalid_username"),
   }),
  );
  await fillValidForm(page, { username: "ab😀" });
  await registerButton(page).click();
  await expect(page.getByText("Username cannot contain emoji.")).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
 });

 test("fast typing sends one suggestion request", async ({ page }) => {
  await expect(page.locator(".username-suggestion-btn")).toBeVisible();
  const requests = countRequests(page, "/auth/random-name");
  await page.locator("#username").pressSequentially("alice", { delay: 80 });
  await wait(SUGGESTION_SETTLE_MS);
  expect(requests.count).toBe(1);
 });

 test(`names longer than ${USERNAME_MAX_LENGTH} characters fetch no suggestions`, async ({
  page,
 }) => {
  await expect(page.locator(".username-suggestion-btn")).toBeVisible();
  const requests = countRequests(page, "/auth/random-name");
  await page.locator("#username").fill("a".repeat(USERNAME_MAX_LENGTH + 1));
  await wait(SUGGESTION_SETTLE_MS);
  expect(requests.count).toBe(0);
 });

 test("picking a suggestion fills the name and does not fetch again", async ({
  page,
 }) => {
  const suggestion = page.locator(".username-suggestion-btn");
  await expect(suggestion).toHaveText(SUGGESTIONS[0]);
  const requests = countRequests(page, "/auth/random-name");
  await suggestion.click();
  await expect(page.locator("#username")).toHaveValue(SUGGESTIONS[0]);
  await wait(SUGGESTION_SETTLE_MS);
  expect(requests.count).toBe(0);
 });

 test("spaces around a 10-character name don't count toward the limit", async ({
  page,
 }) => {
  await fillValidForm(page, { username: "  abcdefghij  " });
  await expect(page.getByText(usernameMaxLengthText)).toHaveCount(0);
  await expect(registerButton(page)).toBeEnabled();
 });

 test("Clear username empties the field and shows Username is required", async ({
  page,
 }) => {
  await page.locator("#username").fill(VALID.username);
  await page.getByRole("button", { name: clearUsernameText }).click();
  await expect(page.locator("#username")).toHaveValue("");
  await expect(page.getByText(usernameRequiredText)).toBeVisible();
 });

 test("New suggestion shows the next name without a request, then fetches after the last", async ({
  page,
 }) => {
  const suggestion = page.locator(".username-suggestion-btn");
  const newSuggestion = page.getByRole("button", { name: newSuggestionText });
  await expect(suggestion).toHaveText(SUGGESTIONS[0]);
  const requests = countRequests(page, "/auth/random-name");
  await newSuggestion.click();
  await expect(suggestion).toHaveText(SUGGESTIONS[1]);
  expect(requests.count).toBe(0);
  await newSuggestion.click();
  await expect.poll(() => requests.count).toBe(1);
 });

 test("a suggestions API failure hides the row and shows the API message", async ({
  page,
 }) => {
  await page.route("**/auth/random-name**", (route) =>
   route.fulfill({
    status: 500,
    json: apiError("Suggestions are down", "server_error"),
   }),
  );
  await page.goto("/register");
  await expect(page.getByText("Suggestions are down")).toBeVisible();
  await expect(page.locator(".username-suggestion-btn")).toHaveCount(0);
 });

 test("special characters in the name are URL-encoded in the suggestion request", async ({
  page,
 }) => {
  const request = page.waitForRequest((req) =>
   req.url().includes("/auth/random-name?username="),
  );
  await page.locator("#username").fill("a&b=c#");
  const url = new URL((await request).url());
  expect(url.searchParams.get("username")).toBe("a&b=c#");
 });

 test("the suggestion row hides while the name has an error", async ({
  page,
 }) => {
  await expect(page.locator(".username-suggestion-btn")).toBeVisible();
  await page.locator("#username").fill("ab");
  await expect(page.getByText(usernameMinLengthText)).toBeVisible();
  await expect(page.locator(".username-suggestion-btn")).toHaveCount(0);
 });
});

test.describe("password", () => {
 const strengthCases: [string, string][] = [
  ["Aa1@aaa", passwordWeakText],
  ["abcdefgh", passwordWeakText],
  ["Alicealice", passwordFairText],
  ["Alice1234", passwordAlmostText],
  ["Alice@abcd", passwordAlmostText],
  ["Aa1@aaaa", passwordStrongText],
  ["ÄÖÜäöü1!", passwordAlmostText],
  ["Alice1234₹", passwordAlmostText],
 ];

 for (const [password, label] of strengthCases) {
  test(`"${password}" is rated ${label}`, async ({ page }) => {
   await page.locator("#password").fill(password);
   await expect(page.getByRole("meter")).toHaveAttribute(
    "aria-valuetext",
    label,
   );
  });
 }

 test("8 spaces is rejected after leaving the field and the meter hides", async ({
  page,
 }) => {
  const password = page.locator("#password");
  await password.fill("        ");
  await password.press("Tab");
  await expect(page.getByText(weakPasswordText)).toBeVisible();
  await expect(page.getByRole("meter")).toBeHidden();
 });

 test("an Almost there password keeps Register disabled", async ({ page }) => {
  await fillValidForm(page, { password: "Alice1234" });
  await page.waitForLoadState("networkidle");
  await expect(registerButton(page)).toBeDisabled();
 });

 test("₹ is not a symbol the server accepts, so the password is rejected", async ({
  page,
 }) => {
  await fillValidForm(page, { password: "Alice1234₹" });
  await expect(page.getByText(weakPasswordText)).toBeVisible();
  await expect(registerButton(page)).toBeDisabled();
 });

 test("the eye button is named for screen readers and shows and hides the password", async ({
  page,
 }) => {
  const password = page.locator("#password");
  await password.fill(VALID.password);
  await page.getByRole("button", { name: showPasswordText }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: hidePasswordText }).click();
  await expect(password).toHaveAttribute("type", "password");
 });

 test(`exactly ${PASSWORD_MAX_BYTES} characters is accepted, one more is rejected`, async ({
  page,
 }) => {
  const password = page.locator("#password");
  const maxPassword = VALID.password.padEnd(PASSWORD_MAX_BYTES, "x");
  await password.fill(maxPassword);
  await password.press("Tab");
  await expect(
   page.getByText(passwordTooLongText(PASSWORD_MAX_BYTES)),
  ).toHaveCount(0);
  await password.fill(`${maxPassword}x`);
  await expect(
   page.getByText(passwordTooLongText(PASSWORD_MAX_BYTES)),
  ).toBeVisible();
 });

 test("accented letters count as 2 bytes, so a shorter password can be too long", async ({
  page,
 }) => {
  await fillValidForm(page, { password: `${VALID.password}${"ä".repeat(32)}` });
  await expect(
   page.getByText(passwordTooLongText(PASSWORD_MAX_BYTES)),
  ).toBeVisible();
  await expect(registerButton(page)).toBeDisabled();
 });

 test("spaces around the password are sent as typed, not trimmed", async ({
  page,
 }) => {
  const captured = await captureRegisterBody(page);
  await fillValidForm(page, { password: ` ${VALID.password} ` });
  await registerButton(page).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(captured.body).toMatchObject({ password: ` ${VALID.password} ` });
 });

 test("Tab skips the eye button: email, then password, then country", async ({
  page,
 }) => {
  await page.locator("#email").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#password")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox")).toBeFocused();
 });
});

test.describe("email", () => {
 test("a missing domain is rejected after leaving the field", async ({
  page,
 }) => {
  const email = page.locator("#email");
  await email.fill("alice@");
  await email.press("Tab");
  await expect(page.getByText(enterValidEmailText)).toBeVisible();
 });

 test("touching and leaving it empty shows Email is required", async ({
  page,
 }) => {
  await page.locator("#email").focus();
  await page.locator("#email").press("Tab");
  await expect(page.getByText(emailRequiredText)).toBeVisible();
 });

 for (const email of [
  "alice@@test.com",
  "ali ce@test.com",
  "@test.com",
  "alice@test..com",
 ]) {
  test(`"${email}" is rejected`, async ({ page }) => {
   await page.locator("#email").fill(email);
   await page.locator("#email").press("Tab");
   await expect(page.getByText(enterValidEmailText)).toBeVisible();
  });
 }

 test("plus addressing and a sub-domain are accepted", async ({ page }) => {
  await page.locator("#email").fill("alice+gopvp@mail.test.co.uk");
  await page.locator("#email").press("Tab");
  await expect(page.getByText(enterValidEmailText)).toHaveCount(0);
 });

 test("spaces around the email are dropped before sending", async ({
  page,
 }) => {
  const captured = await captureRegisterBody(page);
  await fillValidForm(page, { email: `  ${VALID.email}  ` });
  await registerButton(page).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(captured.body).toMatchObject({ email: VALID.email });
 });
});

test.describe("country", () => {
 test("typing an unknown country is rejected", async ({ page }) => {
  const country = page.getByRole("combobox");
  await openCountries(page);
  await country.pressSequentially("zzz");
  await expect(country).toHaveValue("");
  await country.pressSequentially("ind");
  await expect(country).toHaveValue("ind");
  await expect(page.getByRole("option", { name: "India" })).toBeVisible();
  await expect(page.getByRole("option", { name: "Indonesia" })).toBeVisible();
  await expect(page.getByRole("option", { name: "United States" })).toHaveCount(
   0,
  );
 });

 test("leaving after a partial name clears it and shows Country is required", async ({
  page,
 }) => {
  const country = page.getByRole("combobox");
  await openCountries(page);
  await country.pressSequentially("ind");
  await country.press("Tab");
  await expect(country).toHaveValue("");
  await expect(page.getByText(countryRequiredText)).toBeVisible();
 });

 test("typing the exact name in any case and leaving selects it", async ({
  page,
 }) => {
  const country = page.getByRole("combobox");
  await openCountries(page);
  await country.pressSequentially("india");
  await country.press("Tab");
  await expect(country).toHaveValue("India");
 });

 test("ArrowDown then Enter picks the next option, Escape closes without changing it", async ({
  page,
 }) => {
  const country = page.getByRole("combobox");
  await openCountries(page);
  await country.press("ArrowDown");
  await country.press("Enter");
  await expect(country).toHaveValue("Indonesia");
  await country.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await country.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(country).toHaveValue("Indonesia");
 });

 test("a countries API failure shows the API message and an empty list", async ({
  page,
 }) => {
  await page.route("**/auth/countries", (route) =>
   route.fulfill({
    status: 500,
    json: apiError("Countries are unavailable right now", "server_error"),
   }),
  );
  await page.getByRole("combobox").click();
  await expect(
   page.getByText("Countries are unavailable right now"),
  ).toBeVisible();
  await expect(page.getByText(noResultsText)).toBeVisible();
 });

 test("the list loads once, not on every open", async ({ page }) => {
  const country = page.getByRole("combobox");
  const requests = countRequests(page, "/auth/countries");
  await openCountries(page);
  await country.press("Escape");
  await country.click();
  await expect(page.getByRole("option", { name: "India" })).toBeVisible();
  expect(requests.count).toBe(1);
 });

 test("after a failed load, opening again retries and shows the list", async ({
  page,
 }) => {
  let calls = 0;
  await page.route("**/auth/countries", (route) => {
   calls += 1;
   return calls === 1
    ? route.fulfill({
       status: 500,
       json: apiError("Countries are unavailable right now", "server_error"),
      })
    : route.fallback();
  });
  const country = page.getByRole("combobox");
  await country.click();
  await expect(page.getByText(noResultsText)).toBeVisible();
  await country.press("Escape");
  await country.click();
  await expect(page.getByRole("option", { name: "India" })).toBeVisible();
 });

 test("a country name with HTML shows as plain text and runs nothing", async ({
  page,
 }) => {
  const evilName = '<img src=x onerror="window.__xss=1">Evil';
  await page.route("**/auth/countries", (route) =>
   route.fulfill({
    json: { countries: [...COUNTRIES, { code: "XX", name: evilName }] },
   }),
  );
  await page.getByRole("combobox").click();
  await expect(page.getByRole("option", { name: evilName })).toBeVisible();
  expect(await page.evaluate(() => "__xss" in window)).toBe(false);
 });

 test("clicking outside closes the list without picking anything", async ({
  page,
 }) => {
  await openCountries(page);
  await page.getByText(joinTheWinnersText).click();
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(page.getByRole("combobox")).toHaveValue("");
 });

 test("typing part of a name then Enter picks the first match", async ({
  page,
 }) => {
  const country = page.getByRole("combobox");
  await openCountries(page);
  await country.pressSequentially("uni");
  await country.press("Enter");
  await expect(country).toHaveValue("United States");
 });
});

test.describe("submit", () => {
 test("double-clicking Register sends exactly one request", async ({
  page,
 }) => {
  const registerCalls = await mockSlowRegister(page, 800);
  await fillValidForm(page);
  await expect(registerButton(page)).toBeEnabled();
  await registerButton(page).dblclick();
  await expect(page).toHaveURL(/\/login$/);
  expect(registerCalls.count).toBe(1);
 });

 test("pressing Enter twice fast sends exactly one request", async ({
  page,
 }) => {
  const registerCalls = await mockSlowRegister(page, 800);
  await fillValidForm(page);
  await expect(registerButton(page)).toBeEnabled();
  await page.locator("#password").press("Enter");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/login$/);
  expect(registerCalls.count).toBe(1);
 });

 test("a fresh form keeps Register disabled and Enter sends nothing", async ({
  page,
 }) => {
  const requests = countRequests(page, "/auth/register");
  await expect(registerButton(page)).toBeDisabled();
  await page.locator("#email").press("Enter");
  await wait(300);
  expect(requests.count).toBe(0);
  await expect(page).toHaveURL(/\/register$/);
 });

 test("sends the country code, not its name", async ({ page }) => {
  const captured = await captureRegisterBody(page);
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(captured.body).toEqual({
   username: VALID.username,
   email: VALID.email,
   password: VALID.password,
   country: "IN",
  });
 });

 test("a duplicate email shows the API message, keeps the values and enables Register again", async ({
  page,
 }) => {
  const message =
   "This email is already registered. Please try a different one";
  await mockRegister(page, (route) =>
   route.fulfill({
    status: 400,
    json: apiError(message, "email_already_registered"),
   }),
  );
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.getByText(message)).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.locator("#email")).toHaveValue(VALID.email);
  await expect(registerButton(page)).toBeEnabled();
 });

 test("a network failure shows the generic error", async ({ page }) => {
  await mockRegister(page, (route) => route.abort("failed"));
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.getByText(somethingWentWrongText)).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
 });

 test("a 502 with an HTML page still shows the generic error", async ({
  page,
 }) => {
  await mockRegister(page, (route) =>
   route.fulfill({
    status: 502,
    contentType: "text/html",
    body: "<html><body>Bad Gateway</body></html>",
   }),
  );
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.getByText(somethingWentWrongText)).toBeVisible();
  await expect(registerButton(page)).toBeEnabled();
 });

 test("a 429 shows the server message exactly once", async ({ page }) => {
  const message = "Too many attempts, try again in a minute";
  await mockRegister(page, (route) =>
   route.fulfill({ status: 429, json: { message } }),
  );
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.getByText(message)).toHaveCount(1);
 });

 test("while the request is pending, the fields lock and the button shows a spinner", async ({
  page,
 }) => {
  await mockSlowRegister(page, 1500);
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.locator("#email")).toBeDisabled();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
 });

 test("success shows the API's own message and opens /login", async ({
  page,
 }) => {
  const message = "Welcome aboard, log in to play";
  await mockRegister(page, (route) => route.fulfill({ json: { message } }));
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.getByText(message)).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
 });

 test("after success, Back does not return to the filled form", async ({
  page,
 }) => {
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goBack();
  await expect(page).not.toHaveURL(/\/register$/);
 });
});

test.describe("layout", () => {
 test("320px wide: nothing scrolls sideways", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/register");
  expect(await getSideScroll(page)).toBeLessThanOrEqual(0);
 });

 test("320px wide: a long API error stays on screen", async ({ page }) => {
  const message = `This email is already registered: ${"averylongemailaddress".repeat(3)}@example-domain.com`;
  await page.setViewportSize({ width: 320, height: 700 });
  await mockRegister(page, (route) =>
   route.fulfill({
    status: 400,
    json: apiError(message, "email_already_registered"),
   }),
  );
  await fillValidForm(page);
  await registerButton(page).click();
  await expect(page.getByText(message)).toBeInViewport({ ratio: 1 });
  expect(await getSideScroll(page)).toBeLessThanOrEqual(0);
 });

 test("375×667: the whole form fits without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/register");
  await expect(registerButton(page)).toBeInViewport();
  const { scrollHeight, innerHeight } = await page.evaluate(() => ({
   scrollHeight: document.documentElement.scrollHeight,
   innerHeight: window.innerHeight,
  }));
  expect(scrollHeight).toBeLessThanOrEqual(innerHeight);
 });
});
