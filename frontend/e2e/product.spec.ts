import { test, expect, Page, BrowserContext } from "@playwright/test";
import { randomBytes } from "node:crypto";

async function api(context: BrowserContext, method: string, route: string, data?: unknown) {
  const response = await context.request.fetch(route, { method, data, headers: { "x-tharavadu-client": "web", Origin: "http://127.0.0.1:3010" } });
  expect(response.ok(), `${method} ${route}: ${await response.text()}`).toBeTruthy();
  return response.json();
}
async function register(page: Page) {
  const email = `journey-${randomBytes(8).toString("hex")}@example.test`;
  const password = randomBytes(18).toString("hex");
  await page.goto("/?mode=live");
  await page.getByRole("button", { name: "Sign in / Register →" }).click();
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password (min 10 characters)").fill(password);
  await page.getByRole("button", { name: "Create account →" }).click();
  await page.getByRole("button", { name: "+ Create Your Family" }).click();
  await familyForm(page, "Our fictional family", "Kevin");
  return { email, password };
}
async function familyForm(page: Page, family: string, anchor: string) {
  await page.getByLabel("Family / Tharavadu name").fill(family);
  await page.getByLabel("Your name (root anchor)").fill(anchor);
  await page.getByLabel("Seed with 8-member demo family graph").uncheck();
  await page.getByRole("button", { name: "Create family →" }).click();
  await page.getByLabel("Family story").waitFor();
}
async function story(page: Page, text: string) {
  await page.getByLabel("Family story").fill(text);
  await page.getByRole("button", { name: "Tell Tharavadu →" }).click();
  await page.getByRole("region", { name: "Review family proposal" }).waitFor();
}
async function choose(page: Page, name: string) {
  await page.getByRole("button", { name: "Fit family to view" }).click();
  await page.getByRole("button", { name: new RegExp(`^${name},`) }).click();
}
async function journal(page: Page) {
  await page.getByRole("button", { name: "Family journal", exact: true }).click();
}
async function seed(context: BrowserContext, fid: string, text: string, resolutions = {}) {
  const proposal = await api(context, "POST", `/api/families/${fid}/proposals`, { text });
  await api(context, "POST", `/api/families/${fid}/proposals/${proposal.id}/confirm`, { extraction: proposal.extraction, resolutions });
}

