"use client";

import * as z from "zod";
import axios from "axios";

import { Ally, Category } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Separator } from "./ui/separator";
import ImageUplaod from "./image-upload";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface AllyFormProps {
  initialData: Ally | null;
  categories: Category[];
}

const PREAMBLE = `You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.`;

const SEED_CHAT = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  instructions: z
    .string()
    .min(200, { message: "Instruction (min length : 200) is required" }),
  seed: z.string().min(1, { message: "Seed is required" }),
  src: z.string().min(1, { message: "Image is required" }),
  categoryId: z.string().min(1, { message: "Category Id is required" }),
});

const AllyForm = ({ initialData, categories }: AllyFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const Loading = form.formState.isSubmitting;
  const { toast } = useToast();
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await axios.patch(`/api/ally/${initialData.id}`, values);
      } else {
        await axios.post(`/api/ally`, values);
      }

      toast({
        description: "Your character has been saved",
        duration: 2500,
      });

      router.refresh()
      router.push("/")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with updating/adding the character",
        duration: 2500,
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          className="pb-10 space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-semibold">General Information</h3>
              <p>Information about your ally 🤝</p>
            </div>
            <Separator className="bg-black/15" />
            <FormField
              name="src"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                  <FormControl>
                    <ImageUplaod
                      disabled={Loading}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={Loading}
                        placeholder="Cristiano Ronaldo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A unique name for your ally.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        disabled={Loading}
                        placeholder="Footballer & Ballon D'or Winner"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your ally.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={Loading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            placeholder="Choose a category"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormDescription>
                        A brief description of your ally.
                      </FormDescription>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-semibold">Configuration</h3>
              <p>Instructions for your ally behavior 🤖</p>
            </div>
            <Separator className="bg-black/15" />
            <FormField
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      disabled={Loading}
                      placeholder={PREAMBLE}
                      {...field}
                      rows={7}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Describe in detail about your character&apos;s backstory and
                    relevant details
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="seed"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Example Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      disabled={Loading}
                      placeholder={SEED_CHAT}
                      {...field}
                      rows={7}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Describe about a sample conversation between the character
                    and human look like.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full justify-center">
            <Button disabled={Loading}>
              {initialData ? "Edit your character" : "Add a new character"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AllyForm;
