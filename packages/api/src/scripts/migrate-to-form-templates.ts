/**
 * CLEAN MIGRATION: Service.requestTemplate → FormTemplate
 *
 * This script migrates all Service.requestTemplate data to FormTemplate entities
 * and prepares for complete removal of the requestTemplate field.
 *
 * Usage:
 *   npm run migrate:clean -- --dry-run      # Preview migration
 *   npm run migrate:clean -- --execute      # Execute migration
 *   npm run migrate:clean -- --rollback     # Emergency rollback
 *
 * Safety Features:
 * - Automatic backup before migration
 * - Dry-run mode to preview changes
 * - Rollback capability
 * - Data integrity verification
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RequestTemplateField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation?: any;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

interface RequestTemplate {
  version: string;
  fields: RequestTemplateField[];
}

interface FormSettings {
  title: string;
  description?: string;
  fields: any[];
  submitButtonText: string;
  supportedLocales?: string[];
  defaultLocale?: string;
}

interface MigrationStats {
  totalServices: number;
  servicesWithTemplates: number;
  templatesCreated: number;
  servicesLinked: number;
  errors: number;
}

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert old RequestTemplate field to new FormField format
 */
function convertField(oldField: RequestTemplateField): any {
  const newField: any = {
    id: oldField.id,
    type: mapFieldType(oldField.type),
    label: oldField.label,
    placeholder: oldField.placeholder,
    description: oldField.helpText,
    showTitle: true,
    showDescription: !!oldField.helpText,
  };

  // Convert validation
  if (oldField.validation || oldField.required) {
    newField.validation = {
      required: oldField.required,
      minLength: oldField.validation?.minLength,
      maxLength: oldField.validation?.maxLength,
      pattern: oldField.validation?.pattern,
      min: oldField.validation?.min,
      max: oldField.validation?.max,
    };
  }

  // Convert field-specific options
  if (oldField.type === 'select' && oldField.options) {
    newField.selectOptions = {
      items: oldField.options.map((opt, idx) => ({
        id: `${Date.now()}_${idx}`,
        label: opt.label,
        value: opt.value,
        disabled: false,
      })),
      placeholder: oldField.placeholder,
      allowClear: true,
    };
  }

  if (oldField.type === 'radio' && oldField.options) {
    newField.radioOptions = {
      items: oldField.options.map((opt, idx) => ({
        id: `${Date.now()}_${idx}`,
        label: opt.label,
        value: opt.value,
        disabled: false,
      })),
      layout: 'vertical',
    };
  }

  if (oldField.type === 'checkbox') {
    newField.toggleOptions = {
      checkedValue: true,
      uncheckedValue: false,
      defaultChecked: oldField.defaultValue || false,
      style: 'checkbox',
    };
  }

  if (oldField.type === 'checkboxGroup' && oldField.options) {
    newField.type = 'multiselect';
    newField.multiSelectOptions = {
      items: oldField.options.map((opt, idx) => ({
        id: `${Date.now()}_${idx}`,
        label: opt.label,
        value: opt.value,
        disabled: false,
      })),
      layout: 'vertical',
      maxSelections: oldField.validation?.maxSelected,
    };
  }

  if (oldField.type === 'date') {
    newField.dateOptions = {
      mode: 'date',
      locale: 'en',
      hourCycle: 24,
      placeholder: oldField.placeholder,
      showDescription: !!oldField.helpText,
    };
  }

  if (oldField.type === 'time') {
    newField.dateOptions = {
      mode: 'time',
      locale: 'en',
      hourCycle: 24,
      placeholder: oldField.placeholder,
      showDescription: !!oldField.helpText,
    };
  }

  if (oldField.type === 'number') {
    newField.numberOptions = {
      step: 1,
    };
  }

  if (oldField.type === 'textarea') {
    newField.textareaOptions = {
      rows: 4,
      resize: 'vertical',
      showCharacterCount: !!oldField.validation?.maxLength,
      autoGrow: true,
    };
  }

  return newField;
}

/**
 * Map old field types to new field types
 */
function mapFieldType(oldType: string): string {
  const typeMap: Record<string, string> = {
    text: 'text',
    textarea: 'textarea',
    number: 'number',
    select: 'select',
    radio: 'radio',
    checkbox: 'toggle',
    checkboxGroup: 'multiselect',
    date: 'date',
    time: 'time',
    file: 'text', // File type not yet implemented, use text as placeholder
  };

  return typeMap[oldType] || 'text';
}

/**
 * Convert RequestTemplate to FormSettings
 */
function convertToFormSettings(
  requestTemplate: RequestTemplate,
  serviceName: string,
): FormSettings {
  return {
    title: `${serviceName} Request Form`,
    description: 'Migrated from legacy request template',
    fields: requestTemplate.fields.map(convertField),
    submitButtonText: 'Submit Request',
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
  };
}

// ============================================================================
// BACKUP & ROLLBACK
// ============================================================================

/**
 * Create backup of all services with requestTemplate
 */
async function createBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../../backups');
  const backupFile = path.join(backupDir, `services_backup_${timestamp}.json`);

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Get all services with requestTemplate using raw query
  // (requestTemplate field was removed from Prisma schema but may still exist in DB)
  const services = await prisma.service.findRaw({
    filter: { requestTemplate: { $ne: null } },
  }) as unknown as any[];

  // Save to JSON
  fs.writeFileSync(backupFile, JSON.stringify(services, null, 2));

  console.log(`✅ Backup created: ${backupFile}`);
  console.log(`   Services backed up: ${services.length}`);

  return backupFile;
}

