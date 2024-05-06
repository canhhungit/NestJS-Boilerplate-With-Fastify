import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseMongoIdPipe } from 'src/pipes/parse-mongo-id.pipe';
import { COLLECTION_LEVEL } from 'src/schemas/collection.entity';
import { ApiDocsPagination } from 'src/setup-swagger';
import { generateNextKey } from 'src/shared/utils/pagination';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
@ApiTags('collections')
export class CollectionsController {
  constructor(private readonly collections_service: CollectionsService) {}

  @Post()
  @ApiOperation({
    summary: 'User create their collection',
  })
  @ApiBody({
    type: CreateCollectionDto,
    examples: {
      user_1: {
        value: {
          name: 'John',
          level: COLLECTION_LEVEL.EASY,
        } as CreateCollectionDto,
      },
    },
  })
  // @ApiBearerAuth('token')
  // @UseGuards(JwtAccessTokenGuard)
  create(@Body() create_collection_dto: CreateCollectionDto) {
    return this.collections_service.create({
      ...create_collection_dto,
    });
  }

  @Get()
  @ApiDocsPagination('collection')
  @ApiQuery({
    name: 'level',
    type: 'array',
    examples: {
      one_level_type: {
        value: [COLLECTION_LEVEL.HARD],
      },
      two_level_type: {
        value: [COLLECTION_LEVEL.EASY, COLLECTION_LEVEL.MEDIUM],
      },
    },
    required: false,
  })
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('level') level: string[],
  ) {
    if (level && typeof level === 'string') {
      level = [level];
    }
    return this.collections_service.findAll({ level }, { offset, limit });
  }

  @Get('keyset-pagination')
  @ApiDocsPagination('collection')
  @ApiQuery({ name: 'last_id', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async findAllUsingKeyset(
    @Query('search') search: string,
    @Query('last_id', ParseMongoIdPipe) last_id: string,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    if (offset) {
      const { count, items } = await this.collections_service.findAll(
        { search },
        { offset, limit },
      );
      return {
        count,
        items,
        next_key: generateNextKey(items, ['name']),
      };
    }
    return await this.collections_service.findAllUsingKeysetPagination(
      { search },
      { last_id },
      { limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    examples: {
      migration_id_1: {
        value: '660a6fbbb359def53c731bdd',
        description: `Collection vocabulary`,
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return await this.collections_service.getDetail(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() update_collection_dto: UpdateCollectionDto,
  ) {
    return this.collections_service.update(id, update_collection_dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collections_service.remove(id);
  }
}
