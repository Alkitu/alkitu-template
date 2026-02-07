import { PrismaClient, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding requests data...');

  try {
    // 1. Buscar o crear usuario CLIENT
    const user = await prisma.user.findFirst({
      where: { email: 'luiseum95@gmail.com' },
    });

    if (!user) {
      console.error('❌ User not found. Please login first.');
      return;
    }

    console.log('✅ Found user:', user.email);

    // 2. Crear categoría
    const category = await prisma.category.upsert({
      where: { name: 'Mantenimiento' },
      update: {},
      create: {
        name: 'Mantenimiento',
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    console.log('✅ Created category:', category.name);

    // 3. Buscar o crear servicios existentes
    let service1 = await prisma.service.findFirst({
      where: { name: 'Reparación de Aires Acondicionados' },
    });

    if (!service1) {
      service1 = await prisma.service.create({
        data: {
          name: 'Reparación de Aires Acondicionados',
          categoryId: category.id,
          requestTemplate: {
            fields: [
              {
                id: 'issue_description',
                type: 'textarea',
                label: 'Descripción del problema',
                required: true,
              },
              {
                id: 'urgency',
                type: 'select',
                label: 'Urgencia',
                options: ['Baja', 'Media', 'Alta'],
                required: true,
              },
            ],
          },
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
    }

    let service2 = await prisma.service.findFirst({
      where: { name: 'Limpieza de Oficinas' },
    });

    if (!service2) {
      service2 = await prisma.service.create({
        data: {
          name: 'Limpieza de Oficinas',
          categoryId: category.id,
          requestTemplate: {
            fields: [
              {
                id: 'area_size',
                type: 'number',
                label: 'Tamaño del área (m²)',
                required: true,
              },
              {
                id: 'cleaning_type',
                type: 'select',
                label: 'Tipo de limpieza',
                options: ['General', 'Profunda', 'Mantenimiento'],
                required: true,
              },
            ],
          },
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
    }

    console.log('✅ Created services:', service1.name, service2.name);

    // 4. Buscar o crear ubicación de trabajo
    let location = await prisma.workLocation.findFirst({
      where: {
        userId: user.id,
        street: '123 Main Street',
      },
    });

    if (!location) {
      location = await prisma.workLocation.create({
        data: {
          userId: user.id,
          street: '123 Main Street',
          city: 'New York',
          zip: '10001',
          state: 'NY',
          building: 'Building A',
          floor: '5',
          unit: '501',
        },
      });
    }

    console.log('✅ Created work location:', location.street);

    // 5. Crear solicitudes de prueba con diferentes estados
    const requests = await Promise.all([
      // PENDING request
      prisma.request.create({
        data: {
          userId: user.id,
          serviceId: service1.id,
          locationId: location.id,
          executionDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
          templateResponses: {
            issue_description: 'El aire acondicionado no enfría correctamente',
            urgency: 'Alta',
          },
          note: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Necesito que revisen el sistema completo',
                  },
                ],
              },
            ],
          },
          status: RequestStatus.PENDING,
          createdBy: user.id,
        },
      }),

      // ONGOING request
      prisma.request.create({
        data: {
          userId: user.id,
          serviceId: service2.id,
          locationId: location.id,
          executionDateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // En 1 día
          templateResponses: {
            area_size: 150,
            cleaning_type: 'Profunda',
          },
          status: RequestStatus.ONGOING,
          assignedToId: user.id, // Asignado al mismo usuario para demo
          createdBy: user.id,
        },
      }),

      // COMPLETED request
      prisma.request.create({
        data: {
          userId: user.id,
          serviceId: service1.id,
          locationId: location.id,
          executionDateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
          templateResponses: {
            issue_description: 'Mantenimiento preventivo mensual',
            urgency: 'Media',
          },
          status: RequestStatus.COMPLETED,
          assignedToId: user.id,
          completedAt: new Date(),
          createdBy: user.id,
        },
      }),

      // CANCELLED request
      prisma.request.create({
        data: {
          userId: user.id,
          serviceId: service2.id,
          locationId: location.id,
          executionDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // En 5 días
          templateResponses: {
            area_size: 80,
            cleaning_type: 'General',
          },
          status: RequestStatus.CANCELLED,
          cancellationRequested: true,
          cancellationRequestedAt: new Date(),
          createdBy: user.id,
        },
      }),

      // More PENDING requests for pagination test
      prisma.request.create({
        data: {
          userId: user.id,
          serviceId: service1.id,
          locationId: location.id,
          executionDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          templateResponses: {
            issue_description: 'Instalación de nuevo equipo',
            urgency: 'Baja',
          },
          status: RequestStatus.PENDING,
          createdBy: user.id,
        },
      }),
    ]);

    console.log(`✅ Created ${requests.length} requests`);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Category: ${category.name}`);
    console.log(`   - Services: ${service1.name}, ${service2.name}`);
    console.log(`   - Location: ${location.street}, ${location.city}`);
    console.log(`   - Requests: ${requests.length} total`);
    console.log('');
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
