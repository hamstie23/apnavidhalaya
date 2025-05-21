import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .max(64, "Please enter fewer than 64 characters.")
      .regex(
        /^(?=.*[a-z])/,
        "Your password must have at least one lowercase letter.",
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Your password must have at least one uppercase letter.",
      )
      .regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Your password must have at least one special character.",
      ),
    confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password);
      form.reset();
    } catch (error: Error | any) {
      console.error(error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <H1 style={styles.title}>Create Account</H1>
          <Muted style={styles.subtitle}>
            Join Apna Vidhayalaya's digital community
          </Muted>
        </View>

        <Form {...form}>
          <View style={styles.formContainer}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  style={styles.input}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Password"
                  placeholder="Create a password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  style={styles.input}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  style={styles.input}
                  {...field}
                />
              )}
            />
          </View>
        </Form>
      </View>

      <Button
        style={styles.button}
        onPress={form.handleSubmit(onSubmit)}
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    gap: 20,
  },
  input: {
    height: 56,
    fontSize: 16,
    backgroundColor: "#F4F4F5",
    borderWidth: 0,
    borderRadius: 12,
  },
  button: {
    backgroundColor: "#4F46E5",
    height: 56,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});