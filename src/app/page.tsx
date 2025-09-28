import { ActionPlanner } from '@/components/action-planner';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center gap-4 mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
              WEBAURA
            </h1>
            <p className="text-muted-foreground mt-1 text-md">
              From natural language to automated action plans.
            </p>
          </div>
        </header>
        <main>
          <ActionPlanner />
        </main>
      </div>
    </div>
  );
}
