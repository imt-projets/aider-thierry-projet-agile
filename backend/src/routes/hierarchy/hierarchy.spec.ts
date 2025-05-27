import { describe, it, expect, vi, beforeAll } from 'vitest';
import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';

// Mock de createRouterConfig
vi.mock('@/helpers/api/router.helper', () => {
  return {
    createRouterConfig: vi.fn(() : FastifyPluginAsync => {
        return async (fastify : FastifyInstance) => {
            fastify.get('/', async (req, res) => {
                return res.send([{ id: 1, name: 'Mocked Hierarchy' }]);
            });
        };
    }),
  };
});

import hierarchy from './index';
import { DataSource } from 'typeorm';

let fastify : FastifyInstance;


const mockRepository = {
  find: vi.fn(() => Promise.resolve([])),
};

const mockDataSource = {
  getRepository: vi.fn(() => mockRepository),
};

beforeAll(async () => {
    fastify = Fastify();

    fastify.decorate('orm', mockDataSource as unknown as DataSource);

    await fastify.register(hierarchy);
});

describe('GET /hierarchy', () => {
  it('returns mocked hierarchy', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([{ id: 1, name: 'Mocked Hierarchy' }]);
  });
});