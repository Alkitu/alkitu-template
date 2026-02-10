import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRequestTitles() {
  console.log('🔄 Iniciando migración de títulos de solicitudes...');

  // Buscar requests sin título o con título por defecto
  const requests = await prisma.request.findMany({
    where: {
      OR: [
        { title: '' },
        { title: 'Nueva Solicitud' },
      ],
    },
    include: {
      service: true,
    },
  });

  console.log(`📊 Encontradas ${requests.length} solicitudes para migrar`);

  let migrated = 0;
  for (const request of requests) {
    let title = 'Nueva Solicitud';

    // Intentar extraer título de templateResponses
    if (request.templateResponses && typeof request.templateResponses === 'object') {
      const responses = request.templateResponses as any;
      if (responses.title && typeof responses.title === 'string') {
        title = responses.title;
      }
    }

    // Fallback: Usar nombre del servicio + fecha
    if (title === 'Nueva Solicitud' && request.service) {
      const date = new Date(request.createdAt).toLocaleDateString('es-ES');
      title = `${request.service.name} - ${date}`;
    }

    await prisma.request.update({
      where: { id: request.id },
      data: { title },
    });

    migrated++;
    if (migrated % 10 === 0) {
      console.log(`✓ Migradas ${migrated}/${requests.length} solicitudes...`);
    }
  }

  console.log(`✅ Migración completada: ${migrated} solicitudes actualizadas`);
}

migrateRequestTitles()
  .catch((e) => {
    console.error('❌ Error en migración:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
