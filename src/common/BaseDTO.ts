import { ApiProperty } from '@nestjs/swagger';

export class BaseDTO {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
