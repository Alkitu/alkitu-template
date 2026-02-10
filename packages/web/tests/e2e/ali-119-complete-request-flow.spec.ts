import { test, expect } from '../fixtures/authenticated-fixtures';

/**
 * ALI-119 - Complete Request Workflow E2E Test
 *
 * Prueba el flujo completo end-to-end:
 * 1. ADMIN crea categoría y servicio
 * 2. CLIENT crea solicitud con título específico
 * 3. ADMIN asigna solicitud a EMPLOYEE
 * 4. EMPLOYEE completa solicitud
 *
 * VERIFICA: Los nombres de solicitudes muestran el título específico,
 * no el nombre genérico del servicio.
 */

const timestamp = Date.now();
const testData = {
  categoryName: `E2E Category ${timestamp}`,
  serviceName: `E2E Service ${timestamp}`,
  requestTitle: 'Aire roto oficina principal', // 🔴 TÍTULO ESPECÍFICO A VERIFICAR
};

test.describe.serial('ALI-119: Complete Request Management Flow', () => {

  test('Step 1: ADMIN creates category and service', async ({ authenticatedAdminPage }) => {
    const adminPage = authenticatedAdminPage;
    test.setTimeout(90000);

    // Crear categoría
    await adminPage.goto('http://localhost:3000/es/admin/catalog/categories');
    await adminPage.waitForLoadState('networkidle');

    const addCategoryBtn = adminPage.getByRole('button', { name: /add.*category|nueva.*categoría|agregar/i }).first();
    await expect(addCategoryBtn).toBeVisible({ timeout: 10000 });
    await addCategoryBtn.click();
    await adminPage.waitForTimeout(1000);

    const nameInput = adminPage.locator('input[name="name"]').first();
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill(testData.categoryName);

    const createBtn = adminPage.getByRole('button', { name: /create|crear|guardar/i }).first();
    await createBtn.click();
    await adminPage.waitForTimeout(3000);

    // Esperar a que se cierre el modal y aparezca la categoría
    await expect(adminPage.getByText(testData.categoryName).first()).toBeVisible({ timeout: 15000 });
    console.log(`✓ Category created: ${testData.categoryName}`);

    // Dar tiempo para que la UI se estabilice
    await adminPage.waitForTimeout(2000);
    await adminPage.waitForLoadState('networkidle');

    // Crear servicio - navegar directamente a la página de creación
    await adminPage.goto('http://localhost:3000/es/admin/catalog/services/create');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(1000);

    const serviceNameInput = adminPage.locator('input[name="name"]').first();
    await expect(serviceNameInput).toBeVisible({ timeout: 10000 });
    await serviceNameInput.fill(testData.serviceName);

    const categorySelect = adminPage.locator('select[name="categoryId"]').first();
    await expect(categorySelect).toBeVisible({ timeout: 5000 });
    await categorySelect.selectOption({ label: testData.categoryName });

    // Template con campo "title"
    const templateJson = JSON.stringify({
      version: '1.0',
      fields: [
        { id: 'title', type: 'text', label: 'Título', required: true },
        { id: 'description', type: 'textarea', label: 'Descripción', required: true },
      ],
    }, null, 2);

    const templateTextarea = adminPage.locator('textarea#requestTemplate').first();
    await expect(templateTextarea).toBeVisible({ timeout: 5000 });
    await templateTextarea.fill(templateJson);

    const createServiceBtn = adminPage.getByRole('button', { name: /create|crear|guardar/i }).first();
    await createServiceBtn.click();

    // Esperar navegación de vuelta a la lista
    await adminPage.waitForURL(/\/admin\/catalog\/services/, { timeout: 10000 });
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);

    await expect(adminPage.getByText(testData.serviceName).first()).toBeVisible({ timeout: 15000 });
    console.log(`✓ Service created: ${testData.serviceName}`);
  });

  test('Step 2: CLIENT creates location', async ({ authenticatedClientPage }) => {
    const clientPage = authenticatedClientPage;
    test.setTimeout(60000);

    await clientPage.goto('http://localhost:3000/es/locations');
    await clientPage.waitForLoadState('networkidle');

    const addLocationBtn = clientPage.getByRole('button', { name: /add.*location|agregar.*ubicación|nueva/i }).first();
    await expect(addLocationBtn).toBeVisible({ timeout: 10000 });
    await addLocationBtn.click();
    await clientPage.waitForTimeout(1000);

    await expect(clientPage.locator('input[name="street"]').first()).toBeVisible({ timeout: 5000 });
    await clientPage.locator('input[name="street"]').first().fill('Calle Principal 123');
    await clientPage.locator('input[name="city"]').first().fill('San José');
    await clientPage.locator('select[name="state"]').first().selectOption('SJ');
    await clientPage.locator('input[name="zip"]').first().fill('10101');

    const createBtn = clientPage.getByRole('button', { name: /create|crear|guardar/i }).first();
    await createBtn.click();
    await clientPage.waitForTimeout(3000);

    await expect(clientPage.getByText('Calle Principal 123').first()).toBeVisible({ timeout: 15000 });
    console.log('✓ Location created');
  });

  test('Step 3: CLIENT creates request with SPECIFIC TITLE', async ({ authenticatedClientPage }) => {
    const clientPage = authenticatedClientPage;
    test.setTimeout(120000);

    await clientPage.goto('http://localhost:3000/es/client/requests/new');
    await clientPage.waitForLoadState('networkidle');
    await clientPage.waitForTimeout(2000);

    // Esperar y seleccionar servicio
    await clientPage.waitForSelector('[data-testid="service-card"]', { timeout: 20000 });
    const serviceCard = clientPage
      .locator('[data-testid="service-card"]')
      .filter({ hasText: testData.serviceName })
      .first();

    await expect(serviceCard).toBeVisible({ timeout: 15000 });
    await serviceCard.click();
    await clientPage.waitForTimeout(500);

    const nextBtn1 = clientPage.getByRole('button', { name: /siguiente|next/i }).first();
    await expect(nextBtn1).toBeVisible({ timeout: 5000 });
    await nextBtn1.click();
    await clientPage.waitForTimeout(2000);

    // 🔴 LLENAR CON TÍTULO ESPECÍFICO
    // Intentar varios selectores para el campo de título
    const titleInput = clientPage.locator('input[name="title"], input[placeholder*="título"], input[type="text"]').first();
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(testData.requestTitle);

    const descriptionTextarea = clientPage.locator('textarea[name="description"], textarea[placeholder*="Describe"]').first();
    await expect(descriptionTextarea).toBeVisible({ timeout: 5000 });
    await descriptionTextarea.fill(
      'El aire acondicionado de la oficina principal no enciende desde esta mañana'
    );

    const nextBtn2 = clientPage.getByRole('button', { name: /siguiente|next/i }).first();
    await nextBtn2.click();
    await clientPage.waitForTimeout(2000);

    // Seleccionar ubicación
    await clientPage.waitForSelector('[data-testid="location-card"]', { timeout: 15000 });
    const locationCard = clientPage
      .locator('[data-testid="location-card"]')
      .filter({ hasText: 'Calle Principal 123' })
      .first();

    await expect(locationCard).toBeVisible({ timeout: 10000 });
    await locationCard.click();
    await clientPage.waitForTimeout(500);

    const nextBtn3 = clientPage.getByRole('button', { name: /siguiente|next/i }).first();
    await nextBtn3.click();
    await clientPage.waitForTimeout(2000);

    // Verificar título en pantalla de review
    await expect(clientPage.getByText(testData.requestTitle)).toBeVisible({ timeout: 10000 });

    // Enviar
    const submitBtn = clientPage.getByRole('button', { name: /enviar|submit|confirmar/i }).first();
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await submitBtn.click();
    await clientPage.waitForURL(/\/success|\/client\/requests/, { timeout: 20000 });

    console.log(`✓ Request created with title: "${testData.requestTitle}"`);
  });

  test('Step 4: ADMIN views request and verifies CORRECT TITLE', async ({ authenticatedAdminPage }) => {
    const adminPage = authenticatedAdminPage;
    test.setTimeout(60000);

    await adminPage.goto('http://localhost:3000/es/admin/requests');
    await adminPage.waitForLoadState('networkidle');

    // 🔴 VERIFICACIÓN CRÍTICA: Debe mostrar "Aire roto oficina principal" NO "E2E Service..."
    await expect(async () => {
      const refreshBtn = adminPage.locator('button[title*="Refresh"]');
      if (await refreshBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await refreshBtn.click();
        await adminPage.waitForTimeout(2000);
      } else {
        await adminPage.reload();
        await adminPage.waitForLoadState('networkidle');
      }

      await expect(adminPage.getByText(testData.requestTitle)).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000, intervals: [2000, 3000, 5000] });

    console.log(`✓ ADMIN sees CORRECT title: "${testData.requestTitle}"`);

    // 🔴 VERIFICACIÓN ADICIONAL: El nombre del servicio NO debe ser el título
    // (Opcional: verificar que el servicio aparece en otra columna)
  });

  test('Step 5: ADMIN assigns request to EMPLOYEE', async ({ authenticatedAdminPage }) => {
    const adminPage = authenticatedAdminPage;
    test.setTimeout(60000);

    await adminPage.goto('http://localhost:3000/es/admin/requests');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.waitForTimeout(2000);

    const requestRow = adminPage.getByText(testData.requestTitle).first();
    await expect(requestRow).toBeVisible({ timeout: 10000 });
    await requestRow.click();
    await adminPage.waitForLoadState('networkidle');

    const assignButton = adminPage.getByRole('button', { name: /assign|asignar/i });
    await expect(assignButton).toBeVisible({ timeout: 5000 });
    await assignButton.click();
    await adminPage.waitForTimeout(1000);

    const employeeSelect = adminPage.locator('select[name="employeeId"]');
    await employeeSelect.selectOption({ index: 1 });

    const confirmButton = adminPage.getByRole('button', { name: /confirm|confirmar/i }).last();
    await confirmButton.click();
    await adminPage.waitForTimeout(2000);

    await expect(adminPage.getByText(/ongoing|en progreso/i)).toBeVisible({ timeout: 5000 });
    console.log('✓ Request assigned to EMPLOYEE');
  });

  test('Step 6: EMPLOYEE views assigned request with CORRECT TITLE', async ({ authenticatedEmployeePage }) => {
    const employeePage = authenticatedEmployeePage;
    test.setTimeout(60000);

    await employeePage.goto('http://localhost:3000/es/employee/requests');
    await employeePage.waitForLoadState('networkidle');

    // 🔴 VERIFICAR: Employee ve el título correcto
    await expect(async () => {
      await employeePage.reload();
      await employeePage.waitForLoadState('networkidle');
      await expect(employeePage.getByText(testData.requestTitle)).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    await expect(employeePage.getByText(/ongoing|en progreso/i)).toBeVisible();
    console.log(`✓ EMPLOYEE sees assigned request: "${testData.requestTitle}"`);
  });

  test('Step 7: EMPLOYEE marks request as completed', async ({ authenticatedEmployeePage }) => {
    const employeePage = authenticatedEmployeePage;
    test.setTimeout(60000);

    await employeePage.goto('http://localhost:3000/es/employee/requests');
    await employeePage.waitForLoadState('networkidle');
    await employeePage.waitForTimeout(2000);

    const requestRow = employeePage.getByText(testData.requestTitle).first();
    await expect(requestRow).toBeVisible({ timeout: 10000 });
    await requestRow.click();
    await employeePage.waitForLoadState('networkidle');

    const completeButton = employeePage.getByRole('button', { name: /complete|completar/i });
    await expect(completeButton).toBeVisible({ timeout: 5000 });
    await completeButton.click();
    await employeePage.waitForTimeout(1000);

    const notesField = employeePage.locator('textarea[name="notes"]');
    if (await notesField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await notesField.fill('Servicio completado exitosamente. AC funcionando.');
    }

    const confirmButton = employeePage.getByRole('button', { name: /confirm|confirmar/i }).last();
    await confirmButton.click();
    await employeePage.waitForTimeout(2000);

    await expect(employeePage.getByText(/completed|completado/i)).toBeVisible({ timeout: 5000 });
    console.log('✓ Request marked as COMPLETED');
  });

  test('Step 8: ADMIN verifies completed request', async ({ authenticatedAdminPage }) => {
    const adminPage = authenticatedAdminPage;

    await adminPage.goto('http://localhost:3000/es/admin/requests');
    await adminPage.waitForLoadState('networkidle');

    const completedFilter = adminPage.getByRole('button', { name: /completed|completado/i });
    if (await completedFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await completedFilter.click();
      await adminPage.waitForTimeout(1000);
    }

    await expect(async () => {
      await adminPage.reload();
      await adminPage.waitForLoadState('networkidle');
      await expect(adminPage.getByText(testData.requestTitle)).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 20000 });

    console.log('✓ ADMIN verified completed request');
  });

  test('Step 9: CLIENT verifies completed request', async ({ authenticatedClientPage }) => {
    const clientPage = authenticatedClientPage;

    await clientPage.goto('http://localhost:3000/es/client/requests');
    await clientPage.waitForLoadState('networkidle');

    await expect(async () => {
      await clientPage.reload();
      await clientPage.waitForLoadState('networkidle');
      await expect(clientPage.getByText(testData.requestTitle)).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 20000 });

    await expect(clientPage.getByText(/completed|completado/i)).toBeVisible();
    console.log('✓ CLIENT verified request completion');
  });
});

// Cleanup
test.describe('Cleanup', () => {
  test('Clean up test data', async ({ authenticatedAdminPage, authenticatedClientPage }) => {
    test.setTimeout(60000);
    const adminPage = authenticatedAdminPage;
    const clientPage = authenticatedClientPage;

    adminPage.on('dialog', (dialog) => dialog.accept());
    clientPage.on('dialog', (dialog) => dialog.accept());

    // Delete service
    await adminPage.goto('http://localhost:3000/es/admin/catalog/services');
    await adminPage.waitForLoadState('networkidle');

    const serviceCard = adminPage.getByText(testData.serviceName).first();
    if (await serviceCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      const deleteBtn = serviceCard.locator('..').locator('button[aria-label*="Delete"]');
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await adminPage.waitForTimeout(1000);
      }
    }

    // Delete category
    await adminPage.goto('http://localhost:3000/es/admin/catalog/categories');
    await adminPage.waitForLoadState('networkidle');

    const categoryCard = adminPage.getByText(testData.categoryName).first();
    if (await categoryCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      const deleteBtn = categoryCard.locator('..').locator('button[aria-label*="Delete"]');
      if (await deleteBtn.isVisible().catch(() => false)) {
        await deleteBtn.click();
        await adminPage.waitForTimeout(1000);
      }
    }

    // Delete location
    if (!clientPage.isClosed()) {
      await clientPage.goto('http://localhost:3000/es/locations');
      await clientPage.waitForLoadState('networkidle');

      const locationCard = clientPage.getByText('Calle Principal 123').first();
      if (await locationCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        const deleteBtn = locationCard.locator('..').locator('button[aria-label*="Delete"]');
        if (await deleteBtn.isVisible().catch(() => false)) {
          await deleteBtn.click();
          await clientPage.waitForTimeout(1000);
        }
      }
    }

    console.log('✓ Cleanup completed');
  });
});
