import { test, expect } from '@playwright/test';

test.describe('Postcard Panel Behavior', () => {
  test('should show postcard panel after clicking Enable location access', async ({ page, context }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation']);

    // Set a mock geolocation
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });

    // Navigate to the homepage
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });

    // Wait for the globe to be ready
    await page.waitForSelector('canvas.mapboxgl-canvas', { timeout: 10000 });

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/01-initial-state.png', fullPage: true });

    // Find and click the "Enable location access" button
    const enableButton = page.getByRole('button', { name: /enable location access/i });
    await expect(enableButton).toBeVisible();

    await enableButton.click();

    // Wait for the postcard panel to appear
    // The postcard panel should be in an aside element with the postcard graphic
    await page.waitForTimeout(2000); // Give time for animations and API calls

    // Take screenshot after clicking
    await page.screenshot({ path: 'tests/screenshots/02-after-enable-click.png', fullPage: true });

    // Check if the layout has changed to side-by-side
    const section = page.locator('main > section').first();
    const sectionStyle = await section.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        flexDirection: styles.flexDirection,
        display: styles.display,
      };
    });

    console.log('Section styles:', sectionStyle);

    // Check if the globe container has shrunk (should be 60% width in side-by-side layout)
    const globeContainer = section.locator('div').first();
    const globeStyle = await globeContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        flex: styles.flex,
        width: styles.width,
      };
    });

    console.log('Globe container styles:', globeStyle);

    // Check if the postcard panel (aside) is visible
    const postcardPanel = page.locator('aside');
    await expect(postcardPanel).toBeVisible();

    // Take screenshot showing the postcard panel
    await page.screenshot({ path: 'tests/screenshots/03-postcard-panel-visible.png', fullPage: true });

    // Get the postcard panel dimensions
    const postcardBoundingBox = await postcardPanel.boundingBox();
    console.log('Postcard panel bounding box:', postcardBoundingBox);

    // Check if the "Send a postcard" stamp button is visible
    const sendPostcardButton = page.getByRole('button', { name: /send a postcard/i });
    await expect(sendPostcardButton).toBeVisible();

    // Check if the "Register interest" button is visible
    const registerInterestButton = page.getByRole('button', { name: /register interest/i });
    await expect(registerInterestButton).toBeVisible();

    // Verify the postcard graphic SVG is present
    const postcardGraphic = postcardPanel.locator('svg');
    await expect(postcardGraphic).toBeVisible();

    // Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/04-final-state.png', fullPage: true });

    // Verify the map has resized correctly by checking if the mapbox canvas is visible
    const mapboxCanvas = page.locator('canvas.mapboxgl-canvas');
    await expect(mapboxCanvas).toBeVisible();

    const canvasBoundingBox = await mapboxCanvas.boundingBox();
    console.log('Mapbox canvas bounding box:', canvasBoundingBox);
  });

  test('should toggle register interest form', async ({ page, context }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });

    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas.mapboxgl-canvas', { timeout: 10000 });

    // Click enable location access
    const enableButton = page.getByRole('button', { name: /enable location access/i });
    await enableButton.click();
    await page.waitForTimeout(2000);

    // Click register interest
    const registerInterestButton = page.getByRole('button', { name: /register interest/i });
    await registerInterestButton.click();

    // Verify the form appears
    const nameInput = page.getByLabel(/name/i);
    const emailInput = page.getByLabel(/email address/i);

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Take screenshot of the form
    await page.screenshot({ path: 'tests/screenshots/05-register-form.png', fullPage: true });

    // Fill in the form
    await nameInput.fill('Test User');
    await emailInput.fill('test@example.com');

    // Submit the form
    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();

    // Verify confirmation message
    await expect(page.getByText(/thanks! we'll be in touch soon/i)).toBeVisible();

    // Take screenshot of confirmation
    await page.screenshot({ path: 'tests/screenshots/06-register-confirmation.png', fullPage: true });
  });
});
