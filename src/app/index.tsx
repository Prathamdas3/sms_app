import React, { useState, useEffect } from 'react';
import { SafeAreaView, PermissionsAndroid, View, StyleSheet, Alert, Linking, AppState, AppStateStatus } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Table from '../components/Table';

export default function Index() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [neverAskAgain, setNeverAskAgain] = useState<boolean>(false); 
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState); 

  const checkSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
      if (granted) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Request SMS permission
  const requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Access Permission",
          message: "We need access to your SMS messages to extract expense details.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        setPermissionDenied(false);
        setNeverAskAgain(false); 
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        setPermissionDenied(true); 
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setNeverAskAgain(true); 
        Alert.alert(
          "Permission Required",
          "SMS permission is required to extract expenses. Please enable it from settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

 
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkSMSPermission();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove(); 
    };
  }, [appState]);

  useEffect(() => {
    checkSMSPermission(); 
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {hasPermission ? (
        <Table hasPermission/>
      ) : (
        <View style={styles.container}>
          <Text style={styles.permissionText}>
            {neverAskAgain
              ? 'You have permanently denied SMS permission. Please enable it from the settings to continue.'
              : permissionDenied
              ? 'SMS permission denied. Please grant permission to continue.'
              : 'Please grant SMS access to display expenses.'}
          </Text>
          {!neverAskAgain && (
            <Button mode="elevated" onPress={requestSMSPermission}>
              Enable Permission
            </Button>
          )}
          {neverAskAgain && (
            <Button mode="elevated" onPress={() => Linking.openSettings()}>
              Open Settings
            </Button>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
