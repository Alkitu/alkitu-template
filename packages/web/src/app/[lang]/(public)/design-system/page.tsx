// 'use client';

// import React, { useState, useMemo } from 'react';

// // Importaciones centralizadas desde el índice de átomos
// import {
//   Typography,
//   Icon,
//   Badge,
//   Button,
//   Input,
//   Brand,
// } from '@/components/atoms';
// import { ScrollArea } from '@/components/ui/scroll-area';

// // Contexto de branding
// import { BrandingProvider } from '@/context/BrandingContext';

// // Componentes del sistema
// import ComponentDemo from '@/components/system/ComponentDemo';
// import ComponentSpecs from '@/components/system/ComponentSpecs';
// import {
//   componentsData,
//   componentCategories,
//   ComponentKey,
// } from '@/components/data/componentsData';

// export default function App() {
//   const [selectedComponent, setSelectedComponent] =
//     useState<ComponentKey>('Design Tokens');
//   const [activeSection, setActiveSection] = useState<'demo' | 'specs'>('demo');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

//   const categoryColors = {
//     'Design System': 'primary',
//     Atoms: 'success',
//     Molecules: 'warning',
//     Organisms: 'secondary',
//     Templates: 'neutral',
//   } as const;

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'Design System':
//         return 'Palette';
//       case 'Atoms':
//         return 'Circle';
//       case 'Molecules':
//         return 'Hexagon';
//       case 'Organisms':
//         return 'Layers';
//       case 'Templates':
//         return 'LayoutGrid';
//       default:
//         return 'Folder';
//     }
//   };

//   // Check if current component has mobile version
//   const currentComponentHasMobile =
//     componentsData[selectedComponent]?.hasMobileVersion || false;

//   // Función para obtener la ruta del componente
//   const getComponentPath = (
//     componentName: ComponentKey,
//     isMobile = false,
//   ): string => {
//     const component = componentsData[componentName];

//     if (!component) return '';

//     // Casos especiales
//     if (componentName === 'Design Tokens') {
//       return './src/themes/tokens.ts';
//     }

//     if (componentName === 'Branding') {
//       return './src/components/demos/system/BrandingDemo.tsx';
//     }

//     // Mapeo de categorías a directorios
//     const categoryToPath = {
//       Atoms: 'atoms',
//       Molecules: 'molecules',
//       Organisms: 'organisms',
//       Templates: 'templates',
//     };

//     const pathPrefix =
//       categoryToPath[component.category as keyof typeof categoryToPath];

//     if (!pathPrefix) return '';

//     // Convertir nombre del componente a nombre de archivo
//     let fileName = componentName;

//     // Casos especiales para templates que tienen "Page" en el nombre
//     if (component.category === 'Templates') {
//       if (componentName.includes('Page')) {
//         fileName = componentName.replace(' ', '');
//       }
//     }

//     // Agregar sufijo Mobile si es versión móvil
//     if (isMobile && component.hasMobileVersion) {
//       fileName += 'Mobile';
//     }

//     return `./src/components/${pathPrefix}/${fileName}.tsx`;
//   };

//   // Función para copiar ruta al portapapeles
//   const copyPathToClipboard = async (path: string) => {
//     try {
//       await navigator.clipboard.writeText(path);
//       // Aquí podrías agregar un toast notification si tienes configurado
//     } catch (err) {
//       console.error('Error al copiar al portapapeles:', err);
//     }
//   };

//   // Filtrar componentes basado en el término de búsqueda
//   const filteredCategories = useMemo(() => {
//     if (!searchTerm.trim()) {
//       return componentCategories;
//     }

//     const filtered: Record<string, string[]> = {};
//     const lowercaseSearch = searchTerm.toLowerCase();

//     (
//       Object.entries(componentCategories) as [
//         keyof typeof componentCategories,
//         string[],
//       ][]
//     ).forEach(([category, components]) => {
//       const matchingComponents = components.filter((component) =>
//         component.toLowerCase().includes(lowercaseSearch),
//       );

//       if (matchingComponents.length > 0) {
//         filtered[category as keyof typeof componentCategories] =
//           matchingComponents;
//       }
//     });

//     return filtered;
//   }, [searchTerm]);

//   // Función para resaltar coincidencias en el texto
//   const highlightMatch = (text: string, searchTerm: string) => {
//     if (!searchTerm.trim()) {
//       return text;
//     }

//     const regex = new RegExp(
//       `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
//       'gi',
//     );
//     const parts = text.split(regex);

//     return (
//       <>
//         {parts.map((part, index) =>
//           regex.test(part) ? (
//             <span
//               key={index}
//               className="bg-design-primary/20 text-design-primary font-medium rounded px-1"
//             >
//               {part}
//             </span>
//           ) : (
//             part
//           ),
//         )}
//       </>
//     );
//   };

