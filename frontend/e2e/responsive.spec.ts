import { test, expect } from "@playwright/test";

test("the demo family remains navigable without document overflow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Fit family to view" }).click();
  const arthur = page.getByRole("button", { name: /^Arthur Davis,/ });
  const eleanor = page.getByRole("button", { name: /^Eleanor Vance,/ });
  const maya = page.getByRole("button", { name: /^Maya Davis,/ });
  await expect(arthur).toBeInViewport({ ratio: 0.8 });
  await expect(eleanor).toBeInViewport({ ratio: 0.8 });
  await expect(maya).toBeInViewport({ ratio: 0.8 });
  const a = await arthur.boundingBox();
  const e = await eleanor.boundingBox();
  expect(Math.abs(a!.y - e!.y)).toBeLessThan(a!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test("account and identity dialogs keep keyboard focus and close with Escape", async ({ page }) => {
  await page.goto("/?mode=live");
  const opener = page.getByRole("button", { name: "Sign in / Register →" });
  await opener.click();
  const auth = page.getByRole("dialog", { name: "Sign in to Tharavadu" });
  await expect(auth.getByLabel("Email address")).toBeFocused();
  await auth.getByLabel("Email address").fill("keyboard@example.test");
  await auth.getByLabel("Password (min 10 characters)").fill("fictional-password");
  await auth.getByRole("button", { name: "Sign in →" }).focus();
  await page.keyboard.press("Tab");
  await expect(auth.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(auth).toHaveCount(0);
  await expect(opener).toBeFocused();

  await page.goto("/?mode=demo&collision=true");
  const identity = page.getByRole("dialog", { name: "Two Georges 👀" });
  await expect(identity.getByRole("button", { name: /George Davis/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(identity).toHaveCount(0);
});

test("the story note expands for typing and clears suggestions", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Maya Davis,/ }).click();
  if (testInfo.project.name === "mobile") await expect(page.locator(".kin-mobile-sheet")).toBeVisible();
  const story = page.getByLabel("Family story");
  await expect(page.getByRole("group", { name: "Suggested stories" })).toBeVisible();
  await story.fill("My grandfather Joseph had two brothers called Mathew and Thomas.");
  if (testInfo.project.name === "mobile") await expect(page.locator(".kin-mobile-sheet")).toHaveCount(0);
  await expect(page.getByRole("group", { name: "Suggested stories" })).toHaveCount(0);
  const note = await story.boundingBox();
  const action = await page.getByRole("button", { name: "Tell Tharavadu →" }).boundingBox();
  expect(note!.height).toBeGreaterThan(65);
  if (testInfo.project.name === "mobile") expect(action!.y).toBeGreaterThan(note!.y + note!.height - 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
