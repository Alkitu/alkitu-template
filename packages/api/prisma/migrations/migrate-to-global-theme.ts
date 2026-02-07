/**
 * Migration Script: Migrate to Global Platform Theme
 *
 * Changes:
 * - Rename userId → createdById (semantic change only - for audit)
 * - Ensure only ONE theme is active platform-wide
 * - Select priority: isDefault → isActive → most recent
 */

import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  console.log('🚀 Starting migration to global platform theme...');

  try {
    // 1. Obtener todos los temas
    const allThemes = await prisma.theme.findMany();
    const activeThemes = allThemes.filter(t => t.isActive);
    const defaultThemes = allThemes.filter(t => t.isDefault);

    console.log(`📊 Database status:`);
    console.log(`   Total themes: ${allThemes.length}`);
    console.log(`   Currently active: ${activeThemes.length}`);
    console.log(`   Marked as default: ${defaultThemes.length}`);

    if (allThemes.length === 0) {
      console.warn('⚠️  No themes found in database. Migration complete (no-op).');
      await prisma.$disconnect();
      return;
    }

    // 2. Seleccionar tema global
    // Prioridad: isDefault → isActive → más reciente
    let selectedTheme = defaultThemes[0] ||
                       activeThemes[0] ||
                       allThemes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

    console.log(`\n🎯 Selected theme as global active theme:`);
    console.log(`   ID: ${selectedTheme.id}`);
    console.log(`   Name: ${selectedTheme.name}`);
    console.log(`   Was default: ${selectedTheme.isDefault}`);
    console.log(`   Was active: ${selectedTheme.isActive}`);

    // 3. Migrar campo userId → createdById (solo semántica, Prisma schema ya cambió)
    console.log(`\n🔄 Migrating userId references to createdById...`);
    const themesWithUserId = allThemes.filter(t => (t as any).userId);
    console.log(`   Found ${themesWithUserId.length} themes with userId field`);

    // NOTA: Como el schema ya cambió de userId a createdById,
    // Prisma automáticamente maneja este cambio al aplicar la migración.
    // Este script solo valida que los datos sean correctos.

    // 4. Desactivar TODOS los temas
    console.log(`\n❌ Deactivating all themes...`);
    await prisma.theme.updateMany({
      where: {},
      data: { isActive: false, isDefault: false },
    });
    console.log(`   ✅ All themes deactivated`);

    // 5. Activar el tema seleccionado
    console.log(`\n✅ Activating selected theme...`);
    await prisma.theme.update({
      where: { id: selectedTheme.id },
      data: { isActive: true },
    });
    console.log(`   ✅ Theme "${selectedTheme.name}" is now the global active theme`);

    // 6. Validar: Solo uno activo
    console.log(`\n🔍 Validating migration...`);
    const finalActive = await prisma.theme.findMany({ where: { isActive: true } });

    if (finalActive.length !== 1) {
      throw new Error(`❌ Migration validation failed: ${finalActive.length} active themes found (expected 1)`);
    }

    console.log(`   ✅ Validation successful: Exactly 1 active theme`);
    console.log(`\n✨ Migration completed successfully!`);
    console.log(`\nActive theme: ${finalActive[0].name} (${finalActive[0].id})`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n✅ Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });
