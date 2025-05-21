import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

type UserRole = "admin" | "teacher" | "parent" | null;

export default function ProtectedLayout() {
  const { initialized, session } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          return;
        }

        setUserRole(data?.role as UserRole);
      }
      setLoading(false);
    }

    getUserRole();
  }, [session]);

  if (!initialized || loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  // Redirect based on user role
  if (userRole === "admin") {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(admin)" />
      </Stack>
    );
  }

  if (userRole === "teacher") {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(teacher)" />
      </Stack>
    );
  }

  if (userRole === "parent") {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(parent)" />
      </Stack>
    );
  }

  // If no role is set, show error
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="error" />
    </Stack>
  );
}