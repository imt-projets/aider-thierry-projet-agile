import { describe, expect, it } from "vitest";
import { getDataOptionsPath } from "./data-options";
import path from "path";

describe('data-options', () => {
    it('getDataOptionsPath', () => {
        const optionsPath = getDataOptionsPath();
        
        expect(optionsPath).toMatchObject({
            entitiesPath: path.join(__dirname, '../../entities/**.{js,ts}'),
            migrationsPath: "TODO : Add migrations"
        })
    })
})