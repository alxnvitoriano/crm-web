"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createOrganization } from "@/actions/create-organization";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
});

export function CreateOrganizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await createOrganization(values.name, values.slug);
      toast.success("Time criado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Falha na criação do time");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Meu Time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="meu-time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Criar time"}
        </Button>
      </form>
    </Form>
  );
}
