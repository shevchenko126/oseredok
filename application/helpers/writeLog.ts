import RNFS from 'react-native-fs';

const logFilePath = `${RNFS.DocumentDirectoryPath}/app.log`;

export const appendLog = async (message: string) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  try {
    await RNFS.appendFile(logFilePath, logEntry, 'utf8');
  } catch (error) {
    console.error('Failed to write log:', error);
  }
};

export const getLogPath = () => logFilePath;