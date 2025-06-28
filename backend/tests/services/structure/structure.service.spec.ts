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

describe("Structure Service", () => {
    let mockReply: FastifyReply;
    let mockStructureRepo: Partial<Repository<entities.Structure>>;
    let mockItemRepo: Partial<Repository<entities.Item>>;

    beforeEach(() => {
        mockReply = {} as FastifyReply;
        mockStructureRepo = {};
        mockItemRepo = {};
        jest.clearAllMocks();
    });

    it("should return a list of schools", async () => {
        const mockSchools = [{ id: "1", name: "IMT", type: entities.StructureTypeEnum.SCHOOL }];
        mockStructureRepo.find = jest.fn().mockResolvedValue(mockSchools);

        await services.Structure.getSchools({} as FastifyRequest, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>
        });

        expect(mockStructureRepo.find).toHaveBeenCalledWith({
            where: { type: entities.StructureTypeEnum.SCHOOL }
        });

        expect(ReplyHelper.send).toHaveBeenCalledWith(mockReply, enums.StatusCode.OK, mockSchools);
    });

    it("should return a list of rooms", async () => {
        const mockRooms = [{ id: "1", name: "J144", type: entities.StructureTypeEnum.ROOM }];
        mockStructureRepo.find = jest.fn().mockResolvedValue(mockRooms);

        await services.Structure.getRooms({} as FastifyRequest, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>
        });

        expect(mockStructureRepo.find).toHaveBeenCalledWith({
            where: { type: entities.StructureTypeEnum.ROOM }
        });

        expect(ReplyHelper.send).toHaveBeenCalledWith(mockReply, enums.StatusCode.OK, mockRooms);
    });

    it("should return room by inventory id", async () => {
        const mockRoom = { id: "1", name: "ROOM-001", type: entities.StructureTypeEnum.ROOM, items: [] };
        mockStructureRepo.findOne = jest.fn().mockResolvedValue(mockRoom);

        const mockRequest = {
            params: { name: "ROOM-001" }
        } as unknown as FastifyRequest;

        await services.Structure.getRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>
        });

        expect(mockStructureRepo.findOne).toHaveBeenCalledWith({
            where: { type: entities.StructureTypeEnum.ROOM, name: "ROOM-001" },
            relations: { items: true }
        });

        expect(ReplyHelper.send).toHaveBeenCalledWith(mockReply, enums.StatusCode.OK, mockRoom);
    });

    it("should return error when name param is missing", async () => {
        const mockRequest = {
            params: {}
        } as unknown as FastifyRequest;

        await services.Structure.getRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>
        });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "Id is required to find an item"
        );
    });

    it("should return error when room not found", async () => {
        mockStructureRepo.findOne = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            params: { name: "NONEXISTENT" }
        } as unknown as FastifyRequest;

        await services.Structure.getRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>
        });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.NOT_FOUND,
            "Room not found"
        );
    });

    it("should update items in room", async () => {
        const mockRoom = { id: "1", type: entities.StructureTypeEnum.ROOM, items: [] };
        const mockItems = [{ inventoryNumber: "item1" }, { inventoryNumber: "item2" }];

        mockStructureRepo.findOne = jest.fn().mockResolvedValue(mockRoom);
        mockStructureRepo.save = jest.fn().mockResolvedValue({ ...mockRoom, items: mockItems });
        mockItemRepo.find = jest.fn().mockResolvedValue(mockItems);

        const mockRequest = {
            params: { id: "1" },
            body: { ids: ["item1", "item2"] }
        } as unknown as FastifyRequest;

        await services.Structure.editItemsInRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>,
            item: mockItemRepo as Repository<entities.Item>
        });

        expect(mockStructureRepo.save).toHaveBeenCalled();
        expect(ReplyHelper.send).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.OK,
            expect.objectContaining({ items: mockItems })
        );
    });

    it("should return error if id is missing", async () => {
        const mockRequest = {
            params: {}
        } as unknown as FastifyRequest;

        await services.Structure.editItemsInRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>,
            item: mockItemRepo as Repository<entities.Item>
        });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "Id is required to find an item"
        );
    });

    it("should return error if some item IDs are invalid", async () => {
        const mockRoom = { id: "1", type: entities.StructureTypeEnum.ROOM, items: [] };

        mockStructureRepo.findOne = jest.fn().mockResolvedValue(mockRoom);
        mockItemRepo.find = jest.fn().mockResolvedValue([{ inventoryNumber: "item1" }]);

        const mockRequest = {
            params: { id: "1" },
            body: { ids: ["item1", "item2"] }
        } as unknown as FastifyRequest;

        await services.Structure.editItemsInRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>,
            item: mockItemRepo as Repository<entities.Item>
        });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "Some item IDs are invalid."
        );
    });

    it("should return error when room to edit is not found", async () => {
        mockStructureRepo.findOne = jest.fn().mockResolvedValue(null);

        const mockRequest = {
            params: { id: "1" },
            body: { ids: ["item1"] }
        } as unknown as FastifyRequest;

        await services.Structure.editItemsInRoomFromInventoryId(mockRequest as any, mockReply, {
            primary: mockStructureRepo as Repository<entities.Structure>,
            item: mockItemRepo as Repository<entities.Item>
        });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.NOT_FOUND,
            "Room not found"
        );
    });
});
