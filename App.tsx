
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from "native-base";
import { ChecklistPage } from './src/app/modules/checklist/checklist.page';
import { PreDepartureChecklistPage } from './src/app/modules/checklist/pre-departure-checklist.page';
import { PersonalChecklistPage } from './src/app/modules/checklist/personal-checklist.page';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

export type RootStackParamList = {
  Home: undefined;
  Checklist: undefined;
  PreDepartureChecklist: { checklistId: string };
  PersonalChecklist: { checklistId: string }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {

  const ChecklistStack = () => {
    return (
      <Stack.Navigator initialRouteName="Checklist">
        <Stack.Screen
          name="Checklist"
          component={ChecklistPage}
        />
        <Stack.Screen
          name="PreDepartureChecklist"
          component={PreDepartureChecklistPage}
          options={{ title: 'Pre Departure Checklist' }}
        />
        <Stack.Screen
          name="PersonalChecklist"
          component={PersonalChecklistPage}
          options={{ title: 'Personal Checklist' }}
        />
      </Stack.Navigator>
    );
  };
 
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <QueryClientProvider client={queryClient}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={ChecklistStack} options={{ headerShown: false }} />
          </Stack.Navigator>
        </QueryClientProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

export default App;