import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ResourceAlreadyExistsException } from '../common/exceptions/resource-already-exists';
import { ResourceNotFoundException } from '../common/exceptions/resource-not-found';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly userModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existProduct = await this.findUniqueProduct(
      createProductDto.name,
      createProductDto.brand,
    );

    if (existProduct) {
      throw new ResourceAlreadyExistsException('Product already exists');
    }

    const createProduct = new this.userModel(createProductDto);
    return createProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.userModel.find().exec();
    return products;
  }

  async findOne(id: string): Promise<Product> {
    return await this.userModel.findById(id).exec();
  }

  async findUniqueProduct(name: string, brand: string): Promise<Product> {
    return await this.userModel
      .findOne({
        $and: [{ name }, { brand }],
      })
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateProductDto,
        },
        { new: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new ResourceNotFoundException('Product not exists');
    }
    return updatedProduct.toObject();
  }

  async remove(id: string): Promise<string> {
    const data = await this.userModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new ResourceNotFoundException('Product not exists');
    }
    return 'Product deleted';
  }
}