test("real product journey, memory isolation, and returning user", async ({ page, context }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const credentials = await register(page);
  const family = (await api(context, "GET", "/api/families"))[0];
  const before = await api(context, "GET", `/api/families/${family.id}/graph`);
  await story(page, "My father is Joseph. George is father of Joseph.");
  expect(await api(context, "GET", `/api/families/${family.id}/graph`)).toEqual(before);
  await page.getByRole("button", { name: "Looks right →" }).click();
  await page.getByText("NEW BRANCH 🌿", { exact: true }).waitFor();
  await page.waitForTimeout(700); // Let the branch reframe settle.
  await expect(page.getByRole("button", { name: /^Kevin,/ })).toBeInViewport({ ratio: 0.8 });
  await expect(page.getByRole("button", { name: /^Joseph,/ })).toBeInViewport({ ratio: 0.8 });
  await page.reload();
  await choose(page, "Kevin");
  await page.getByRole("button", { name: /^(Find connection|Connect)$/ }).filter({ visible: true }).click();
  await page.getByText("CONNECT Kevin TO…", { exact: false }).waitFor();
  await page.getByRole("button", { name: /^Joseph,/ }).click();
  await expect(page.getByText("Joseph is Kevin's father. Joseph is Kevin's parent.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "See why →" }).click();
  await expect(page.getByRole("button", { name: /Joseph is Kevin's parent/ })).toBeVisible();
  await page.waitForTimeout(700); // The trail animation must leave both endpoints in view.
  await expect(page.getByRole("button", { name: /^Kevin,/ })).toBeInViewport({ ratio: 0.8 });
  await expect(page.getByRole("button", { name: /^Joseph,/ })).toBeInViewport({ ratio: 0.8 });
  await page.getByRole("button", { name: "Close kinship trail" }).click();
  await choose(page, "Joseph");
  await page.getByRole("button", { name: /Memories \(0\).*Add memory/ }).filter({ visible: true }).click();
  await page.getByLabel("Memory text").fill("We planted a mango tree together.");
  await page.getByRole("button", { name: "Keep memory ✦" }).click();
  await page.getByText("MEMORY KEPT ✦", { exact: true }).waitFor();
  await page.reload();
  await journal(page);
  await expect(page.getByRole("dialog")).toContainText("We planted a mango tree together.");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await choose(page, "Joseph");
  await page.getByRole("button", { name: "Edit person", exact: true }).filter({ visible: true }).click();
  await page.getByRole("dialog").getByLabel("Name", { exact: true }).fill("Joseph George");
  await page.getByRole("button", { name: "Save details" }).click();
  await expect(page.getByRole("button", { name: /^Joseph George,/ })).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByRole("button", { name: "Sign in / Register →" }).click();
  await page.getByLabel("Email address").fill(credentials.email);
  await page.getByLabel("Password (min 10 characters)").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in →", exact: true }).click();
  await expect(page.getByText("Our fictional family", { exact: true })).toBeVisible();
  expect((await api(context, "GET", "/api/families"))[0].id).toBe(family.id);
  await page.getByRole("button", { name: "+ Family", exact: true }).click();
  await familyForm(page, "Second fictional family", "Nora");
  await journal(page);
  await expect(page.getByRole("dialog")).toContainText("No memories kept yet.");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.locator("header select").selectOption(family.id);
  await journal(page);
  await expect(page.getByRole("dialog")).toContainText("We planted a mango tree together.");
  await page.getByRole("button", { name: "Remove this memory" }).click();
  await page.getByRole("button", { name: "Remove memory", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("No memories kept yet.");
  await page.reload();
  expect(await api(context, "GET", `/api/families/${family.id}/memories`)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath("family.png") });
  expect(errors).toEqual([]);
});

test("homonyms, discard, stale proposal, and session expiry", async ({ page, context }) => {
  await register(page);
  const family = (await api(context, "GET", "/api/families"))[0];
  await seed(context, family.id, "George is father of Raj.");
  await seed(context, family.id, "George is father of Maya.", { george: "new" });
  await page.reload();
  await story(page, "George is father of Leo.");
  const chooser = page.getByRole("dialog", { name: /Which George/ });
  await expect(chooser).toContainText("Parent of Raj");
  await chooser.getByRole("button", { name: "George, Parent of Raj" }).click();
  await page.getByRole("button", { name: "Looks right →" }).click();
  await page.getByText("NEW BRANCH 🌿", { exact: true }).waitFor();
  const before = await api(context, "GET", `/api/families/${family.id}/graph`);
  await story(page, "My father is Joseph.");
  await page.getByRole("button", { name: "Discard story" }).click();
  await page.getByLabel("Family story").waitFor();
  expect(await api(context, "GET", `/api/families/${family.id}/graph`)).toEqual(before);
  await story(page, "My father is Joseph.");
  await seed(context, family.id, "My mother is Leena.");
  await page.getByRole("button", { name: "Looks right →" }).click();
  await expect(page.getByText("FAMILY CHANGED", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Refresh family →" }).click();
  await page.getByLabel("Family story").waitFor();
  await api(context, "POST", "/api/auth/logout");
  await page.getByLabel("Family story").fill("My father is Joseph.");
  await page.getByRole("button", { name: "Tell Tharavadu →" }).click();
  await expect(page.getByLabel("Email address")).toBeVisible();
});

test("corrections preserve relatives and memories", async ({ page, context }) => {
  await register(page);
  const family = (await api(context, "GET", "/api/families"))[0];
  await seed(context, family.id, "My father is Joseph.");
  const graph = await api(context, "GET", `/api/families/${family.id}/graph`);
  const joseph = graph.people.find((person: { name: string }) => person.name === "Joseph");
  await api(context, "POST", `/api/families/${family.id}/memories`, { text: "A memory that survives correction.", people: [joseph.id] });
  await page.reload();
  await choose(page, "Joseph");
  await page.getByRole("button", { name: "Edit person", exact: true }).filter({ visible: true }).click();
  await page.getByRole("button", { name: /Remove link:/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Both people and their memories remain.");
  await page.getByRole("button", { name: "Remove relationship", exact: true }).click();
  await page.getByRole("button", { name: "Edit person", exact: true }).filter({ visible: true }).click();
  await page.getByRole("button", { name: "Remove this person" }).click();
  await page.getByRole("button", { name: "Remove person", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Joseph,/ })).toHaveCount(0);
  await journal(page);
  await expect(page.getByRole("dialog")).toContainText("A memory that survives correction.");
  await expect(page.getByRole("dialog")).toContainText("Family memory");
  await page.reload();
  const saved = await api(context, "GET", `/api/families/${family.id}/graph`);
  expect(saved.people.map((person: { id: string }) => person.id)).toEqual([family.self_id]);
  expect((await api(context, "GET", `/api/families/${family.id}/memories`))[0].people).toEqual([]);
});

test("family switching ignores a delayed earlier graph", async ({ page, context }) => {
  await register(page);
  const first = (await api(context, "GET", "/api/families"))[0];
  await page.getByRole("button", { name: "+ Family", exact: true }).click();
  await familyForm(page, "Second fictional family", "Nora");
  const second = (await api(context, "GET", "/api/families")).find((family: { id: string }) => family.id !== first.id);
  const select = page.locator("header select");
  let markStarted: () => void = () => undefined;
  let release: () => void = () => undefined;
  const started = new Promise<void>((resolve) => { markStarted = resolve; });
  const blocked = new Promise<void>((resolve) => { release = resolve; });
  await page.route(`**/api/families/${first.id}/graph`, async (route) => {
    markStarted();
    await blocked;
    await route.continue();
  });
  await select.selectOption(first.id);
  await started;
  await select.selectOption(second.id);
  await expect(page.getByRole("button", { name: /^Nora,/ })).toBeVisible();
  const firstResponse = page.waitForResponse((response) => response.url().includes(`/api/families/${first.id}/graph`));
  release();
  await firstResponse;
  await page.waitForTimeout(200);
  await expect(select).toHaveValue(second.id);
  await expect(page.getByRole("button", { name: /^Nora,/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Kevin,/ })).toHaveCount(0);
});

test("larger demo family and long names fit without document overflow", async ({ page, context }, testInfo) => {
  await register(page);
  const family = await api(context, "POST", "/api/families", {
    name: "Extended fictional family", person_name: "Alexandria Very Long Surname", demo: true,
  });
  await page.reload();
  await page.locator("header select").selectOption(family.id);
  await expect(page.getByRole("button", { name: /^Alexandria Very Long Surname,/ })).toBeVisible();
  await page.getByRole("button", { name: "Fit family to view" }).click();
  await expect(page.getByRole("button", { name: /^George,/ })).toBeVisible();
  const anna = page.getByRole("button", { name: /^Anna,/ });
  await expect(anna).toBeVisible();
  await expect(page.getByRole("button", { name: /^Maya,/ })).toBeVisible();
  await page.waitForTimeout(500); // Let the canvas fit animation settle before visual QA.
  const george = page.getByRole("button", { name: /^George,/ });
  const maya = page.getByRole("button", { name: /^Maya,/ });
  const annaBounds = await anna.boundingBox();
  const georgePartnerBounds = await george.boundingBox();
  expect(Math.abs(annaBounds!.y - georgePartnerBounds!.y)).toBeLessThan(georgePartnerBounds!.height);
  await expect(page.getByRole("button", { name: /^Raj,/ }).locator("svg text")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Alexandria Very Long Surname,/ }).locator("svg text")).toHaveText("YOU");
  await expect(george).toBeInViewport({ ratio: 0.8 });
  await expect(maya).toBeInViewport({ ratio: 0.8 });
  if (testInfo.project.name === "mobile") {
    const georgeBounds = await george.boundingBox();
    const controlsBounds = await page.locator(".kin-controls-bar").boundingBox();
    expect(georgeBounds!.y).toBeGreaterThanOrEqual(controlsBounds!.y + controlsBounds!.height);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath("demo-family.png") });
});
