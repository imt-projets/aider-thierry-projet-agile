import path from "path";

type AllFieldsAreStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};

interface Directories {
    entitiesPath : string;
    migrationsPath : string;
}

export const getDataOptionsPath = () : AllFieldsAreStrings<Directories> => {
    return {
        entitiesPath: path.join(__dirname, '../../entities/**.{js,ts}'),
        migrationsPath: "TODO : Add migrations"
    }
}