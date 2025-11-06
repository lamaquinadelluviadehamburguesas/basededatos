
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./src/database/firebaseconfig.js";
import Login from "./src/Components/Login.js";
import AppNavigator from "./src/navigation/AppNavigator.js";

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Escucha los cambios en la autenticación (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  // Si no hay usuario autenticado, mostrar login
  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Si hay usuario autenticado, mostrar navegación completa
  return (
    <View style={{ flex: 1 }}>
      <AppNavigator cerrarSesion={cerrarSesion} />
    </View>
  );
}