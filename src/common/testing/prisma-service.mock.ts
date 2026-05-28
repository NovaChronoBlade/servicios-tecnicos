export function createPrismaServiceMock() {
  return {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $executeRaw: jest.fn(),
    $executeRawUnsafe: jest.fn(),
    $queryRaw: jest.fn(),
    $queryRawUnsafe: jest.fn(),
    $transaction: jest.fn(async (callback: any) =>
      typeof callback === 'function'
        ? callback(createPrismaServiceMock())
        : callback,
    ),
  };
}

export type PrismaServiceMock = ReturnType<typeof createPrismaServiceMock>;
