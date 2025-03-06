import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  idea: z.string().min(10, "Please describe your idea in more detail (minimum 10 characters)")
});

type GoalFormProps = {
  onSubmit: (idea: string) => void;
};

export function GoalForm({ onSubmit }: GoalFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idea: ""
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.idea);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="idea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's your business idea?</FormLabel>
                <FormDescription>
                  Describe your business concept in detail. For example: "I want to start a local organic cafe that serves healthy meals and provides nutrition education"
                </FormDescription>
                <FormControl>
                  <Input 
                    placeholder="Describe your business idea here..." 
                    {...field} 
                    className="h-24"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Analyze & Generate Roadmap
          </Button>
        </form>
      </Form>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Example Business Ideas:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• "A mobile app for connecting local food producers with restaurants"</li>
              <li>• "An eco-friendly cleaning service using natural products"</li>
              <li>• "A specialized online training platform for IT professionals"</li>
              <li>• "A boutique marketing agency focusing on social media for small businesses"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}