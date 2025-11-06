import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Productos from "../views/Productos";
import Ciudades from "../views/Ciudades";
import Clientes from "../views/Clientes";
import Promedio from "../views/Promedio";
import SumNum from "../views/SumNum";
import Triangulos from "../views/Triangulos";
import IMC from "../views/IMC";
import Usuarios from "../views/Usuarios";

const Drawer = createDrawerNavigator();

export default function AppNavigator({ cerrarSesion }) {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ headerShown: true }}>
        <Drawer.Screen name="Productos">
          {(props) => <Productos {...props} cerrarSesion={cerrarSesion} />}
        </Drawer.Screen>
        <Drawer.Screen name="Ciudades" component={Ciudades} />
        <Drawer.Screen name="Clientes" component={Clientes} />
        <Drawer.Screen name="Promedio" component={Promedio} />
        <Drawer.Screen name="Suma de Números" component={SumNum} />
        <Drawer.Screen name="Triángulos" component={Triangulos} />
        <Drawer.Screen name="IMC" component={IMC} />
        <Drawer.Screen name="Usuarios" component={Usuarios} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}