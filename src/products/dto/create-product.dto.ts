import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Provider } from '../../providers/schemas/product.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  @Length(4, 100)
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  readonly category: string;

  readonly stock: number;
  readonly status: boolean;
  readonly providers: Provider[];
}