//   // Limpiar búsqueda
//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   // Contar total de resultados
//   const totalResults = useMemo(() => {
//     return Object.values(filteredCategories).reduce(
//       (total, components) => total + components.length,
//       0,
//     );
//   }, [filteredCategories]);

//   // Reset view mode when selecting component without mobile version
//   const handleComponentSelect = (component: ComponentKey) => {
//     setSelectedComponent(component);
//     const hasMobile =
//       componentsData[component as ComponentKey]?.hasMobileVersion || false;
//     if (!hasMobile && viewMode === 'mobile') {
//       setViewMode('desktop');
//     }
//   };

//   return (
//     <BrandingProvider>
//       <div className="min-h-screen bg-background flex">
//         {/* Sidebar */}
//         <aside className="w-80 bg-card border-r border-border flex flex-col h-screen">
//           {/* Header */}
//           <div className="p-6 border-b border-border flex-shrink-0">
//             <div className="flex items-center space-x-3 mb-4">
//               <Brand variant="horizontal" size="md" />
//             </div>
//             <div className="mt-2">
//               <Typography variant="p" size="sm" color="muted">
//                 Design System Explorer
//               </Typography>
//             </div>

//             <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
//               <Icon name="BookOpen" size="sm" />
//               <span>Explorador de Componentes</span>
//             </div>

//             {/* Buscador */}
//             <div className="relative">
//               <div className="relative">
//                 <Icon
//                   name="Search"
//                   size="sm"
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
//                 />
//                 <Input
//                   placeholder="Buscar componentes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-10 h-9 text-sm bg-neutral-200 border-border focus:border-design-primary"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     <Icon name="X" size="sm" />
//                   </button>
//                 )}
//               </div>

//               {searchTerm && (
//                 <div className="mt-2 text-xs text-muted-foreground">
//                   {totalResults > 0 ? (
//                     <span>
//                       {totalResults} resultado
//                       {totalResults !== 1 ? 's' : ''} encontrado
//                       {totalResults !== 1 ? 's' : ''}
//                     </span>
//                   ) : (
//                     <span>No se encontraron componentes</span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation - Con ScrollArea */}
//           <div className="flex-1 min-h-0">
//             <ScrollArea className="h-full">
//               <div className="px-4 py-6">
//                 {Object.keys(filteredCategories).length > 0 ? (
//                   <div className="space-y-6">
//                     {Object.entries(filteredCategories).map(
//                       ([category, components]) => (
//                         <div key={category}>
//                           <div className="flex items-center space-x-2 mb-3">
//                             <Icon
//                               name={getCategoryIcon(category) as any}
//                               size="sm"
//                               color={
//                                 categoryColors[
//                                   category as keyof typeof categoryColors
//                                 ] as any
//                               }
//                             />
//                             <Typography variant="h4" weight="medium" size="sm">
//                               {category}
//                             </Typography>
//                             <Badge
//                               variant={
//                                 categoryColors[
//                                   category as keyof typeof categoryColors
//                                 ] as any
//                               }
//                               size="sm"
//                             >
//                               {components.length}
//                             </Badge>
//                           </div>

//                           <div className="space-y-1 ml-6">
//                             {components.map((component) => {
//                               const hasMobile =
//                                 componentsData[component as ComponentKey]
//                                   ?.hasMobileVersion || false;
//                               return (
//                                 <div key={component} className="relative">
//                                   <Button
//                                     variant={
//                                       selectedComponent === component
//                                         ? 'primary'
//                                         : 'ghost'
//                                     }
//                                     size="sm"
//                                     onClick={() =>
//                                       handleComponentSelect(
//                                         component as ComponentKey,
//                                       )
//                                     }
//                                     className={`w-full justify-start h-8 px-3 text-left ${
//                                       selectedComponent === component
//                                         ? ''
//                                         : 'text-foreground hover:bg-accent'
//                                     }`}
//                                   >
//                                     <span className="truncate flex-1">
//                                       {highlightMatch(component, searchTerm)}
//                                     </span>
//                                     {hasMobile && (
//                                       <Icon
//                                         name="Smartphone"
//                                         size="xs"
//                                         className="ml-2 text-design-primary opacity-70"
//                                       />
//                                     )}
//                                   </Button>
//                                 </div>
//                               );
//                             })}
//                           </div>

