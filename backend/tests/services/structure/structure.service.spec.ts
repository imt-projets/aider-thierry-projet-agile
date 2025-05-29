import { FastifyReply, FastifyRequest } from "fastify";
import { services } from "../../../src/services";
import { Repository } from "typeorm";
import { entities } from "../../../src/entities";
import { ReplyHelper } from "../../../src/helpers";
import { enums } from "../../../src/enums";

jest.mock("../../../src/helpers", () => ({
    ReplyHelper: {
        send: jest.fn(),
        error: jest.fn()
    }
}));


jest.mock("@/helpers", () => ({
    ReplyHelper: {
        send: jest.fn(),
    },
}));

describe("getSchools", () => {
    let mockReply: FastifyReply;
    let mockRepository: Partial<Repository<entities.Structure>>;

    beforeEach(() => {
        mockReply = {} as FastifyReply;
    });

    it("should return a list of schools", async () => {
        const mockSchools = [
        {
            id: "1",
            name: "IMT ATLANTIQUE",
            type: entities.StructureTypeEnum.SCHOOL,
        },
        ];

        mockRepository = {
            find: jest.fn().mockResolvedValue(mockSchools),
        };

        await services.Structure.getSchools({} as FastifyRequest, mockReply, mockRepository as Repository<entities.Structure>);

        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { type: entities.StructureTypeEnum.SCHOOL },
        });

        expect(ReplyHelper.send).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.OK,
            mockSchools
        );
    });
});