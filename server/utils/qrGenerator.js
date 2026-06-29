const QRCode = require('qrcode');

/**
 * Generates a QR Code as a base64 Data URL
 * @param {string} text - The text to encode in the QR code
 * @returns {Promise<string>} Base64 Data URL
 */
const generateQRCode = async (text) => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      color: {
        dark: '#1e1b4b', // Deep indigo
        light: '#ffffff'
      },
      width: 300,
      margin: 2
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};

module.exports = generateQRCode;