//                           {Object.keys(filteredCategories).indexOf(category) <
//                             Object.keys(filteredCategories).length - 1 && (
//                             <div className="border-t border-border mt-4"></div>
//                           )}
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 ) : searchTerm ? (
//                   <div className="text-center py-12">
//                     <Icon
//                       name="Search"
//                       size="lg"
//                       className="mx-auto mb-3 text-muted-foreground"
//                     />
//                     <Typography variant="h4" weight="medium" className="mb-2">
//                       No se encontraron componentes
//                     </Typography>
//                     <Typography
//                       variant="p"
//                       size="sm"
//                       color="muted"
//                       className="mb-4"
//                     >
//                       No hay componentes que coincidan con &quot;{searchTerm}
//                       &quot;
//                     </Typography>
//                     <Button variant="outline" size="sm" onClick={clearSearch}>
//                       Limpiar búsqueda
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {Object.entries(componentCategories).map(
//                       ([category, components]) => (
//                         <div key={category}>
//                           <div className="flex items-center space-x-2 mb-3">
//                             <Icon
//                               name={getCategoryIcon(category) as any}
//                               size="sm"
//                               color={
//                                 categoryColors[
//                                   category as keyof typeof categoryColors
//                                 ] as any
//                               }
//                             />
//                             <Typography variant="h4" weight="medium" size="sm">
//                               {category}
//                             </Typography>
//                             <Badge
//                               variant={
//                                 categoryColors[
//                                   category as keyof typeof categoryColors
//                                 ] as any
//                               }
//                               size="sm"
//                             >
//                               {components.length}
//                             </Badge>
//                           </div>

//                           <div className="space-y-1 ml-6">
//                             {components.map((component) => {
//                               const hasMobile =
//                                 componentsData[component as ComponentKey]
//                                   ?.hasMobileVersion || false;
//                               return (
//                                 <div key={component} className="relative">
//                                   <Button
//                                     variant={
//                                       selectedComponent === component
//                                         ? 'primary'
//                                         : 'ghost'
//                                     }
//                                     size="sm"
//                                     onClick={() =>
//                                       handleComponentSelect(
//                                         component as ComponentKey,
//                                       )
//                                     }
//                                     className={`w-full justify-start h-8 px-3 text-left ${
//                                       selectedComponent === component
//                                         ? ''
//                                         : 'text-foreground hover:bg-accent'
//                                     }`}
//                                   >
//                                     <span className="truncate flex-1">
//                                       {component}
//                                     </span>
//                                     {hasMobile && (
//                                       <Icon
//                                         name="Smartphone"
//                                         size="xs"
//                                         className="ml-2 text-design-primary opacity-70"
//                                       />
//                                     )}
//                                   </Button>
//                                 </div>
//                               );
//                             })}
//                           </div>

//                           {Object.keys(componentCategories).indexOf(category) <
//                             Object.keys(componentCategories).length - 1 && (
//                             <div className="border-t border-border mt-4"></div>
//                           )}
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Footer */}
//           <div className="p-4 border-t border-border flex-shrink-0">
//             <div className="text-center">
//               <Typography variant="p" size="xs" color="muted">
//                 v1.0.0 • Mobile-First Design System
//               </Typography>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Top Bar */}
//           <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
//             <div>
//               <div className="flex items-center space-x-3 mb-1">
//                 <Typography variant="h2" weight="medium">
//                   {selectedComponent}
//                 </Typography>
//                 {currentComponentHasMobile && (
//                   <Badge variant="primary" size="sm">
//                     Mobile Ready
//                   </Badge>
//                 )}
//               </div>
//               <Typography variant="p" size="sm" color="muted">
//                 {componentsData[selectedComponent as ComponentKey]?.description}
//               </Typography>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* View Mode Toggle - Solo mostrar si el componente tiene versión móvil */}
//               {currentComponentHasMobile && activeSection === 'demo' && (
//                 <div className="flex items-center space-x-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
//                   <Button
//                     variant={viewMode === 'desktop' ? 'primary' : 'ghost'}
//                     size="sm"
//                     onClick={() => setViewMode('desktop')}
//                     icon="Monitor"
//                     className="h-7 px-2"
//                   >
//                     Desktop
//                   </Button>
//                   <Button
//                     variant={viewMode === 'mobile' ? 'primary' : 'ghost'}
//                     size="sm"
//                     onClick={() => setViewMode('mobile')}
//                     icon="Smartphone"
//                     className="h-7 px-2"
//                   >
//                     Mobile
//                   </Button>
//                 </div>
//               )}

//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant={activeSection === 'demo' ? 'primary' : 'outline'}
//                   size="sm"
//                   onClick={() => setActiveSection('demo')}
//                   icon="Eye"
//                   iconPosition="left"
//                 >
//                   Demo
//                 </Button>
//                 <Button
//                   variant={activeSection === 'specs' ? 'primary' : 'outline'}
//                   size="sm"
//                   onClick={() => setActiveSection('specs')}
//                   icon="FileText"
//                   iconPosition="left"
//                 >
//                   Especificaciones
//                 </Button>
//               </div>
//             </div>
//           </header>

//           {/* Content Area */}
//           <main className="flex-1 overflow-auto">
//             {activeSection === 'demo' ? (
//               <div className="bg-neutral-100 min-h-full flex flex-col">
//                 <div className="bg-card m-6 rounded-lg border border-border flex-1 flex flex-col">
//                   {/* Header del demo */}
//                   <div className="p-4 border-b border-border bg-neutral-50 rounded-t-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Icon
//                           name={
//                             viewMode === 'mobile' ? 'Smartphone' : 'Monitor'
//                           }
//                           size="sm"
//                           color="success"
//                         />
//                         <Typography variant="p" size="sm" weight="medium">
//                           Vista {viewMode === 'mobile' ? 'Móvil' : 'Escritorio'}
//                         </Typography>
//                         {viewMode === 'mobile' && (
//                           <Badge variant="secondary" size="sm">
//                             iOS/Android
//                           </Badge>
//                         )}
//                       </div>

//                       {currentComponentHasMobile && (
//                         <div className="flex items-center space-x-2 text-xs text-muted-foreground">
//                           <Icon name="Smartphone" size="xs" />
//                           <span>Adaptaciones móviles disponibles</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Contenido del demo */}
//                   <div className="flex-1">
//                     <ComponentDemo
//                       componentName={selectedComponent}
//                       viewMode={viewMode}
//                     />
//                   </div>

//                   {/* Footer con información de ruta */}
//                   <div className="border-t border-border bg-neutral-50 px-4 py-3 rounded-b-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className="flex items-center space-x-2">
//                           <Icon
//                             name="FileCode"
//                             size="sm"
//                             className="text-muted-foreground"
//                           />
//                           <Typography variant="p" size="sm" color="muted">
//                             Ubicación del componente:
//                           </Typography>
//                         </div>
//                         <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-1 rounded-md border">
//                           <Typography
//                             variant="p"
//                             size="sm"
//                             className="font-mono text-foreground"
//                           >
//                             {getComponentPath(
//                               selectedComponent,
//                               viewMode === 'mobile',
//                             )}
//                           </Typography>
//                         </div>
//                       </div>

//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           copyPathToClipboard(
//                             getComponentPath(
//                               selectedComponent,
//                               viewMode === 'mobile',
//                             ),
//                           )
//                         }
//                         icon="Copy"
//                         iconPosition="left"
//                         className="text-muted-foreground hover:text-foreground"
//                       >
//                         Copiar ruta
//                       </Button>
//                     </div>

//                     <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
//                       <div className="flex items-center space-x-1">
//                         <div className="w-2 h-2 bg-success rounded-full"></div>
//                         <span>Componente implementado</span>
//                       </div>
//                       <span>•</span>
//                       <span>
//                         Categoría: {componentsData[selectedComponent]?.category}
//                       </span>
//                       <span>•</span>
//                       <span>
//                         {viewMode === 'mobile' ? 'Mobile-First' : 'Desktop'}{' '}
//                         Design
//                       </span>
//                       {currentComponentHasMobile && (
//                         <>
//                           <span>•</span>
//                           <span>Adaptativo iOS/Android</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-background">
//                 <div className="h-[calc(100vh-5rem)] overflow-y-auto">
//                   <div className="max-w-4xl mx-auto p-8">
//                     <ComponentSpecs
//                       component={componentsData[selectedComponent]}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </main>

//           {/* Status Bar */}
//           <footer className="bg-card border-t border-border px-8 py-2 flex items-center justify-between">
//             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//               <div className="flex items-center space-x-1">
//                 <div className="w-2 h-2 bg-success rounded-full"></div>
//                 <span>Sistema activo</span>
//               </div>
//               <span>•</span>
//               <span>{Object.keys(componentsData).length} componentes</span>
//               <span>•</span>
//               <span>
//                 {
//                   Object.values(componentsData).filter(
//                     (c) => c.hasMobileVersion,
//                   ).length
//                 }{' '}
//                 móviles
//               </span>
//               <span>•</span>
//               <span>Mobile-First v1.0</span>
//             </div>

//             <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//               <Icon
//                 name={viewMode === 'mobile' ? 'Smartphone' : 'Monitor'}
//                 size="sm"
//               />
//               <span>
//                 Vista {viewMode === 'mobile' ? 'Móvil' : 'Escritorio'}
//               </span>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </BrandingProvider>
//   );
// }
