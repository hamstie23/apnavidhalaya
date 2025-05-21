import { Icon as IconifyIcon } from '@iconify/react';
import { StyleSheet, View } from 'react-native';

interface IconProps {
  icon: string;
  color?: string;
  size?: number;
}

export function Icon({ icon, color = "currentColor", size = 24 }: IconProps) {
  return (
    <View style={styles.container}>
      <IconifyIcon icon={icon} color={color} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});