import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioProductos from "../Components/FormularioProductos";
import TablaProductos from "../Components/TablaProductos.js";

const Productos = ({cerrarSesion}) => {

  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);

  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
  });

  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  // Función genérica para extraer datos de una colección
  const cargarDatosFirebase = async (nombreColeccion) => {
    if (!nombreColeccion || typeof nombreColeccion !== "string") {
      console.error("Error: Se requiere un nombre de colección válido.");
      return {};
    }
    try {
      const datosExportados = {};
      const snapshot = await getDocs(collection(db, nombreColeccion));
      datosExportados[nombreColeccion] = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      return datosExportados;
    } catch (error) {
      console.error(`Error extrayendo datos de la colección '${nombreColeccion}':`, error);
      return {};
    }
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        cargarDatos(); // Recargar lista
        setNuevoProducto({ nombre: "", precio: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await updateDoc(doc(db, "productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false); // Volver al modo registro
        setProductoId(null);
        cargarDatos(); // Recargar lista
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Exportar productos como JSON y compartir/copiar
  const exportarProductos = async () => {
    const datos = await cargarDatosFirebase("productos");
    const json = JSON.stringify(datos, null, 2);
    try {
      // En web, evitamos escribir archivo y copiamos al portapapeles
      if (Platform.OS === "web") {
        await Clipboard.setStringAsync(json);
        alert("JSON copiado al portapapeles (web).");
        return;
      }

      const fileUri = `${FileSystem.cacheDirectory}productos.json`;
      await FileSystem.writeAsStringAsync(fileUri, json);
      const disponible = await Sharing.isAvailableAsync();
      if (disponible) {
        await Sharing.shareAsync(fileUri, { mimeType: "application/json", dialogTitle: "Exportar productos" });
      } else {
        await Clipboard.setStringAsync(json);
        alert("Compartir no disponible. JSON copiado al portapapeles.");
      }
    } catch (error) {
      console.error("Error exportando productos:", error);
    }
  };

  return (
    <View style={styles.container}>

      <Button title="Cerrar Sesión" onPress={cerrarSesion} />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 10 }}>
        <Button title="Exportar productos (JSON)" onPress={exportarProductos} />
      </View>

      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      
      <TablaProductos 
        productos={productos}
        editarProducto={editarProducto} 
        eliminarProducto={eliminarProducto}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;