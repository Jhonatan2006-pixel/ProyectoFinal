/**
 * Traducción al español de los textos del componente FaceLivenessDetector.
 * (Por defecto Amplify los muestra en inglés.)
 */
export const TEXTOS_LIVENESS_ES = {
  // Pantalla inicial
  startScreenBeginCheckText: 'Comenzar verificación',
  goodFitCaptionText: 'Buena posición',
  goodFitAltText: 'Rostro que llena el óvalo correctamente',
  tooFarCaptionText: 'Muy lejos',
  tooFarAltText: 'Rostro demasiado lejos del óvalo',
  photosensitivityWarningHeadingText: 'Advertencia de fotosensibilidad',
  photosensitivityWarningBodyText: 'Esta verificación muestra luces de colores. Tenga cuidado si es fotosensible.',
  photosensitivityWarningInfoText: 'Algunas personas pueden sufrir convulsiones al ver luces de colores. Tenga precaución si usted o alguien de su familia tiene epilepsia.',
  photosensitivityWarningLabelText: 'Más información sobre la fotosensibilidad',

  // Indicaciones durante la prueba
  hintMoveFaceFrontOfCameraText: 'Coloque su rostro frente a la cámara',
  hintTooManyFacesText: 'Asegúrese de que solo haya un rostro',
  hintFaceDetectedText: 'Rostro detectado',
  hintCanNotIdentifyText: 'Coloque su rostro frente a la cámara',
  hintTooCloseText: 'Aléjese un poco',
  hintTooFarText: 'Acérquese un poco',
  hintConnectingText: 'Conectando...',
  hintVerifyingText: 'Verificando...',
  hintCheckCompleteText: 'Verificación completa',
  hintIlluminationTooBrightText: 'Busque un lugar con menos luz',
  hintIlluminationTooDarkText: 'Busque un lugar con más luz',
  hintIlluminationNormalText: 'Iluminación correcta',
  hintHoldFaceForFreshnessText: 'Quédese quieto',
  hintCenterFaceText: 'Centre su rostro',
  hintCenterFaceInstructionText: 'Instrucción: antes de iniciar, centre su rostro en el óvalo.',
  hintFaceOffCenterText: 'Su rostro no está centrado. Céntrelo en el óvalo.',
  hintMatchIndicatorText: '50% completado. Siga acercándose.',

  // Cámara
  cameraMinSpecificationsHeadingText: 'La cámara no cumple los requisitos mínimos',
  cameraMinSpecificationsMessageText: 'La cámara debe soportar al menos 320x240 y 15 cuadros por segundo.',
  cameraNotFoundHeadingText: 'No se puede acceder a la cámara',
  cameraNotFoundMessageText: 'Verifique que la cámara esté conectada y que la aplicación tenga permiso para usarla.',
  retryCameraPermissionsText: 'Reintentar',
  waitingCameraPermissionText: 'Esperando permiso para usar la cámara.',
  a11yVideoLabelText: 'Cámara para la prueba de vida',

  // Grabación
  recordingIndicatorText: 'Grabando',
  cancelLivenessCheckText: 'Cancelar',

  // Errores
  errorLabelText: 'Error',
  connectionTimeoutHeaderText: 'Tiempo de conexión agotado',
  connectionTimeoutMessageText: 'No se pudo conectar. Revise su internet e intente de nuevo.',
  timeoutHeaderText: 'Tiempo agotado',
  timeoutMessageText: 'Su rostro no llenó el óvalo a tiempo. Intente de nuevo.',
  faceDistanceHeaderText: 'Movimiento hacia adelante detectado',
  faceDistanceMessageText: 'Evite acercarse mientras se conecta.',
  multipleFacesHeaderText: 'Varios rostros detectados',
  multipleFacesMessageText: 'Asegúrese de que solo haya un rostro frente a la cámara.',
  clientHeaderText: 'Error del cliente',
  clientMessageText: 'La verificación falló por un problema del dispositivo.',
  serverHeaderText: 'Error del servidor',
  serverMessageText: 'No se pudo completar la verificación por un problema del servidor.',
  landscapeHeaderText: 'Orientación horizontal no soportada',
  landscapeMessageText: 'Gire el dispositivo a posición vertical.',
  portraitMessageText: 'Mantenga el dispositivo en posición vertical durante la verificación.',
  tryAgainText: 'Intentar de nuevo',
};
