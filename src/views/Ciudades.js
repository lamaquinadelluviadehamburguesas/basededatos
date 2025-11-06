import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import FormularioCiudades from "../Components/FormularioCiudades";
import TablaCiudades from "../Components/TablaCiudades";

const Ciudades = () => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ciudadId, setCiudadId] = useState(null);
  const [ciudades, setCiudades] = useState([]);
  const [nuevaCiudad, setNuevaCiudad] = useState({ nombre: "", poblacion: "", pais: "", region: "" });

  const manejoCambio = (nombre, valor) => {
    setNuevaCiudad((prev) => ({ ...prev, [nombre]: valor }));
  };

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ciudad"));
      const data = querySnapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
      setCiudades(data);
    } catch (error) {
      console.error("Error al obtener ciudades:", error);
    }
  };

  const guardarCiudad = async () => {
    try {
      if (nuevaCiudad.nombre && nuevaCiudad.poblacion && nuevaCiudad.pais && nuevaCiudad.region) {
        await addDoc(collection(db, "ciudad"), {
          nombre: nuevaCiudad.nombre,
          poblacion: parseFloat(nuevaCiudad.poblacion),
          pais: nuevaCiudad.pais,
          region: nuevaCiudad.region,
        });
        setNuevaCiudad({ nombre: "", poblacion: "", pais: "", region: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar ciudad:", error);
    }
  };

  const actualizarCiudad = async () => {
    try {
      if (nuevaCiudad.nombre && nuevaCiudad.poblacion && nuevaCiudad.pais && nuevaCiudad.region) {
        await updateDoc(doc(db, "ciudad", ciudadId), {
          nombre: nuevaCiudad.nombre,
          poblacion: parseFloat(nuevaCiudad.poblacion),
          pais: nuevaCiudad.pais,
          region: nuevaCiudad.region,
        });
        setNuevaCiudad({ nombre: "", poblacion: "", pais: "", region: "" });
        setModoEdicion(false);
        setCiudadId(null);
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar ciudad:", error);
    }
  };

  const eliminarCiudad = async (id) => {
    try {
      await deleteDoc(doc(db, "ciudad", id));
    } catch (error) {
      console.error("Error al eliminar ciudad:", error);
    }
  };

  const editarCiudad = (ciudad) => {
    setNuevaCiudad({ nombre: ciudad.nombre, poblacion: String(ciudad.poblacion), pais: ciudad.pais, region: ciudad.region });
    setCiudadId(ciudad.id);
    setModoEdicion(true);
  };

  // Función para ejecutar todas las consultas específicas
  const ejecutarConsultasEspecificas = async () => {
    console.log("=== INICIANDO CONSULTAS ESPECÍFICAS DE CIUDADES ===");

    try {
      // 1. Obtén las 2 ciudades más pobladas de Guatemala, ordenadas por población descendente
      console.log("\n1. Las 2 ciudades más pobladas de Guatemala:");
      const q1 = query(
        collection(db, "ciudad"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot1 = await getDocs(q1);
      if (snapshot1.empty) {
        console.log("No se encontraron ciudades de Guatemala");
      } else {
        snapshot1.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 2. Lista las ciudades de Honduras con población mayor a 700k, ordenadas por nombre ascendente, limitadas a 3
      console.log("\n2. Ciudades de Honduras con población > 700k (máximo 3):");
      const q2 = query(
        collection(db, "ciudad"),
        where("pais", "==", "Honduras"),
        where("poblacion", ">", 700000),
        orderBy("poblacion"),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot2 = await getDocs(q2);
      if (snapshot2.empty) {
        console.log("No se encontraron ciudades de Honduras con población > 700k");
      } else {
        snapshot2.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 3. Obtén las 2 ciudades salvadoreñas, ordenadas por población ascendente
      console.log("\n3. Las 2 ciudades salvadoreñas ordenadas por población ascendente:");
      const q3 = query(
        collection(db, "ciudad"),
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "asc"),
        limit(2)
      );
      const snapshot3 = await getDocs(q3);
      if (snapshot3.empty) {
        console.log("No se encontraron ciudades de El Salvador");
      } else {
        snapshot3.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 4. Muestra ciudades centroamericanas con población menor o igual a 300k, ordenadas por país descendente, limitadas a 4
      console.log("\n4. Ciudades centroamericanas con población ≤ 300k (máximo 4):");
      const q4 = query(
        collection(db, "ciudad"),
        where("poblacion", "<=", 300000),
        orderBy("poblacion"),
        orderBy("pais", "desc"),
        limit(4)
      );
      const snapshot4 = await getDocs(q4);
      if (snapshot4.empty) {
        console.log("No se encontraron ciudades con población ≤ 300k");
      } else {
        snapshot4.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 5. Obtén las 3 ciudades con población mayor a 900k, ordenadas por nombre
      console.log("\n5. Las 3 ciudades con población > 900k ordenadas por nombre:");
      const q5 = query(
        collection(db, "ciudad"),
        where("poblacion", ">", 900000),
        orderBy("poblacion"),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot5 = await getDocs(q5);
      if (snapshot5.empty) {
        console.log("No se encontraron ciudades con población > 900k");
      } else {
        snapshot5.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 6. Lista las ciudades guatemaltecas, ordenadas por población descendente, limitadas a 5
      console.log("\n6. Ciudades guatemaltecas ordenadas por población descendente (máximo 5):");
      const q6 = query(
        collection(db, "ciudad"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const snapshot6 = await getDocs(q6);
      if (snapshot6.empty) {
        console.log("No se encontraron ciudades guatemaltecas");
      } else {
        snapshot6.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 7. Obtén ciudades con población entre 200 y 600k, ordenadas por país ascendente, limitadas a 5
      console.log("\n7. Ciudades con población entre 200k y 600k ordenadas por país (máximo 5):");
      const q7 = query(
        collection(db, "ciudad"),
        where("poblacion", ">=", 200000),
        where("poblacion", "<=", 600000),
        orderBy("poblacion"),
        orderBy("pais", "asc"),
        limit(5)
      );
      const snapshot7 = await getDocs(q7);
      if (snapshot7.empty) {
        console.log("No se encontraron ciudades con población entre 200k y 600k");
      } else {
        snapshot7.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

      // 8. Lista las 5 ciudades con mayor población en general, ordenadas por región descendente
      console.log("\n8. Las 5 ciudades con mayor población ordenadas por región descendente:");
      const q8 = query(
        collection(db, "ciudad"),
        orderBy("poblacion", "desc"),
        orderBy("region", "desc"),
        limit(5)
      );
      const snapshot8 = await getDocs(q8);
      if (snapshot8.empty) {
        console.log("No se encontraron ciudades");
      } else {
        snapshot8.forEach((doc) => {
          const data = doc.data();
          console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}, Región: ${data.region}`);
        });
      }

    } catch (error) {
      console.error("Error ejecutando consultas específicas:", error);
    }

    console.log("\n=== CONSULTAS ESPECÍFICAS COMPLETADAS ===");
  };

  useEffect(() => {
    // Ejecutar consultas específicas al cargar la vista
    ejecutarConsultasEspecificas();

    // Mantener suscripción en tiempo real para la tabla
    const unsubscribe = onSnapshot(
      collection(db, "ciudad"),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
        setCiudades(data);
      },
      (error) => {
        console.error("Error en tiempo real de ciudades:", error);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <FormularioCiudades
        nuevaCiudad={nuevaCiudad}
        manejoCambio={manejoCambio}
        guardarCiudad={guardarCiudad}
        actualizarCiudad={actualizarCiudad}
        modoEdicion={modoEdicion}
      />
      <TablaCiudades ciudades={ciudades} editarCiudad={editarCiudad} eliminarCiudad={eliminarCiudad} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Ciudades;