import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

type UserRole = "admin" | "teacher" | "parent" | "student" | null;

export default function ProtectedLayout() {
	const { initialized, session } = useAuth();
	const [userRole, setUserRole] = useState<UserRole>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getUserRole() {
			if (session?.user) {
				try {
					// Try to get user role from profiles table
					const { data, error } = await supabase
						.from("profiles")
						.select("role")
						.eq("id", session.user.id)
						.single();

					if (error) {
						// Handle the case when profiles table doesn't exist or role isn't set
						console.log(
							"Unable to fetch user role, defaulting to admin role for now",
						);
						setUserRole("admin");
					} else if (data?.role) {
						// Set user role if it exists
						setUserRole(data.role as UserRole);
					} else {
						// Default to admin if no role is set
						console.log("No role found for user, defaulting to admin");
						setUserRole("admin");
						
						// Create or update profile with admin role
						await supabase.from("profiles").upsert({ 
							id: session.user.id,
							role: "admin",
							email: session.user.email,
							updated_at: new Date().toISOString(),
						});
					}
				} catch (e) {
					console.error("Exception fetching user role:", e);
					// Default to admin if there's any error
					setUserRole("admin");
				}
			}
			setLoading(false);
		}

		getUserRole();
	}, [session]);

	// Show loading state while initializing
	if (!initialized || loading) {
		return null;
	}

	// Redirect to welcome page if not signed in
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

	if (userRole === "student") {
		return (
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="(student)" />
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
