export const checkWebARSupport = () => {
  const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
  const hasMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const canvas = document.createElement('canvas');
  const hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  return {
    supported: isSecure && hasMedia && hasWebGL,
    https: isSecure,
    getUserMedia: hasMedia,
    webgl: hasWebGL
  };
};

export const requestCameraPermission = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  stream.getTracks().forEach((track) => track.stop());
  return true;
};

