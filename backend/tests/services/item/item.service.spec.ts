import { entities } from "../../../src/entities";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";
import { services } from "../../../src/services";
import { ReplyHelper } from "../../../src/helpers";
import { enums } from "../../../src/enums";


jest.mock("../../../src/helpers", () => ({
    ReplyHelper: {
        send: jest.fn()
    }
}))

describe("items service", () => {
    let mockReply: FastifyReply;
    let mockRequest: FastifyRequest;
    let mockRepository: Partial<Repository<entities.Item>>;


    beforeEach(() => {
        mockReply = {} as FastifyReply;
        mockRequest = {} as FastifyRequest;
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
})