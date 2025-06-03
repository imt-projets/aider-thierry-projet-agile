import { entities } from "../../../src/entities";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";
import { services } from "../../../src/services";
import { ReplyHelper } from "../../../src/helpers";
import { enums } from "../../../src/enums";
import { ItemByIdParams } from "../../../src/services/item/item.service";


jest.mock("../../../src/helpers", () => ({
    ReplyHelper: {
        send: jest.fn(),
        error: jest.fn()
    }
}));

describe("items service", () => {
    let mockReply: FastifyReply;
    let mockRequest: FastifyRequest<{ Params: ItemByIdParams }>;
    let mockItemRepo: Partial<Repository<entities.Item>>;
    let mockStructureRepo: Partial<Repository<entities.Structure>>;

    beforeEach(() => {
        mockReply = {} as FastifyReply;
        mockRequest = {} as FastifyRequest<{ Params: ItemByIdParams }>;
    })

    it ("get all items", async () => {
        const mockData = [
            {
                id: "26626652-2f35-4061-9701-1dcdb419273e",
                name: "Chaise",
                serialNumber: "123456",
                inventoryNumber: "24324",
                orderNumber: "349843",
                price: 25,
                description: "Chaise en plastique",
                warrantyEndDate: "2027-05-25T16:54:31.585Z",
                endOfLifeDate: "2030-05-25T16:54:31.585Z",
                brand: "Ikea",
                model: "ADDE" 
            }
        ];

        mockItemRepo = {
            find: jest.fn().mockResolvedValue(mockData)
        };

        await services.Item.getItems(mockRequest, mockReply, {
            primary: mockItemRepo as Repository<entities.Item>
        })
    
        expect(mockItemRepo.find).toHaveBeenCalledWith({});

        expect(ReplyHelper.send).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.OK,
            mockData
        );
    })

    it ("get item from request id", async () => {

        const mockItem = {
            id: "26626652-2f35-4061-9701-1dcdb419273e",
            name: "Chaise",
            serialNumber: "123456",
            inventoryNumber: "24324",
            orderNumber: "349843",
            price: 25,
            description: "Chaise en plastique",
            warrantyEndDate: "2027-05-25T16:54:31.585Z",
            endOfLifeDate: "2030-05-25T16:54:31.585Z",
            brand: "Ikea",
            model: "ADDE" 
        }
        
        mockItemRepo = {
            findOne: jest.fn().mockResolvedValue(mockItem)
        };

        mockRequest = {
            params: {
                id: "26626652-2f35-4061-9701-1dcdb419273e"
            }
        } as FastifyRequest<{ Params: ItemByIdParams }>;
        await services.Item.getItemById(mockRequest, mockReply, {
            primary: mockItemRepo as Repository<entities.Item>
        })
    })

    it("reply error when forgetting id in request params", async () => {
        mockRequest = {
            params: {}
        } as FastifyRequest<{ Params: ItemByIdParams }>;

        await services.Item.getItemById(
            mockRequest,
            mockReply,
            { 
                primary: {} as Repository<entities.Item>
            } 
        );

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "Id is required to find an item"
        );
    });


    it("reply error when item is not found", async () => {
        mockItemRepo = {
            findOne: jest.fn().mockResolvedValue(null), // simulate item not found
        };

        mockRequest = {
            params: {
                id: "non-existent-id",
            },
        } as FastifyRequest<{ Params: ItemByIdParams }>;

        await services.Item.getItemById(
            mockRequest,
            mockReply,
            { primary: mockItemRepo as Repository<entities.Item>}
        );

        expect(mockItemRepo.findOne).toHaveBeenCalledWith({ where: { id: "non-existent-id" } });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.NOT_FOUND,
            "Item not found"
        );
    });

    it("should update the room of the item", async () => {
        const mockItem = {
            inventoryNumber: "INV123",
            room: null,
            save: jest.fn()
        };

        const savedItem = { ...mockItem, room: { id: "room1" } };

        mockItemRepo = {
            findOne: jest.fn().mockResolvedValue(mockItem),
            save: jest.fn().mockResolvedValue(savedItem)
        };

        mockStructureRepo = {
            findOne: jest.fn().mockResolvedValue({ id: "room1" })
        };

        mockRequest = {
            params: { inventoryNumber: "INV123" },
            body: { id: "room1" }
        } as unknown as any;

        await services.Item.updateItemRoomFromInventoryId(
            mockRequest as any,
            mockReply,
            {
                primary: mockItemRepo as Repository<entities.Item>,
                structure: mockStructureRepo as Repository<entities.Structure>
            }
        );

        expect(mockItemRepo.findOne).toHaveBeenCalledWith({ where: { inventoryNumber: "INV123" } });
        expect(mockStructureRepo.findOne).toHaveBeenCalledWith({ where: { id: "room1" } });
        expect(mockItemRepo.save).toHaveBeenCalledWith(expect.objectContaining({
            inventoryNumber: "INV123",
            room: { id: "room1" }
        }));
        expect(ReplyHelper.send).toHaveBeenCalledWith(mockReply, enums.StatusCode.OK, savedItem);
    });

    it("should return BAD_REQUEST if inventoryNumber missing", async () => {
        mockRequest = {
            params: { inventoryNumber: "" },
            body: { id: "room1" }
        } as unknown as any;

        await services.Item.updateItemRoomFromInventoryId(
            mockRequest as any,
            mockReply,
            { primary: {} as Repository<entities.Item>, structure: {} as Repository<entities.Structure> }
        );

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "inventoryNumber is required to update room item"
        );
    });

    it("should return BAD_REQUEST if room ID missing", async () => {
        mockRequest = {
            params: { inventoryNumber: "INV123" },
            body: { id: "" }
        } as unknown as any;

        await services.Item.updateItemRoomFromInventoryId(
            mockRequest as any,
            mockReply,
            { primary: {} as Repository<entities.Item>, structure: {} as Repository<entities.Structure> }
        );

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "Room ID is required."
        );
    });

    it("should return NOT_FOUND if item not found", async () => {
        mockItemRepo = {
            findOne: jest.fn().mockResolvedValue(null)
        };

        mockRequest = {
            params: { inventoryNumber: "INV123" },
            body: { id: "room1" }
        } as unknown as any;

        await services.Item.updateItemRoomFromInventoryId(
            mockRequest as any,
            mockReply,
            {
                primary: mockItemRepo as Repository<entities.Item>,
                structure: {} as Repository<entities.Structure>
            }
        );

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.NOT_FOUND,
            "Item not found"
        );
    });

    it("should return NOT_FOUND if room not found", async () => {
        mockItemRepo = {
            findOne: jest.fn().mockResolvedValue({ inventoryNumber: "INV123", room: null })
        };
        mockStructureRepo = {
            findOne: jest.fn().mockResolvedValue(null)
        };

        mockRequest = {
            params: { inventoryNumber: "INV123" },
            body: { id: "room1" }
        } as unknown as any;

        await services.Item.updateItemRoomFromInventoryId(
            mockRequest as any,
            mockReply,
            {
                primary: mockItemRepo as Repository<entities.Item>,
                structure: mockStructureRepo as Repository<entities.Structure>
            }
        );

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.NOT_FOUND,
            "Room not found."
        );
    });
})