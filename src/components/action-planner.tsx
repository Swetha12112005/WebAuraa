"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircle2,
  History,
  ListChecks,
  Loader2,
  Send,
  Table as TableIcon,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { processInstruction, type ProcessedData } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";

const initialState: ProcessedData = {
  actions: [],
  results: [],
  history: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" />
          Execute
        </>
      )}
    </Button>
  );
}

export function ActionPlanner() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(processInstruction, initialState);
  
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (state.actions.length > 0) {
      formRef.current?.reset();
    }
  }, [state.actions]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-6">
          <form ref={formRef} action={formAction} className="space-y-4">
            <Textarea
              name="instruction"
              placeholder="e.g., search for laptops under 50k and list top 5"
              className="min-h-[100px] text-lg p-4 bg-background focus:ring-primary"
              required
            />
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-8 lg:col-span-1">
          <TaskHistory history={state.history} />
          <PlannedActions actions={state.actions} />
        </div>
        <div className="lg:col-span-2">
            <Results results={state.results} />
        </div>
      </div>
    </div>
  );
}

function TaskHistory({ history }: { history: string[] }) {
    const { pending } = useFormStatus();

    return (
        <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <span>Task History</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {history.length === 0 && !pending ? (
            <p className="text-muted-foreground text-center py-8">No tasks yet.</p>
            ) : (
            <ul className="space-y-4">
                {pending && history.length === 0 && <Skeleton className="h-8 w-full" />}
                {history.map((task, index) => (
                <li key={index} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1 text-sm">{history.length - index}</Badge>
                    <p className="text-muted-foreground break-words pt-0.5">{task}</p>
                </li>
                ))}
            </ul>
            )}
        </CardContent>
        </Card>
    );
}

function PlannedActions({ actions }: { actions: string[] }) {
    const { pending } = useFormStatus();
  
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-primary" />
            <span>Planned Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : actions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">AI plan will appear here.</p>
          ) : (
            <ul className="space-y-4">
              {actions.map((action, index) => (
                <li key={index} className="flex items-start gap-3 text-md">
                  <CheckCircle2 className="h-6 w-6 text-accent mt-0.5 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
}

function Results({ results }: { results: ProcessedData['results'] }) {
    const { pending } = useFormStatus();
  
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TableIcon className="h-6 w-6 text-primary" />
            <span>Extracted Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Results will be displayed here.</p>
          ) : (
            <div className="space-y-6">
              {results.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start gap-6 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={`Image of ${item.name}`}
                      width={128}
                      height={128}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                    </a>
                    <p className="text-muted-foreground mt-1">{item.spec}</p>
                    <p className="text-right font-mono text-lg mt-2">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
}
