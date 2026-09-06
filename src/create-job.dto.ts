import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const JOB_TYPES = ['deliver', 'pickup', 'buy', 'errand', 'move'] as const;
export type JobTypeValue = (typeof JOB_TYPES)[number];

export class CreateJobDto {
  @IsIn(JOB_TYPES)
  type!: JobTypeValue;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  what!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  pickup!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  dropoff!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  when!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  budgetKes?: number | null;
}
