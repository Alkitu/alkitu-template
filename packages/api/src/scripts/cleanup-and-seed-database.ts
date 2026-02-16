import { PrismaClient, UserRole, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para limpiar datos huérfanos y poblar la base de datos con datos frescos
 *
 * Pasos:
 * 1. Limpia datos huérfanos
 * 2. Borra servicios existentes (y sus requests relacionadas)
 * 3. Crea nuevas categorías y servicios con templates correctos
 * 4. Crea solicitudes con títulos específicos
 */

async function main() {
  console.log('🧹 Iniciando limpieza y población de base de datos...\n');

  try {
    // ========================================
    // PASO 1: LIMPIEZA COMPLETA
    // ========================================
    console.log('📋 PASO 1: Limpiando base de datos...');

    // Borrar todas las requests (tienen FK a services)
    const deletedAllRequests = await prisma.request.deleteMany({});
    console.log(`   ✓ Eliminadas ${deletedAllRequests.count} solicitudes`);

    // Borrar todos los servicios
    const deletedAllServices = await prisma.service.deleteMany({});
    console.log(`   ✓ Eliminados ${deletedAllServices.count} servicios`);

    // Borrar form templates existentes
    const deletedAllFormTemplates = await prisma.formTemplate.deleteMany({});
    console.log(`   ✓ Eliminados ${deletedAllFormTemplates.count} form templates`);

    // Borrar categorías existentes
    const deletedAllCategories = await prisma.category.deleteMany({});
    console.log(`   ✓ Eliminadas ${deletedAllCategories.count} categorías`);

    // ========================================
    // PASO 2: OBTENER USUARIOS Y UBICACIONES
    // ========================================
    console.log('\n📋 PASO 2: Verificando usuarios y ubicaciones...');

    // Buscar usuarios de prueba
    const clientUser = await prisma.user.findFirst({
      where: { email: 'client-e2e@alkitu.test' },
    });

    const employeeUser = await prisma.user.findFirst({
      where: { email: 'employee-e2e@alkitu.test' },
    });

    if (!clientUser || !employeeUser) {
      console.log('   ⚠️  Usuarios de prueba no encontrados. Creando...');
      // Aquí podrías crear los usuarios si no existen
      throw new Error('Usuarios de prueba (client-e2e, employee-e2e) deben existir. Ejecuta seed-test-users.ts primero.');
    }

    console.log(`   ✓ Cliente encontrado: ${clientUser.email}`);
    console.log(`   ✓ Empleado encontrado: ${employeeUser.email}`);

    // Buscar o crear una ubicación para el cliente
    let clientLocation = await prisma.workLocation.findFirst({
      where: { userId: clientUser.id },
    });

    if (!clientLocation) {
      clientLocation = await prisma.workLocation.create({
        data: {
          street: 'Calle Principal 123',
          city: 'San José',
          state: 'SJ',
          zip: '10101',
          userId: clientUser.id,
        },
      });
      console.log(`   ✓ Ubicación creada: ${clientLocation.street}`);
    } else {
      console.log(`   ✓ Ubicación encontrada: ${clientLocation.street}`);
    }

    // ========================================
    // PASO 3: CREAR NUEVAS CATEGORÍAS
    // ========================================
    console.log('\n📋 PASO 3: Creando nuevas categorías...');

    const category1 = await prisma.category.create({
      data: {
        name: 'Mantenimiento HVAC',
      },
    });
    console.log(`   ✓ Categoría creada: ${category1.name}`);

    const category2 = await prisma.category.create({
      data: {
        name: 'Limpieza',
      },
    });
    console.log(`   ✓ Categoría creada: ${category2.name}`);

    const category3 = await prisma.category.create({
      data: {
        name: 'Mantenimiento General',
      },
    });
    console.log(`   ✓ Categoría creada: ${category3.name}`);

    // ========================================
    // PASO 4: CREAR NUEVOS SERVICIOS CON TEMPLATES
    // ========================================
    console.log('\n📋 PASO 4: Creando nuevos servicios...');

    // FormTemplate 1: Reparación de Aires Acondicionados
    const formTemplate1 = await prisma.formTemplate.create({
      data: {
        name: 'Reparación de Aires Acondicionados Form',
        description: 'Template para solicitudes de reparación de aires acondicionados',
        category: 'service',
        version: '1.0.0',
        isActive: true,
        formSettings: {
          title: 'Reparación de Aires Acondicionados Request Form',
          fields: [
            {
              id: 'title',
              type: 'text',
              label: 'Título de la Solicitud',
              placeholder: 'Ej: Aire roto oficina principal',
              validation: { required: true },
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Descripción del Problema',
              placeholder: 'Describe el problema con el aire acondicionado',
              validation: { required: true },
            },
            {
              id: 'urgency',
              type: 'select',
              label: 'Urgencia',
              validation: { required: true },
              selectOptions: {
                items: [
                  { id: 'opt_baja', label: 'Baja', value: 'baja' },
                  { id: 'opt_media', label: 'Media', value: 'media' },
                  { id: 'opt_alta', label: 'Alta', value: 'alta' },
                ],
              },
            },
          ],
          submitButtonText: 'Submit Request',
        },
      },
    });

    const service1 = await prisma.service.create({
      data: {
        name: 'Reparación de Aires Acondicionados',
        categoryId: category1.id,
        formTemplateIds: [formTemplate1.id],
      },
    });
    console.log(`   ✓ Servicio creado: ${service1.name}`);

    // FormTemplate 2: Limpieza Profunda de Oficinas
    const formTemplate2 = await prisma.formTemplate.create({
      data: {
        name: 'Limpieza Profunda de Oficinas Form',
        description: 'Template para solicitudes de limpieza profunda',
        category: 'service',
        version: '1.0.0',
        isActive: true,
        formSettings: {
          title: 'Limpieza Profunda de Oficinas Request Form',
          fields: [
            {
              id: 'title',
              type: 'text',
              label: 'Título de la Solicitud',
              placeholder: 'Ej: Limpieza urgente sala de juntas',
              validation: { required: true },
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Detalles de la Limpieza',
              placeholder: 'Indica qué áreas necesitan limpieza',
              validation: { required: true },
            },
            {
              id: 'area_size',
              type: 'text',
              label: 'Tamaño del Área (m²)',
              validation: { required: false },
            },
          ],
          submitButtonText: 'Submit Request',
        },
      },
    });

    const service2 = await prisma.service.create({
      data: {
        name: 'Limpieza Profunda de Oficinas',
        categoryId: category2.id,
        formTemplateIds: [formTemplate2.id],
      },
    });
    console.log(`   ✓ Servicio creado: ${service2.name}`);

    // FormTemplate 3: Reparación de Plomería
    const formTemplate3 = await prisma.formTemplate.create({
      data: {
        name: 'Reparación de Plomería Form',
        description: 'Template para solicitudes de reparación de plomería',
        category: 'service',
        version: '1.0.0',
        isActive: true,
        formSettings: {
          title: 'Reparación de Plomería Request Form',
          fields: [
            {
              id: 'title',
              type: 'text',
              label: 'Título de la Solicitud',
              placeholder: 'Ej: Fuga de agua en baño principal',
              validation: { required: true },
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Descripción del Problema',
              placeholder: 'Describe el problema de plomería',
              validation: { required: true },
            },
          ],
          submitButtonText: 'Submit Request',
        },
      },
    });

    const service3 = await prisma.service.create({
      data: {
        name: 'Reparación de Plomería',
        categoryId: category3.id,
        formTemplateIds: [formTemplate3.id],
      },
    });
    console.log(`   ✓ Servicio creado: ${service3.name}`);

    // ========================================
    // PASO 5: CREAR SOLICITUDES CON TÍTULOS ESPECÍFICOS
    // ========================================
    console.log('\n📋 PASO 5: Creando solicitudes con títulos específicos...');

    // Solicitud 1: PENDING
    const request1 = await prisma.request.create({
      data: {
        title: 'Aire roto oficina principal', // 🔴 TÍTULO ESPECÍFICO
        userId: clientUser.id,
        serviceId: service1.id,
        locationId: clientLocation.id,
        executionDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
        templateResponses: {
          title: 'Aire roto oficina principal',
          description: 'El aire acondicionado de la oficina principal no enciende desde esta mañana. Hace mucho calor.',
          urgency: 'Alta',
        },
        note: 'Cliente reporta que el aire no enciende',
        status: RequestStatus.PENDING,
        createdBy: clientUser.id,
      },
    });
    console.log(`   ✓ Solicitud creada: "${request1.title}" (${request1.status})`);

    // Solicitud 2: ONGOING (asignada al empleado)
    const request2 = await prisma.request.create({
      data: {
        title: 'Limpieza urgente sala de juntas', // 🔴 TÍTULO ESPECÍFICO
        userId: clientUser.id,
        serviceId: service2.id,
        locationId: clientLocation.id,
        executionDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // En 2 horas
        templateResponses: {
          title: 'Limpieza urgente sala de juntas',
          description: 'Tenemos una reunión importante en 3 horas y la sala está sucia',
          area_size: '50',
        },
        note: 'Cliente solicita limpieza urgente',
        status: RequestStatus.ONGOING,
        assignedToId: employeeUser.id,
        createdBy: clientUser.id,
      },
    });
    console.log(`   ✓ Solicitud creada: "${request2.title}" (${request2.status}, asignada a ${employeeUser.email})`);

    // Solicitud 3: COMPLETED
    const request3 = await prisma.request.create({
      data: {
        title: 'Fuga de agua en baño principal', // 🔴 TÍTULO ESPECÍFICO
        userId: clientUser.id,
        serviceId: service3.id,
        locationId: clientLocation.id,
        executionDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
        templateResponses: {
          title: 'Fuga de agua en baño principal',
          description: 'Hay una fuga de agua en el lavabo del baño principal',
        },
        note: 'Fuga reparada exitosamente',
        status: RequestStatus.COMPLETED,
        assignedToId: employeeUser.id,
        createdBy: clientUser.id,
      },
    });
    console.log(`   ✓ Solicitud creada: "${request3.title}" (${request3.status})`);

    // Solicitud 4: PENDING (otro ejemplo)
    const request4 = await prisma.request.create({
      data: {
        title: 'Mantenimiento preventivo AC segundo piso', // 🔴 TÍTULO ESPECÍFICO
        userId: clientUser.id,
        serviceId: service1.id,
        locationId: clientLocation.id,
        executionDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En una semana
        templateResponses: {
          title: 'Mantenimiento preventivo AC segundo piso',
          description: 'Programar mantenimiento preventivo de los aires del segundo piso',
          urgency: 'Baja',
        },
        status: RequestStatus.PENDING,
        createdBy: clientUser.id,
      },
    });
    console.log(`   ✓ Solicitud creada: "${request4.title}" (${request4.status})`);

    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('\n✅ ¡Limpieza y población completada exitosamente!\n');
    console.log('📊 RESUMEN:');
    console.log(`   • Categorías creadas: 3`);
    console.log(`   • Servicios creados: 3`);
    console.log(`   • Solicitudes creadas: 4`);
    console.log(`   • Usuario cliente: ${clientUser.email}`);
    console.log(`   • Usuario empleado: ${employeeUser.email}`);
    console.log(`   • Ubicación: ${clientLocation.street}, ${clientLocation.city}`);
    console.log('\n🔴 VERIFICACIÓN IMPORTANTE:');
    console.log(`   Todas las solicitudes tienen TÍTULOS ESPECÍFICOS (no nombres de servicio)`);
    console.log(`   - "Aire roto oficina principal" (NO "Reparación de Aires Acondicionados")`);
    console.log(`   - "Limpieza urgente sala de juntas" (NO "Limpieza Profunda de Oficinas")`);
    console.log(`   - "Fuga de agua en baño principal" (NO "Reparación de Plomería")`);
    console.log(`   - "Mantenimiento preventivo AC segundo piso" (NO "Reparación de Aires Acondicionados")`);

  } catch (error) {
    console.error('❌ Error durante la limpieza y población:', error);
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
