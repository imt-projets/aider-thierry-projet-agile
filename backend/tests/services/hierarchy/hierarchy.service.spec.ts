import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";
import { entities } from "../../../src/entities";
import { getHierarchy } from "../../../src/services/hierarchy/hierarchy.service";
import { ReplyHelper } from "../../../src/helpers";
import { enums } from "../../../src/enums";
import { StructureTypeEnum } from "../../../src/entities/organizational";

jest.mock("../../../src/helpers", () => ({
    ReplyHelper: {
        send: jest.fn()
    }
}));

describe("getHierarchy", () => {
    let mockReply: FastifyReply;
    let mockRequest: FastifyRequest;
    let mockRepository: Partial<Repository<entities.Structure>>;

    const mockData = [
        {
        id: "1",
        name: "École A",
        type: StructureTypeEnum.SCHOOL,
        children: [
            {
            id: "2",
            name: "A",
            type: StructureTypeEnum.BUILDING,
            children: [
                {
                id: "3",
                name: "A144",
                type: StructureTypeEnum.ROOM,
                items: []
                }
            ]
            }
        ]
        }
    ];

    beforeEach(() => {
        mockReply = {} as FastifyReply;
        mockRequest = {} as FastifyRequest;

        mockRepository = {
            find: jest.fn().mockResolvedValue(mockData)
        };
    });

    it("should fetch hierarchy and send it in the response", async () => {
        await getHierarchy(mockRequest, mockReply, {
            primary: mockRepository as Repository<entities.Structure>
        });

        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { type: entities.StructureTypeEnum.SCHOOL },
            select: {
                id: true,
                name: true,
                type: true,
                children: {
                id: true,
                name: true,
                type: true,
                children: {
                    id: true,
                    name: true,
                    type: true,
                    items: {
                    id: true,
                    name: true
                    }
                }
                }
            },
            relations: {
                children: {
                children: {
                    items: true
                }
                }
            }
        });

        expect(ReplyHelper.send).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.OK,
            mockData
            );
        });
});