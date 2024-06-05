import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Provider } from '../../providers/schemas/product.schema';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true })
  readonly price: number;

  @Prop({ required: true })
  readonly description: string;

  @Prop({ required: true })
  readonly brand: string;

  @Prop({ required: true })
  readonly category: string;

  @Prop({ default: 0 })
  readonly stock: number;

  @Prop({ default: true })
  readonly status: boolean;

  @Prop({ default: [] })
  readonly providers: Provider[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
