const RequiredEnvVars = [
  'ENABLE_DOCUMENTATION',
  'SERVER_PORT',
  'INTERNAL_SERVICE',
  'DATABASE_URI',
];

interface Configuration {
  server: {
    port: number;
  };
  enableDocumentation: boolean;
  internalService: boolean;
  databaseConfig: {
    dbHost: string;
    dbName: string;
    username: string;
    password: string;
  };
}

// Default configuration variables
const DEFAULT_SERVER_PORT = 3002;

export const processENV = (): Configuration => {
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.SERVER_PORT as string, 10) || DEFAULT_SERVER_PORT,
    },
    enableDocumentation: process.env.ENABLE_DOCUMENTATION === 'true',
    internalService: process.env.INTERNAL_SERVICE === 'true',
    databaseConfig: {
      dbHost: process.env.DB_HOST as string,
      dbName: process.env.DB_NAME as string,
      username: process.env.DB_USERNAME as string,
      password: process.env.DB_PASSWORD as string,
    },
  };

  return defaultConfiguration;
};

export const validateEnvironmentVars = (): void => {
  // if (process.env.NODE_ENV === undefined) {
  //   process.env.NODE_ENV = 'development';
  // }

  RequiredEnvVars.forEach((v) => {
    if (!process.env[v]) throw Error(`Missing required env variable ${v}`);
  });
};
