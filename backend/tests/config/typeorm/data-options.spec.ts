import { getDataOptionsPath } from "../../../src/config/typeorm/data-options";
import path from "path";

describe('data-options', () => {
    it('getDataOptionsPath', () => {
        const optionsPath = getDataOptionsPath();
        
        expect(optionsPath).toMatchObject({
            entitiesPath: path.join(__dirname, '../../../src/entities/**.{js,ts}'),
            migrationsPath: "TODO : Add migrations"
        })
    })
})