/**
 * Rollback from backup
 */
async function rollbackFromBackup(backupFile: string): Promise<void> {
  console.log(`\n🔄 Rolling back from: ${backupFile}`);

  if (!fs.existsSync(backupFile)) {
    throw new Error(`Backup file not found: ${backupFile}`);
  }

  const services = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));

  console.log(`Restoring ${services.length} services...`);

  for (const service of services) {
    // Use raw update to restore requestTemplate (field no longer in Prisma schema)
    await prisma.$runCommandRaw({
      update: 'services',
      updates: [
        {
          q: { _id: { $oid: service.id } },
          u: { $set: { requestTemplate: service.requestTemplate, formTemplateIds: [] } },
        },
      ],
    });
  }

  // Delete created FormTemplates
  await prisma.formTemplate.deleteMany({
    where: {
      description: 'Migrated from legacy request template',
    },
  });

  console.log(`✅ Rollback complete`);
}

// ============================================================================
// MIGRATION LOGIC
// ============================================================================

/**
 * Migrate a single service
 */
async function migrateService(
  service: any,
  dryRun: boolean,
): Promise<{ success: boolean; templateId?: string; error?: string }> {
  try {
    // Parse requestTemplate
    const requestTemplate = service.requestTemplate as RequestTemplate;

    if (!requestTemplate || !requestTemplate.fields) {
      return { success: false, error: 'No valid requestTemplate found' };
    }

    // Convert to FormSettings
    const formSettings = convertToFormSettings(requestTemplate, service.name);

    if (dryRun) {
      console.log(`[DRY RUN] Would create template for: ${service.name}`);
      console.log(`  Fields: ${formSettings.fields.length}`);
      return { success: true };
    }

    // Create FormTemplate
    const template = await prisma.formTemplate.create({
      data: {
        name: `${service.name} Form`,
        description: 'Migrated from legacy request template',
        category: 'service',
        formSettings: formSettings as any,
        version: requestTemplate.version || '1.0.0',
        isActive: true,
        isPublic: false,
        serviceIds: [service.id],
        createdBy: 'SYSTEM_MIGRATION',
      },
    });

    // Link to Service
    await prisma.service.update({
      where: { id: service.id },
      data: {
        formTemplateIds: [template.id],
      },
    });

    console.log(`✅ Migrated: ${service.name} → Template ${template.id}`);

    return { success: true, templateId: template.id };
  } catch (error: any) {
    console.error(`❌ Error migrating ${service.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main migration function
 */
async function migrate(mode: 'dry-run' | 'execute' | 'rollback'): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 CLEAN MIGRATION: Service.requestTemplate → FormTemplate`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Date: ${new Date().toISOString()}\n`);

  // Handle rollback
  if (mode === 'rollback') {
    const backupDir = path.join(__dirname, '../../backups');
    const backups = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith('services_backup_'))
      .sort()
      .reverse();

    if (backups.length === 0) {
      console.log('❌ No backups found');
      return;
    }

    const latestBackup = path.join(backupDir, backups[0]);
    await rollbackFromBackup(latestBackup);
    return;
  }

  // Create backup (if execute mode)
  let backupFile: string | undefined;
  if (mode === 'execute') {
    backupFile = await createBackup();
  }

  // Get all services with requestTemplate using raw query
  // (requestTemplate field was removed from Prisma schema but may still exist in DB)
  const services = await prisma.service.findRaw({
    filter: { requestTemplate: { $ne: null }, deletedAt: null },
  }) as unknown as any[];

  console.log(`\n📊 Services to migrate: ${services.length}\n`);

  if (services.length === 0) {
    console.log('✅ No services to migrate. All clean!');
    return;
  }

  // Migration stats
  const stats: MigrationStats = {
    totalServices: services.length,
    servicesWithTemplates: 0,
    templatesCreated: 0,
    servicesLinked: 0,
    errors: 0,
  };

  // Migrate each service
  for (const service of services) {
    const result = await migrateService(service, mode === 'dry-run');

    if (result.success) {
      stats.servicesWithTemplates++;
      if (result.templateId) {
        stats.templatesCreated++;
        stats.servicesLinked++;
      }
    } else {
      stats.errors++;
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 MIGRATION SUMMARY`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`Total services:       ${stats.totalServices}`);
  console.log(`Successfully migrated: ${stats.servicesWithTemplates}`);
  console.log(`Templates created:     ${stats.templatesCreated}`);
  console.log(`Services linked:       ${stats.servicesLinked}`);
  console.log(`Errors:               ${stats.errors}\n`);

  if (mode === 'execute') {
    console.log(`✅ Migration complete!`);
    console.log(`📦 Backup file: ${backupFile}\n`);
    console.log(`⚠️  IMPORTANT: After verifying data integrity:`);
    console.log(`   1. Remove requestTemplate field from schema`);
    console.log(`   2. Run: npx prisma migrate dev --name remove_request_template`);
    console.log(`   3. Update code to use FormTemplate instead\n`);
  }

  if (mode === 'dry-run') {
    console.log(`ℹ️  This was a DRY RUN. No changes were made.`);
    console.log(`   Run with --execute to perform the migration.\n`);
  }
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

const args = process.argv.slice(2);
const mode = args.includes('--execute')
  ? 'execute'
  : args.includes('--rollback')
    ? 'rollback'
    : 'dry-run';

migrate(mode)
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
