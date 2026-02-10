import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para verificar que los datos en la base de datos son correctos
 * y que las solicitudes tienen títulos específicos (NO nombres de servicio)
 */

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 VERIFICACIÓN DE BASE DE DATOS - ALI-119');
  console.log('='.repeat(70) + '\n');

  try {
    // Verificar solicitudes
    const requests = await prisma.request.findMany({
      include: {
        service: true,
        user: true,
        location: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Total de solicitudes en base de datos: ${requests.length}\n`);

    if (requests.length === 0) {
      console.log('⚠️  No hay solicitudes en la base de datos');
      console.log('   Ejecuta: npx ts-node src/scripts/cleanup-and-seed-database.ts\n');
      return;
    }

    console.log('📋 SOLICITUDES ENCONTRADAS:\n');

    requests.forEach((request, index) => {
      console.log(`${index + 1}. ID: ${request.id}`);
      console.log(`   🔴 TÍTULO: "${request.title}"`); // Campo title específico
      console.log(`   📦 SERVICIO: "${request.service.name}"`); // Nombre del servicio
      console.log(`   👤 CLIENTE: ${request.user.email}`);
      console.log(`   📍 UBICACIÓN: ${request.location.street}, ${request.location.city}`);
      console.log(`   📅 ESTADO: ${request.status}`);
      if (request.assignedTo) {
        console.log(`   👷 ASIGNADO A: ${request.assignedTo.email}`);
      }
      console.log(`   🕐 FECHA EJECUCIÓN: ${request.executionDateTime.toLocaleDateString()}`);
      console.log('');
    });

    // Verificación crítica
    console.log('='.repeat(70));
    console.log('✅ VERIFICACIÓN CRÍTICA - TÍTULOS vs NOMBRES DE SERVICIO');
    console.log('='.repeat(70) + '\n');

    let allCorrect = true;

    requests.forEach((request) => {
      const titleMatchesService = request.title === request.service.name;
      const icon = titleMatchesService ? '❌' : '✅';
      const status = titleMatchesService ? 'INCORRECTO' : 'CORRECTO';

      console.log(`${icon} ${status}:`);
      console.log(`   Título: "${request.title}"`);
      console.log(`   Servicio: "${request.service.name}"`);
      console.log(`   ${titleMatchesService ? 'El título es igual al nombre del servicio (PROBLEMA)' : 'El título es diferente al nombre del servicio (CORRECTO)'}\n`);

      if (titleMatchesService) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      console.log('='.repeat(70));
      console.log('🎉 ¡ÉXITO! Todas las solicitudes tienen títulos ESPECÍFICOS');
      console.log('='.repeat(70));
      console.log('\n📊 RESUMEN:');
      console.log('   • ✅ Campo "title" implementado correctamente en modelo Request');
      console.log('   • ✅ Títulos específicos guardados en base de datos');
      console.log('   • ✅ Títulos diferentes de nombres de servicio');
      console.log('\n🔴 NOTA IMPORTANTE:');
      console.log('   El frontend actualmente usa datos MOCK.');
      console.log('   Una vez que el frontend se conecte al backend real,');
      console.log('   los títulos específicos se mostrarán correctamente.\n');
    } else {
      console.log('❌ ERROR: Algunas solicitudes tienen títulos iguales a nombres de servicio');
    }

  } catch (error) {
    console.error('❌ Error al verificar base de datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  });
