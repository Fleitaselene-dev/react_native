# Aplicación de Notas con Fotografías

Proyecto mobile desarrollado con Expo y React Native que permite crear, editar y organizar notas acompañadas por fotografías tomadas con la cámara del dispositivo.

La app permite:
- Tomar una foto directamente desde la cámara.
- Escribir un título y una descripción para cada nota.
- Registrar automáticamente la fecha de creación o modificación.
- Ver todas las notas en una lista ordenada.
- Abrir cada nota para ver su detalle, editarla o eliminarla.

Todos los datos de las notas se guardan localmente usando AsyncStorage; no se requiere conexión ni backend.

## Tecnologías utilizadas

- Expo SDK 54
- React Native 0.81.5
- Expo Camera (captura de imagen)
- Expo Router (navegación por archivos)
- AsyncStorage (persistencia de datos)
- TypeScript


## Instalación

**Requisitos:** Node.js v18+, pnpm/npm/yarn y Expo Go.

Pasos:
1. Clona el repositorio y accede a la carpeta:

    ```
    git clone
    cd 
    ```

2. Instala dependencias:

    ```
    pnpm install
    # o
    npm install
    ```

3. Corre el servidor de desarrollo:

    ```
    pnpm start
    # o
    npx expo start
    ```

4. Abre la app con Expo Go escaneando el QR, o usa emulador Android/iOS.

