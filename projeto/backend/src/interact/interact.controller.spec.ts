import { Test, TestingModule } from '@nestjs/testing';
import { InteractController } from './interact.controller';

describe('InteractController', () => {
  let controller: InteractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractController],
    }).compile();

    controller = module.get<InteractController>(InteractController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
