import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/Tabs';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsAlianzaProps {
  defaultValue?: string;
  tabs: TabItem[];
  className?: string;
}

export function TabsAlianza({ defaultValue, tabs, className }: TabsAlianzaProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className={cn("w-full space-y-6", className)}>
      <TabsList className="w-full justify-start bg-transparent p-0 border-b border-border h-auto rounded-none gap-6">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground bg-transparent border-b-2 border-transparent transition-all"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
