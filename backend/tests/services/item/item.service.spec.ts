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
    let mockRepository: Partial<Repository<entities.Item>>;

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

        mockRepository = {
            find: jest.fn().mockResolvedValue(mockData)
        };

        await services.Item.getItems(mockRequest, mockReply, mockRepository as Repository<entities.Item>)
    
        expect(mockRepository.find).toHaveBeenCalledWith({});

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
        
        mockRepository = {
            findOne: jest.fn().mockResolvedValue(mockItem)
        };

        mockRequest = {
            params: {
                id: "26626652-2f35-4061-9701-1dcdb419273e"
            }
        } as FastifyRequest<{ Params: ItemByIdParams }>;
        await services.Item.getItemById(mockRequest, mockReply, mockRepository as Repository<entities.Item>)
    })

    it("reply error when forgetting id in request params", async () => {
        mockRequest = {
            params: {}
        } as FastifyRequest<{ Params: ItemByIdParams }>;

        await services.Item.getItemById(
            mockRequest,
            mockReply,
            {} as Repository<entities.Item>
        );

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.BAD_REQUEST,
            "Id is required to find an item"
        );
    });


    it("reply error when item is not found", async () => {
        mockRepository = {
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
            mockRepository as Repository<entities.Item>
        );

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "non-existent-id" } });

        expect(ReplyHelper.error).toHaveBeenCalledWith(
            mockReply,
            enums.StatusCode.NOT_FOUND,
            "Item not found"
        );
    });
})