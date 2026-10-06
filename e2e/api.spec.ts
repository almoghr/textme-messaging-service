import { expect, test } from '@playwright/test';

test.describe('TextMe Service API Endpoints', () => {
  test('GET /api/health should return ok and service metadata', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('textme-service');
    expect(body.message_he).toBe('המערכת פועלת כסדרה');
  });

  test('POST /api/webhooks/delivery-report should return acknowledgement', async ({ request }) => {
    const response = await request.post('/api/webhooks/delivery-report', {
      data: {
        external_id: 'pw-test-1',
        status: '0',
        phone: '0501234567',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.received).toBe(true);
    expect(body.timestamp).toBeDefined();
    expect(body.message_he).toBeDefined();
  });

  test('POST /api/webhooks/incoming-message should return acknowledgement', async ({ request }) => {
    const response = await request.post('/api/webhooks/incoming-message', {
      data: {
        phone: '0501234567',
        dest: '0509999999',
        message: 'Hello from Playwright',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.received).toBe(true);
    expect(body.message_he).toBeDefined();
  });

  test('POST /api/webhooks/blocklist-addition should return acknowledgement', async ({ request }) => {
    const response = await request.post('/api/webhooks/blocklist-addition', {
      data: {
        dest: '0501234567',
        message: 'Stop',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.received).toBe(true);
    expect(body.message_he).toBeDefined();
  });

  test('POST /api/tokens/current should validate request body and return Hebrew message', async ({ request }) => {
    const response = await request.post('/api/tokens/current', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message_he).toBeDefined();
    expect(typeof body.message_he).toBe('string');
  });
});
