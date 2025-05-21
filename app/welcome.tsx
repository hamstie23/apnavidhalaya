import { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/safe-area-view";
import { H1, H2, P, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/context/supabase-provider";

export default function Welcome() {
  const { session } = useAuth();
  
  // If user is already signed in, redirect to the appropriate dashboard
  useEffect(() => {
    if (session) {
      router.replace("/(protected)");
    }
  }, [session]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <H1 style={styles.title}>Apna Vidhalaya</H1>
          <H2 style={styles.subtitle}>School Management System</H2>
        </View>
        
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon icon="ph:book-open" size={64} color="#4F46E5" />
          </View>
        </View>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Icon icon="ph:check-circle" size={24} color="#10B981" />
            <P style={styles.featureText}>Complete school management</P>
          </View>
          
          <View style={styles.featureItem}>
            <Icon icon="ph:check-circle" size={24} color="#10B981" />
            <P style={styles.featureText}>Student, teacher, parent portals</P>
          </View>
          
          <View style={styles.featureItem}>
            <Icon icon="ph:check-circle" size={24} color="#10B981" />
            <P style={styles.featureText}>Administrative tools & dashboards</P>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <Button 
          style={styles.signInButton}
          onPress={() => router.push("/sign-in")}
        >
          <P style={styles.signInText}>Sign In</P>
        </Button>
        
        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={() => router.push("/sign-up")}
        >
          <P style={styles.signUpText}>Don't have an account? <P style={styles.signUpHighlight}>Sign Up</P></P>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#6B7280",
  },
  logoContainer: {
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  features: {
    width: "100%",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#1F2937",
  },
  actions: {
    width: "100%",
    padding: 24,
    gap: 16,
  },
  signInButton: {
    backgroundColor: "#4F46E5",
    height: 56,
    borderRadius: 12,
  },
  signInText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpLink: {
    alignItems: "center",
    padding: 8,
  },
  signUpText: {
    color: "#6B7280",
    fontSize: 16,
  },
  signUpHighlight: {
    color: "#4F46E5",
    fontWeight: "600",
  },
});