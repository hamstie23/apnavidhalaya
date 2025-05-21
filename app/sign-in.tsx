import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import * as z from "zod";
import { router } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
  const { signIn, session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if user is already signed in
  useEffect(() => {
    if (session) {
      router.replace("/(protected)");
    }
  }, [session]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setLoading(true);
      await signIn(data.email, data.password);
      
      // Get user role for routing
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session?.user.id)
        .single();
      
      form.reset();
      
      // If there's no user role yet, create one (default to admin for testing)
      if (userError || !userData) {
        await supabase
          .from("profiles")
          .upsert({ 
            id: session?.user.id, 
            role: "admin",
            email: data.email,
            updated_at: new Date().toISOString() 
          });
      }
            
      // Navigate to protected route - the layout will handle role-based redirection
      router.replace("/(protected)");
    } catch (error: Error | any) {
      console.error(error.message);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <H1 style={styles.title}>Welcome Back</H1>
          <Muted style={styles.subtitle}>
            Sign in to continue to Apna Vidhayalaya
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
                  placeholder="Enter your password"
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
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <Button
        style={styles.button}
        onPress={form.handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </Button>
      
      <View style={styles.testAccountsContainer}>
        <Muted style={styles.testAccountsTitle}>Test Credentials:</Muted>
        <Text style={styles.testAccountText}>Email: admin@school.com / Password: password123</Text>
        <Text style={styles.testAccountText}>Email: teacher@school.com / Password: password123</Text>
        <Text style={styles.testAccountText}>Email: student@school.com / Password: password123</Text>
      </View>
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
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
  },
  testAccountsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  testAccountsTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  testAccountText: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 4,
  },
});